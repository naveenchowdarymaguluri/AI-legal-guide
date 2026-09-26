const http = require('http');

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Content-Type': 'application/json'
    };
    const reqOptions = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: { ...defaultHeaders, ...(options.headers || {}) }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting End-to-End Verification ---');
  let failures = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
    } catch (err) {
      console.error(`[FAIL] ${name}: ${err.message}`);
      failures++;
    }
  }

  // 1. Pages (All 15 views + alias routes)
  const pages = [
    '/',
    '/dashboard',
    '/assistant',
    '/documents',
    '/analysis',
    '/compare',
    '/research',
    '/drafts',
    '/cases',
    '/settings',
    '/contract-intelligence',
    '/compliance-audit',
    '/login',
    '/signup',
    '/register',
    '/pricing',
    '/how-it-works',
    '/security',
    '/states'
  ];

  for (const page of pages) {
    await test(`Page: ${page}`, async () => {
      const res = await request(page);
      if (res.status !== 200) throw new Error(`HTTP status ${res.status}`);
      if (typeof res.data !== 'string' || !res.data.includes('<!DOCTYPE html>')) {
        throw new Error('Response did not contain valid HTML');
      }
    });
  }

  // 2. System Status
  await test('API: System Status', async () => {
    const res = await request('/api/system/status');
    if (res.status !== 200 || !res.data.online) throw new Error('System status not online');
    if (res.data.status !== 'operational') throw new Error('System status not operational');
  });

  // 3. Documents API
  let firstDocId = null;
  await test('API: Get Documents', async () => {
    const res = await request('/api/documents');
    const docs = Array.isArray(res.data) ? res.data : (res.data && res.data.documents);
    if (res.status !== 200 || !Array.isArray(docs) || docs.length === 0) {
      throw new Error('Documents array empty or invalid');
    }
    firstDocId = docs[0].id;
    if (!docs[0].clauses || docs[0].clauses.length === 0) {
      throw new Error('Document clauses not populated');
    }
  });

  // 4. Document Download
  await test('API: Download Document', async () => {
    const res = await request(`/api/documents/${firstDocId}/download`);
    if (res.status !== 200) throw new Error(`Download status ${res.status}`);
    if (typeof res.data !== 'string' || !res.data.includes('CERTIFIED DOCUMENT EXTRACT')) {
      throw new Error('Download content missing header');
    }
  });

  // 5. Assistant API (both /message and /chat)
  await test('API: Assistant Query', async () => {
    const res = await request('/api/assistant/message', {
      method: 'POST',
      body: { query: 'Analyze the liability limitation in Master Cloud Agreement' }
    });
    if (res.status !== 200 || !res.data.message || !res.data.message.text) {
      throw new Error('Assistant query returned invalid format');
    }
  });

  // 6. Analysis API
  await test('API: Document Analysis', async () => {
    const res = await request(`/api/analysis/${firstDocId}`);
    if (res.status !== 200 || !res.data.clauses || res.data.clauses.length === 0) {
      throw new Error('Analysis failed to return clauses');
    }
  });

  // 7. Compare API (Redline Diff)
  await test('API: Redline Compare', async () => {
    const res = await request('/api/compare', {
      method: 'POST',
      body: { docA: 'doc-1', docB: 'doc-2' }
    });
    if (res.status !== 200 || !res.data.stats || !res.data.diff) {
      throw new Error('Compare failed or missing diff stats');
    }
  });

  // 8. Research API
  await test('API: Legal Research', async () => {
    const res = await request('/api/research?q=indemnity');
    const results = res.data && res.data.results ? res.data.results : res.data;
    if (res.status !== 200 || !Array.isArray(results) || results.length === 0) {
      throw new Error('Research query returned empty');
    }
  });

  // 9. Drafts API
  await test('API: Draft Generation', async () => {
    const res = await request('/api/drafts/generate', {
      method: 'POST',
      body: {
        templateId: 'tpl-1',
        params: {
          clientName: 'Apex Capital Inc.',
          counterparty: 'Vanguard Dynamics',
          effectiveDate: '2026-04-01',
          governingLaw: 'Delaware Chancery Law',
          liabilityCap: '$5,000,000'
        }
      }
    });
    const draftText = res.data?.draftText || res.data?.draft?.content;
    if (res.status !== 200 || !draftText || !draftText.includes('Apex Capital Inc.')) {
      throw new Error('Draft generation failed or variable binding missing');
    }
  });

  // 10. Cases & Tasks API (Persistence)
  await test('API: Cases and Task Persistence', async () => {
    const casesRes = await request('/api/cases');
    if (casesRes.status !== 200 || !Array.isArray(casesRes.data) || casesRes.data.length === 0) {
      throw new Error('Failed to fetch cases');
    }
    const testCase = casesRes.data[0];
    const targetTask = testCase.tasks && testCase.tasks[0];
    if (!targetTask) throw new Error('No task available in test case');

    const initialStatus = targetTask.done;
    
    // Toggle task
    const toggleRes = await request(`/api/cases/${testCase.id}/tasks`, {
      method: 'POST',
      body: {
        taskId: targetTask.id,
        done: !initialStatus
      }
    });
    if (toggleRes.status !== 200) throw new Error('Task toggle API failed');

    // Verify persistence
    const recheckRes = await request('/api/cases');
    const updatedCase = recheckRes.data.find(c => c.id === testCase.id);
    const updatedTask = updatedCase.tasks.find(t => t.id === targetTask.id);
    if (updatedTask.done === initialStatus) {
      throw new Error('Task state did not persist in database');
    }

    // Toggle back
    await request(`/api/cases/${testCase.id}/tasks`, {
      method: 'POST',
      body: {
        taskId: targetTask.id,
        done: initialStatus
      }
    });
  });

  // 11. Settings API (Keys & Team)
  await test('API: Settings Dynamic Keys and Team', async () => {
    // Create API Key
    const keyRes = await request('/api/settings/keys', {
      method: 'POST',
      body: { name: 'E2E Test Key', environment: 'Testing' }
    });
    if (keyRes.status !== 201 || !keyRes.data.key || !keyRes.data.key.startsWith('lex_live_')) {
      throw new Error('Failed to create API key');
    }

    // Delete API Key
    const delKeyRes = await request(`/api/settings/keys/${encodeURIComponent(keyRes.data.key)}`, {
      method: 'DELETE'
    });
    if (delKeyRes.status !== 200) throw new Error('Failed to delete API key');

    // Invite Team Member
    const teamRes = await request('/api/settings/team', {
      method: 'POST',
      body: { name: 'E2E Test Associate', email: 'test.associate@juris.ai', role: 'Paralegal' }
    });
    if (teamRes.status !== 201 || !teamRes.data.email) {
      throw new Error('Failed to invite team member');
    }

    // Delete Team Member
    const delTeamRes = await request(`/api/settings/team/${encodeURIComponent(teamRes.data.email)}`, {
      method: 'DELETE'
    });
    if (delTeamRes.status !== 200) throw new Error('Failed to remove team member');
  });

  console.log(`\n--- Verification Finished with ${failures} failure(s) ---`);
  if (failures > 0) process.exit(1);
}

runTests();
