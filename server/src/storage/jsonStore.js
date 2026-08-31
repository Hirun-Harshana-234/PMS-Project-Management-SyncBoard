const fs = require("fs/promises");
const path = require("path");

const dataFile = process.env.DATA_FILE || path.resolve(__dirname, "../../data/pms.json");
const emptyData = () => ({ users: [], boards: [], tasks: [], activities: [], accessRequests: [], messages: [] });
let data = emptyData();
let ready = false;
let writeQueue = Promise.resolve();

async function initStore() {
  if (ready) return data;
  try {
    data = { ...emptyData(), ...JSON.parse(await fs.readFile(dataFile, "utf8")) };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await persist();
  }
  ready = true;
  return data;
}

function persist() {
  const snapshot = JSON.stringify(data, null, 2);
  writeQueue = writeQueue.then(async () => {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    const temporary = `${dataFile}.tmp`;
    await fs.writeFile(temporary, snapshot, "utf8");
    await fs.rename(temporary, dataFile);
  });
  return writeQueue;
}

function collection(name) {
  if (!ready) throw new Error("Local data store has not been initialized.");
  return data[name];
}

async function resetStore() {
  data = emptyData();
  ready = true;
  await persist();
}

module.exports = { initStore, persist, collection, resetStore, dataFile };
