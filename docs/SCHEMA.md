# PMS Local Data Schema

The backend stores data in one JSON file, `server/data/pms.json` by default. Set `DATA_FILE` to use another location.

The file contains six arrays: `users`, `boards`, `tasks`, `activities`, `accessRequests`, and `messages`. Records use UUID identifiers and ISO date strings. Relationships are stored as IDs and expanded by the repository layer before API responses are returned.

Passwords remain bcrypt hashes. Refresh tokens are stored only as SHA-256 hashes. Task `revision` values provide stale-edit conflict protection.
