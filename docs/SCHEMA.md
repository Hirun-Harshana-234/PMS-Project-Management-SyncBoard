# PMS MongoDB Schema

The backend stores data in MongoDB using the connection string in `MONGO_URI`. Set `MONGO_DATABASE` to choose the database name when the URI does not already specify one.

The database contains six collections: `users`, `boards`, `tasks`, `activities`, `accessRequests`, and `messages`. Records use UUID string identifiers. Relationships are stored as string IDs and expanded with Mongoose `populate()` before API responses are returned.

Passwords remain bcrypt hashes. Refresh tokens are stored only as SHA-256 hashes. Task `revision` values provide stale-edit conflict protection.
