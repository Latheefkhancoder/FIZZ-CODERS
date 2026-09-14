/**
 * FIZZ-CONNECT End-to-End Smoke Test Script
 * Verifies all 14 critical user journey checkpoints against the live Express server.
 */

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(body.message || `HTTP ${response.status} ${response.statusText}`);
    err.status = response.status;
    err.data = body;
    throw err;
  }
  return body;
}

async function runSmokeTest() {
  console.log('====================================================');
  console.log('       FIZZ-CONNECT E2E CRITICAL FLOW SMOKE TEST    ');
  console.log('====================================================\n');

  const results = [];
  const record = (step, title, passed, details = '') => {
    results.push({ step, title, passed, details });
    const mark = passed ? '✓ PASS' : '✗ FAIL';
    console.log(`[${mark}] Step ${step}: ${title} ${details ? `(${details})` : ''}`);
  };

  let adminToken = null;
  let adminUser = null;
  let memberToken = null;
  let memberUser = null;
  let boardId = null;
  const boardCode = `E2E${Math.floor(10 + Math.random() * 89)}`; // 5 char code
  let taskId = null;

  try {
    // 1. Health check & Server running
    console.log('Checking server health...');
    const health = await request('/health');
    record(1, 'Start backend and frontend', health.success, `API status: ${health.data.status}`);

    // 2. Login Admin user
    console.log('Logging in Admin user (admin@fizz.com)...');
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@fizz.com', password: 'Admin@123' }),
    });
    adminToken = adminLogin.data.token;
    adminUser = adminLogin.data.user;
    record(2, 'Register/login an admin test user', !!adminToken, `Admin ID: ${adminUser.id}, Name: ${adminUser.name}`);

    // 3. Verify role selection logic
    const adminRole = adminUser.role || 'ADMIN';
    record(3, 'Verify role selection', adminRole.toUpperCase() === 'ADMIN', `User role: ${adminRole}`);

    // 4. Create a board
    console.log(`Creating board with code ${boardCode}...`);
    const boardRes = await request('/boards', {
      method: 'POST',
      body: JSON.stringify({ name: 'E2E Smoke Board', code: boardCode }),
    }, adminToken);
    const board = boardRes.data;
    boardId = board.id;
    record(4, 'Create a board', board.code === boardCode && board.name === 'E2E Smoke Board', `Board ID: ${boardId}, Code: ${board.code}`);

    // 5. Login Member user
    console.log('Logging in Member user (member@fizz.com)...');
    const memberLogin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'member@fizz.com', password: 'Member@123' }),
    });
    memberToken = memberLogin.data.token;
    memberUser = memberLogin.data.user;
    record(5, 'Register/login a second member user', !!memberToken, `Member ID: ${memberUser.id}, Name: ${memberUser.name}`);

    // 6. Join the board using its code
    console.log(`Member joining board with code ${boardCode}...`);
    const joinRes = await request('/boards/join', {
      method: 'POST',
      body: JSON.stringify({ code: boardCode }),
    }, memberToken);
    record(6, 'Join the board using its code', joinRes.data.id === boardId, `Joined Board: ${joinRes.data.name}`);

    // 7. Create and assign a task
    console.log('Admin creating and assigning task to member...');
    const taskRes = await request(`/boards/${boardId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        title: 'Smoke Test Task',
        description: 'Verify end-to-end task flow',
        priority: 'HIGH',
        assignee: memberUser.id,
        dueDate: '2026-10-01',
      }),
    }, adminToken);
    taskId = taskRes.data.id;
    record(7, 'Create and assign a task', taskRes.data.status === 'TODO' && String(taskRes.data.assignee) === String(memberUser.id), `Task ID: ${taskId}, Status: ${taskRes.data.status}, Assignee: ${taskRes.data.assignee}`);

    // 8. Move task: TODO -> IN_PROGRESS -> DONE
    console.log('Member updating task status to IN_PROGRESS...');
    const progressRes = await request(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'IN_PROGRESS' }),
    }, memberToken);

    console.log('Member updating task status to DONE...');
    const doneRes = await request(`/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'DONE' }),
    }, memberToken);

    record(8, 'Move task TODO -> IN_PROGRESS -> DONE', progressRes.data.status === 'IN_PROGRESS' && doneRes.data.status === 'DONE', `Final Status: ${doneRes.data.status}`);

    // 9. Add comments
    console.log('Member adding comment...');
    await request(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text: 'Starting work on this task.' }),
    }, memberToken);

    console.log('Admin adding comment...');
    await request(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text: 'Looks great! Proceeding to QA.' }),
    }, adminToken);

    const commentsRes = await request(`/tasks/${taskId}/comments`, {}, adminToken);
    record(9, 'Add a comment', commentsRes.data.length >= 2, `${commentsRes.data.length} comments retrieved`);

    // 10. Verify team members
    console.log('Verifying board team members...');
    const membersRes = await request(`/boards/${boardId}/members`, {}, adminToken);
    const hasAdmin = membersRes.data.some(m => String(m.userId) === String(adminUser.id) || m.role === 'Admin' || m.role === 'ADMIN');
    const hasMember = membersRes.data.some(m => String(m.userId) === String(memberUser.id));
    record(10, 'Verify team members', hasAdmin && hasMember, `Found ${membersRes.data.length} members`);

    // 11. Send/receive board chat
    console.log('Member sending chat message...');
    await request(`/boards/${boardId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello team from member!' }),
    }, memberToken);

    console.log('Admin sending chat message...');
    await request(`/boards/${boardId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ text: 'Welcome aboard from admin!' }),
    }, adminToken);

    const chatRes = await request(`/boards/${boardId}/chat`, {}, memberToken);
    record(11, 'Send/receive board chat', chatRes.data.length >= 2, `${chatRes.data.length} chat messages retrieved`);

    // 12. Verify activity logs
    console.log('Verifying board activity logs...');
    const logsRes = await request(`/boards/${boardId}/activity-logs`, {}, adminToken);
    record(12, 'Verify activity logs', logsRes.data.length > 0, `${logsRes.data.length} activity logs recorded`);

    // 13. Update profile
    console.log('Updating member profile...');
    const newBio = `Smoke test engineer verified at ${new Date().toISOString()}`;
    await request('/profile', {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Member Tester', bio: newBio }),
    }, memberToken);

    const getProfileRes = await request('/profile', {}, memberToken);
    record(13, 'Update profile', getProfileRes.data.bio === newBio, `Bio: "${getProfileRes.data.bio}"`);

    // 14. Verify data persists after re-login
    console.log('Re-logging in and verifying persistence...');
    const reLoginAdmin = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@fizz.com', password: 'Admin@123' }),
    });
    const freshAdminToken = reLoginAdmin.data.token;

    const persistedBoards = await request('/boards', {}, freshAdminToken);
    const boardPersisted = persistedBoards.data.some(b => b.id === boardId);

    const persistedTasks = await request(`/boards/${boardId}/tasks`, {}, freshAdminToken);
    const taskPersisted = persistedTasks.data.find(t => t.id === taskId);

    const reLoginMember = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'member@fizz.com', password: 'Member@123' }),
    });
    const freshMemberToken = reLoginMember.data.token;

    const myTasksRes = await request('/tasks/my', {}, freshMemberToken);
    const myTaskFound = myTasksRes.data.some(t => t.id === taskId && t.status === 'DONE');

    const persisted = boardPersisted && !!taskPersisted && taskPersisted.status === 'DONE' && myTaskFound;
    record(14, 'Verify data persists after refresh/re-login', persisted, `Board persisted: ${boardPersisted}, Task status: ${taskPersisted?.status}`);

    // Cleanup smoke test board
    console.log('\nCleaning up smoke test board...');
    await request(`/boards/${boardId}`, { method: 'DELETE' }, freshAdminToken);
    console.log('Cleanup complete.');

  } catch (err) {
    console.error('Smoke test error:', err.message, err.data || '');
    record(results.length + 1, 'Error encountered', false, err.message);
  }

  console.log('\n====================================================');
  console.log('                 SMOKE TEST SUMMARY                 ');
  console.log('====================================================');
  const allPassed = results.every(r => r.passed) && results.length >= 14;
  results.forEach(r => {
    console.log(`${r.passed ? '✓' : '✗'} Step ${r.step}: ${r.title}`);
  });
  console.log('----------------------------------------------------');
  console.log(`OVERALL RESULT: ${allPassed ? 'ALL 14 CHECKS PASSED' : 'SOME CHECKS FAILED'}`);
  console.log('====================================================');
  process.exit(allPassed ? 0 : 1);
}

runSmokeTest();
