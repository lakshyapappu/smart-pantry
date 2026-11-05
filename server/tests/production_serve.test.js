const request = require('supertest');
const assert = require('assert');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

async function testProductionSetup() {
  console.log('🧪 Testing Production Serving & Route Configuration...');

  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  try {
    // 1. Health check endpoint
    console.log('\n--- 1. Testing GET /api/health ---');
    const healthRes = await request(app).get('/api/health');
    assert.strictEqual(healthRes.status, 200, 'Health check must return 200');
    assert.strictEqual(healthRes.body.status, 'healthy');
    assert.strictEqual(healthRes.body.database.connected, true);
    console.log('✅ GET /api/health returns 200 and healthy status:', healthRes.body);

    // 2. Unmatched API route -> must return 404 JSON, NOT index.html
    console.log('\n--- 2. Testing Unmatched /api/* Route ---');
    const api404Res = await request(app).get('/api/non-existent-route-12345');
    assert.strictEqual(api404Res.status, 404, 'Unknown API route must return 404');
    assert.strictEqual(api404Res.body.success, false);
    assert.ok(api404Res.body.message.includes('API route not found'));
    assert.strictEqual(api404Res.headers['content-type'].includes('application/json'), true);
    console.log('✅ Unmatched /api/* correctly returns 404 JSON (NOT intercepted by React SPA index.html)');

    // 3. Root route -> must serve React index.html
    console.log('\n--- 3. Testing Root Route GET / ---');
    const rootRes = await request(app).get('/');
    assert.strictEqual(rootRes.status, 200, 'Root route must return 200');
    assert.strictEqual(rootRes.headers['content-type'].includes('text/html'), true);
    assert.ok(rootRes.text.includes('<div id="root"></div>') || rootRes.text.includes('<!doctype html>'), 'Root must contain React HTML');
    console.log('✅ GET / successfully serves client/dist/index.html');

    // 4. React Router Direct Refresh / Deep Routes -> must serve index.html
    console.log('\n--- 4. Testing React Router SPA Fallback (Deep routes & page refreshes) ---');
    const deepRoutes = ['/pantry', '/recipes', '/grocery-list', '/community', '/login', '/register'];
    for (const r of deepRoutes) {
      const res = await request(app).get(r);
      assert.strictEqual(res.status, 200, `Direct refresh of ${r} must return 200`);
      assert.strictEqual(res.headers['content-type'].includes('text/html'), true);
      assert.ok(res.text.includes('<div id="root"></div>') || res.text.includes('<!doctype html>'));
    }
    console.log('✅ All direct React Router deep routes (/pantry, /recipes, /community, etc.) return index.html for client-side routing');

    // 5. Static Assets serving
    console.log('\n--- 5. Testing Static Assets Serving ---');
    const fs = require('fs');
    const path = require('path');
    const assetsDir = path.resolve(__dirname, '../../client/dist/assets');
    if (fs.existsSync(assetsDir)) {
      const assetFiles = fs.readdirSync(assetsDir);
      const jsFile = assetFiles.find(f => f.endsWith('.js'));
      const cssFile = assetFiles.find(f => f.endsWith('.css'));

      if (jsFile) {
        const jsRes = await request(app).get(`/assets/${jsFile}`);
        assert.strictEqual(jsRes.status, 200);
        assert.strictEqual(jsRes.headers['content-type'].includes('javascript'), true);
        console.log(`✅ Static JS asset (/assets/${jsFile}) served with correct Content-Type`);
      }
      if (cssFile) {
        const cssRes = await request(app).get(`/assets/${cssFile}`);
        assert.strictEqual(cssRes.status, 200);
        assert.strictEqual(cssRes.headers['content-type'].includes('css'), true);
        console.log(`✅ Static CSS asset (/assets/${cssFile}) served with correct Content-Type`);
      }
    }

    console.log('\n🎉 ALL PRODUCTION SERVING TESTS PASSED 100%! ✨\n');
  } finally {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
}

testProductionSetup().catch(err => {
  console.error('❌ Production setup test failed:', err);
  process.exit(1);
});
