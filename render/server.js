import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS universal para todos os players
app.use(cors());

// Proxy HLS
app.use('/hls', createProxyMiddleware({
  target: 'https://playtvbaixarapp.vercel.app',
  changeOrigin: true,
  secure: false,
  pathRewrite: {
    '^/hls': ''
  },
  onProxyReq: (proxyReq) => {
    // Cabeçalhos para compatibilidade com players
    proxyReq.setHeader('Origin', 'https://playtvbaixarapp.vercel.app');
    proxyReq.setHeader('Referer', 'https://playtvbaixarapp.vercel.app/');
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Headers'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,OPTIONS';
  }
}));

// Página de teste opcional
app.get('/', (req, res) => {
  res.send(`
    <h1>Proxy funcionando!</h1>
    <p>Use: <code>/hls/playlist.m3u8</code></p>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Proxy HLS rodando em http://localhost:${PORT}`);
});
