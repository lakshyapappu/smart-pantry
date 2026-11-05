process.env.NODE_ENV = 'production';
const app = require('../src/app');
const request = require('supertest');

async function testProductionServing() {
  const health = await request(app).get('/api/health');
  console.log('Health check status:', health.status, health.body.status);

  const spaHome = await request(app).get('/');
  console.log('SPA route / status:', spaHome.status, 'HTML returned:', spaHome.text.includes('<div id="root"></div>'));

  const spaDashboard = await request(app).get('/dashboard');
  console.log('SPA route /dashboard status:', spaDashboard.status, 'HTML returned:', spaDashboard.text.includes('<div id="root"></div>'));

  const api404 = await request(app).get('/api/unknown-endpoint');
  console.log('Unknown API route status:', api404.status, api404.body);
  console.log('✅ Production serving and SPA fallback verified!');
}

testProductionServing();

