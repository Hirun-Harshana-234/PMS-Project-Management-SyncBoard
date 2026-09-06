const crypto = require("crypto");
const { collection, persist } = require("./jsonStore");

const clone = (value) => value == null ? value : structuredClone(value);
const id = (value) => String(value?._id ?? value?.id ?? value ?? "");
const getValues = (object, path) => path.split(".").reduce((values, key) => values.flatMap((value) => Array.isArray(value) ? value.map((item) => item?.[key]) : [value?.[key]]), [object]).flat(Infinity);

function equal(actual, expected) {
  if (expected instanceof RegExp) return expected.test(String(actual ?? ""));
  return id(actual) === id(expected);
}

function matches(item, query = {}) {
  return Object.entries(query).every(([key, expected]) => {
    if (key === "$or") return expected.some((part) => matches(item, part));
    const values = getValues(item, key);
    if (expected && typeof expected === "object" && !(expected instanceof RegExp) && !Array.isArray(expected)) {
      if ("$ne" in expected) return values.every((value) => !equal(value, expected.$ne));
      return values.some((value) => matches(value || {}, expected));
    }
    return values.some((value) => equal(value, expected));
  });
}

function applyUpdate(target, update) {
  Object.assign(target, clone(update.$set || {}));
  for (const [key, amount] of Object.entries(update.$inc || {})) target[key] = Number(target[key] || 0) + amount;
  for (const [key, value] of Object.entries(update.$push || {})) {
    target[key] ||= [];
    target[key].push({ _id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...clone(value) });
  }
  for (const [key, condition] of Object.entries(update.$pull || {})) {
    target[key] = (target[key] || []).filter((entry) => !matches(entry, condition));
  }
  target.updatedAt = new Date().toISOString();
}

class Query {
  constructor(model, query, { one = false } = {}) { this.model = model; this.query = query || {}; this.one = one; this.sortBy = null; this.max = null; this.populates = []; this.plain = false; }
  sort(spec) { this.sortBy = spec; return this; }
  limit(value) { this.max = value; return this; }
  populate(path) { (Array.isArray(path) ? path : [path]).forEach((item) => this.populates.push(typeof item === "string" ? item : item.path)); return this; }
  select() { return this; }
  lean() { this.plain = true; return this; }
  async exec() {
    let rows = collection(this.model.collectionName).filter((item) => matches(item, this.query)).map(clone);
    if (this.sortBy) {
      const [field, direction] = Object.entries(this.sortBy)[0];
      rows.sort((a, b) => (getValues(a, field)[0] > getValues(b, field)[0] ? 1 : -1) * direction);
    }
    if (this.max != null) rows = rows.slice(0, this.max);
    const hydrated = rows.map((row) => new this.model(row, true));
    for (const document of hydrated) for (const path of this.populates) await this.model.populate(document, path);
    const result = this.one ? hydrated[0] || null : hydrated;
    if (!this.plain) return result;
    return this.one ? result?.toObject() || null : result.map((item) => item.toObject());
  }
  then(resolve, reject) { return this.exec().then(resolve, reject); }
}

class BaseModel {
  constructor(values = {}, hydrated = false) {
    Object.assign(this, clone(this.constructor.defaults()), clone(values));
    this._id ||= crypto.randomUUID();
    if (!hydrated) this.createdAt ||= new Date().toISOString();
    this.updatedAt ||= this.createdAt;
  }
  static defaults() { return {}; }
  static find(query) { return new Query(this, query); }
  static findOne(query) { return new Query(this, query, { one: true }); }
  static findById(value) { return this.findOne({ _id: value }); }
  static async create(values) { const document = new this(values); await document.save(); return document; }
  static async insertMany(values) { return Promise.all(values.map((value) => this.create(value))); }
  static async countDocuments(query = {}) { return collection(this.collectionName).filter((item) => matches(item, query)).length; }
  static async exists(query) { return collection(this.collectionName).some((item) => matches(item, query)); }
  static async updateOne(query, update) { const row = collection(this.collectionName).find((item) => matches(item, query)); if (!row) return { matchedCount: 0 }; applyUpdate(row, update); await persist(); return { matchedCount: 1 }; }
  static async updateMany(query, update) { const rows = collection(this.collectionName).filter((item) => matches(item, query)); rows.forEach((row) => applyUpdate(row, update)); await persist(); return { matchedCount: rows.length }; }
  static findOneAndUpdate(query, update) { const model = this; return new class extends Query { async exec() { const row = collection(model.collectionName).find((item) => matches(item, query)); if (!row) return null; applyUpdate(row, update); await persist(); const document = new model(row, true); for (const path of this.populates) await model.populate(document, path); return document; } }(this, query, { one: true }); }
  static async findOneAndDelete(query) { const rows = collection(this.collectionName); const index = rows.findIndex((item) => matches(item, query)); if (index < 0) return null; const [row] = rows.splice(index, 1); await persist(); return new this(row, true); }
  static async aggregate(pipeline) {
    let rows = collection(this.collectionName).map(clone);
    for (const stage of pipeline) {
      if (stage.$match) rows = rows.filter((row) => matches(row, stage.$match));
      if (stage.$group) {
        const groups = new Map();
        for (const row of rows) { const key = stage.$group._id === null ? null : row[stage.$group._id.slice(1)]; const group = groups.get(key) || { _id: key, _rows: [] }; group._rows.push(row); groups.set(key, group); }
        rows = [...groups.values()].map((group) => { const output = { _id: group._id }; for (const [name, operation] of Object.entries(stage.$group)) { if (name === "_id") continue; if (operation.$avg) output[name] = group._rows.reduce((sum, row) => sum + Number(row[operation.$avg.slice(1)] || 0), 0) / group._rows.length; if (operation.$sum) output[name] = operation.$sum === 1 ? group._rows.length : 0; } return output; });
      }
    }
    return rows;
  }
  async save() {
    const rows = collection(this.constructor.collectionName);
    const index = rows.findIndex((item) => id(item) === id(this));
    this.updatedAt = new Date().toISOString();
    const value = this.toObject();
    if (index < 0) rows.push(value); else rows[index] = value;
    await persist(); return this;
  }
  toObject() { const value = {}; for (const [key, item] of Object.entries(this)) if (typeof item !== "function") value[key] = clone(item); return value; }
}

module.exports = { BaseModel, id, matches };
