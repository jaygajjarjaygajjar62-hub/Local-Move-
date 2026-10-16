import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const zipPath = path.join(__dirname, 'Localmove-frontend.zip');

const server = http.createServer((req, res) => {
  if (req.url === '/Localmove-frontend.zip' || req.url === '/download-file') {
    if (!fs.existsSync(zipPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('File not found');
    }
    const stat = fs.statSync(zipPath);
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="Localmove-frontend.zip"',
      'Content-Length': stat.size,
    });
    const readStream = fs.createReadStream(zipPath);
    readStream.pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Download Localmove Frontend</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; color: #f8fafc; margin: 0; }
    .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); text-align: center; max-width: 480px; width: 90%; border: 1px solid #334155; }
    h1 { margin-top: 0; color: #10b981; font-size: 1.75rem; }
    p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
    .btn { display: inline-block; margin-top: 1.5rem; background: #10b981; color: #022c22; font-weight: 700; padding: 0.9rem 2rem; border-radius: 0.5rem; text-decoration: none; font-size: 1.1rem; transition: background 0.2s; }
    .btn:hover { background: #059669; color: #ffffff; }
    .info { margin-top: 1.5rem; background: #0f172a; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.85rem; color: #cbd5e1; text-align: left; }
  </style>
</head>
<body>
  <div class="card">
    <h1>📦 Local Move Frontend</h1>
    <p>Your zip package is ready! Click the button below if your browser did not automatically start the download.</p>
    <a href="/Localmove-frontend.zip" class="btn" download id="dlBtn">⬇️ Download ZIP (465 KB)</a>
    <div class="info">
      <div><strong>File:</strong> Localmove-frontend.zip</div>
      <div><strong>Contents:</strong> Full React + Vite Source, Classic UI, Google Maps, Themes</div>
    </div>
  </div>
  <script>
    setTimeout(() => {
      window.location.href = '/Localmove-frontend.zip';
    }, 400);
  </script>
</body>
</html>`);
  }
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Download server running at http://localhost:${PORT}/`);
});
