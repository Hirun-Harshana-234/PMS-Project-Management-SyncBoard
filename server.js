const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname);
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

function isSafePath(candidatePath) {
  const resolvedRoot = path.resolve(rootDir);
  const resolvedCandidate = path.resolve(candidatePath);
  return resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(resolvedRoot + path.sep);
}

function getCandidatePaths(requestPath) {
  const decodedPath = decodeURIComponent(requestPath || '/').split('?')[0];
  const normalizedPath = decodedPath === '/' ? '/' : decodedPath.replace(/\\/g, '/');
  const trimmedPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/+$/, '');

  if (trimmedPath === '/') {
    return [path.join(rootDir, 'index.html')];
  }

  const relativePath = trimmedPath.replace(/^\/+/, '');
  const absolutePath = path.resolve(rootDir, relativePath || '.');
  const candidates = [absolutePath];

  if (path.extname(absolutePath) === '') {
    candidates.push(`${absolutePath}.html`);
    candidates.push(path.join(absolutePath, 'index.html'));
  }

  return candidates.filter((candidate, index) => candidates.indexOf(candidate) === index);
}

function resolveFilePath(requestPath, callback) {
  const candidatePaths = getCandidatePaths(requestPath);

  const tryNext = (index) => {
    if (index >= candidatePaths.length) {
      callback(null);
      return;
    }

    const candidatePath = candidatePaths[index];
    if (!isSafePath(candidatePath)) {
      tryNext(index + 1);
      return;
    }

    fs.stat(candidatePath, (err, stats) => {
      if (!err && stats.isFile()) {
        callback(candidatePath);
      } else {
        tryNext(index + 1);
      }
    });
  };

  tryNext(0);
}

const server = http.createServer((req, res) => {
  const requestPath = req.url || '/';

  resolveFilePath(requestPath, (filePath) => {
    if (!filePath) {
      const fallback = path.join(rootDir, 'index.html');
      fs.readFile(fallback, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': mimeTypes['.html'] });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server error');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
