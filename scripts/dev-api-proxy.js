#!/usr/bin/env node
const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = 8090;
const BACKEND_ORIGIN = 'https://karaadi.onrender.com';

const server = http.createServer((req, res) => {
  const allowedOrigin = req.headers.origin || '*';

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': req.headers['access-control-request-headers'] || '*',
    });
    return res.end();
  }

  const target = new URL(req.url, BACKEND_ORIGIN);
  const { host, origin, referer, ...forwardHeaders } = req.headers;

  const proxyReq = https.request(
    target,
    { method: req.method, headers: forwardHeaders },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, {
        ...proxyRes.headers,
        'Access-Control-Allow-Origin': allowedOrigin,
      });
      proxyRes.pipe(res);
    },
  );

  proxyReq.on('error', (err) => {
    res.writeHead(502, {
      'content-type': 'text/plain',
      'Access-Control-Allow-Origin': allowedOrigin,
    });
    res.end(`Proxy error: ${err.message}`);
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`Dev API proxy running at http://localhost:${PORT} -> ${BACKEND_ORIGIN}`);
});
