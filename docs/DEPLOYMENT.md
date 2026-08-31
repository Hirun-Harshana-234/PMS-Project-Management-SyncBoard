# Local Deployment Checklist

1. Set unique JWT secrets and strong demo-account passwords.
2. Optionally set `DATA_FILE` to choose where the JSON data file is stored.
3. Build and run the root `Dockerfile`, exposing port `8080`.
4. Mount the data directory as a persistent volume when using Docker.
5. Keep one application instance because JSON-file persistence and the in-process Socket.IO adapter are single-instance components.
6. Verify `GET /api/health` returns `200`.
7. Back up the JSON data file regularly.

This backend is designed for a clean, self-contained local deployment and does not require MongoDB or a cloud database.
