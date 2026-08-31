import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const clientRoot = fileURLToPath(new URL(".", import.meta.url));
const pageFiles = [
  "index.html",
  "login.html",
  "admin-login.html",
  "home.html",
  "dashboard.html",
  "board.html",
  "tasks.html",
  "add-task.html",
  "members.html",
  "contact.html",
  "reports.html",
  "notifications.html",
  "request-admin.html",
  "settings.html",
  "activity.html",
  "profile.html",
  "admin.html",
  "admin-dashboard.html",
  "admin-tasks.html",
  "admin-add-task.html",
  "admin-members.html",
  "admin-reports.html",
  "admin-requests.html",
  "admin-settings.html"
];

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pageFiles.map((file) => [file.replace(/\.html$/, ""), resolve(clientRoot, file)]))
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080",
      "/socket.io": { target: "http://localhost:8080", ws: true }
    }
  }
});
