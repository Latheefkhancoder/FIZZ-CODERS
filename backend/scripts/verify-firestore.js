/**
 * Standalone Firebase Firestore Persistence Verification Script
 *
 * Verifies real Firestore operations across all 7 domain repositories:
 * 1. Board creation/read/query
 * 2. Member creation/read/query/update
 * 3. Task creation/read/query/update
 * 4. Comment creation/read/query
 * 5. Activity creation/read/query
 * 6. Chat creation/read/query
 * 7. User profile read/update
 * 8. Board cascade deletion
 *
 * Ensures all test data is cleaned up and zero permanent test documents are left behind.
 */

const { db } = require("../src/config/firebase");
const {
  boardRepository,
  memberRepository,
  taskRepository,
  commentRepository,
  activityRepository,
  chatRepository,
  userRepository,
} = require("../src/repositories");

const TEST_PREFIX = `_TEST_${Date.now()}`;
const TEST_CODE = `V${Math.floor(1000 + Math.random() * 9000)}`; // 5-char code

async function runVerification() {
  console.log("==================================================");
  console.log("FIZZ-CONNECT Firestore Persistence Layer Verification");
  console.log(`Test Identifier: ${TEST_PREFIX}`);
  console.log(`Test Board Code: ${TEST_CODE}`);
  console.log("==================================================\n");

  let testBoard = null;
  let testMember = null;
  let testTask = null;
  let testComment = null;
  let testActivity = null;
  let testChat = null;
  const testUserId = `usr_${TEST_PREFIX}`;

  try {
    // ------------------------------------------------------------------------
    // 1. Board Operations
    // ------------------------------------------------------------------------
    console.log("1. Testing Board Repository...");
    testBoard = await boardRepository.create({
      name: `${TEST_PREFIX} Board`,
      code: TEST_CODE,
      ownerId: testUserId,
    });
    console.log(`   ✓ Board created: ID=${testBoard.id}, Code=${testBoard.code}`);

    const boardById = await boardRepository.findById(testBoard.id);
    if (!boardById || boardById.id !== testBoard.id) {
      throw new Error(`findById failed for board ${testBoard.id}`);
    }
    console.log(`   ✓ Board findById verified: Name="${boardById.name}"`);

    const boardByCode = await boardRepository.findByCode(TEST_CODE);
    if (!boardByCode || boardByCode.id !== testBoard.id) {
      throw new Error(`findByCode failed for code ${TEST_CODE}`);
    }
    console.log(`   ✓ Board findByCode verified: Found board ID=${boardByCode.id}`);

    const userBoards = await boardRepository.findUserBoards(testUserId, new Set());
    if (!userBoards.some((b) => b.id === testBoard.id)) {
      throw new Error("findUserBoards failed to find owned board");
    }
    console.log(`   ✓ Board findUserBoards verified: Found ${userBoards.length} board(s) for owner`);

    // ------------------------------------------------------------------------
    // 2. Member Operations
    // ------------------------------------------------------------------------
    console.log("\n2. Testing Member Repository...");
    testMember = await memberRepository.create({
      boardId: testBoard.id,
      userId: `${testUserId}_member`,
      name: "Test Member",
      email: `${TEST_PREFIX.toLowerCase()}@test.com`,
      role: "Member",
    });
    console.log(`   ✓ Member created: ID=${testMember.id}, Role=${testMember.role}`);

    const memberByBoardAndUser = await memberRepository.findByBoardAndUser(
      testBoard.id,
      `${testUserId}_member`
    );
    if (!memberByBoardAndUser || memberByBoardAndUser.id !== testMember.id) {
      throw new Error("findByBoardAndUser failed");
    }
    console.log(`   ✓ Member findByBoardAndUser verified`);

    const boardMembers = await memberRepository.findByBoardId(testBoard.id);
    if (!boardMembers.some((m) => m.id === testMember.id)) {
      throw new Error("findByBoardId failed");
    }
    console.log(`   ✓ Member findByBoardId verified: ${boardMembers.length} member(s) found`);

    const userBoardIds = await memberRepository.findUserBoardIds(`${testUserId}_member`);
    if (!userBoardIds.has(testBoard.id)) {
      throw new Error("findUserBoardIds failed");
    }
    console.log(`   ✓ Member findUserBoardIds verified: Set has boardId`);

    const updatedMember = await memberRepository.updateRole(
      testBoard.id,
      `${testUserId}_member`,
      "Admin"
    );
    if (!updatedMember || updatedMember.role !== "Admin") {
      throw new Error("updateRole failed");
    }
    console.log(`   ✓ Member updateRole verified: New role=${updatedMember.role}`);

    // ------------------------------------------------------------------------
    // 3. Task Operations
    // ------------------------------------------------------------------------
    console.log("\n3. Testing Task Repository...");
    testTask = await taskRepository.create({
      boardId: testBoard.id,
      title: `${TEST_PREFIX} Task`,
      description: "Testing Firestore Task persistence",
      priority: "HIGH",
      status: "TODO",
      creatorId: testUserId,
      creatorName: "Test Creator",
      assignee: `${testUserId}_member`,
      dueDate: "2026-12-31",
    });
    console.log(`   ✓ Task created: ID=${testTask.id}, Title="${testTask.title}"`);

    const taskById = await taskRepository.findById(testTask.id);
    if (!taskById || taskById.id !== testTask.id) {
      throw new Error(`findById failed for task ${testTask.id}`);
    }
    console.log(`   ✓ Task findById verified`);

    const boardTasks = await taskRepository.findByBoardId(testBoard.id, { priority: "HIGH" });
    if (!boardTasks.some((t) => t.id === testTask.id)) {
      throw new Error("findByBoardId with filter failed");
    }
    console.log(`   ✓ Task findByBoardId (with filter) verified: Found ${boardTasks.length} task(s)`);

    const assignedTasks = await taskRepository.findByAssigneeId(`${testUserId}_member`);
    if (!assignedTasks.some((t) => t.id === testTask.id)) {
      throw new Error("findByAssigneeId failed");
    }
    console.log(`   ✓ Task findByAssigneeId verified: Found ${assignedTasks.length} assigned task(s)`);

    const updatedTask = await taskRepository.update(testTask.id, {
      status: "IN_PROGRESS",
      priority: "URGENT",
    });
    if (!updatedTask || updatedTask.status !== "IN_PROGRESS" || updatedTask.priority !== "URGENT") {
      throw new Error("task update failed");
    }
    console.log(`   ✓ Task update verified: Status=${updatedTask.status}, Priority=${updatedTask.priority}`);

    // ------------------------------------------------------------------------
    // 4. Comment Operations
    // ------------------------------------------------------------------------
    console.log("\n4. Testing Comment Repository...");
    testComment = await commentRepository.create({
      taskId: testTask.id,
      boardId: testBoard.id,
      author: "Test Author",
      authorId: testUserId,
      text: `${TEST_PREFIX} Comment message`,
    });
    console.log(`   ✓ Comment created: ID=${testComment.id}, Text="${testComment.text}"`);

    const taskComments = await commentRepository.findByTaskId(testTask.id);
    if (!taskComments.some((c) => c.id === testComment.id)) {
      throw new Error("findByTaskId failed for comments");
    }
    console.log(`   ✓ Comment findByTaskId verified: Found ${taskComments.length} comment(s)`);

    // ------------------------------------------------------------------------
    // 5. Activity Operations
    // ------------------------------------------------------------------------
    console.log("\n5. Testing Activity Repository...");
    testActivity = await activityRepository.create({
      boardId: testBoard.id,
      userId: testUserId,
      who: "Test User",
      what: "created test board",
      action: "BOARD_CREATED",
      description: "test activity log",
    });
    console.log(`   ✓ Activity log created: ID=${testActivity.id}, Action=${testActivity.action}`);

    const boardActivities = await activityRepository.findByBoardId(testBoard.id, 10);
    if (!boardActivities.some((a) => a.id === testActivity.id)) {
      throw new Error("findByBoardId failed for activity logs");
    }
    console.log(`   ✓ Activity findByBoardId verified: Found ${boardActivities.length} log(s)`);

    // ------------------------------------------------------------------------
    // 6. Chat Operations
    // ------------------------------------------------------------------------
    console.log("\n6. Testing Chat Repository...");
    testChat = await chatRepository.create({
      boardId: testBoard.id,
      author: "Test Chat User",
      authorId: testUserId,
      text: `${TEST_PREFIX} Hello Firestore Chat!`,
    });
    console.log(`   ✓ Chat message created: ID=${testChat.id}, Text="${testChat.text}"`);

    const boardChats = await chatRepository.findByBoardId(testBoard.id);
    if (!boardChats.some((c) => c.id === testChat.id)) {
      throw new Error("findByBoardId failed for chat messages");
    }
    console.log(`   ✓ Chat findByBoardId verified: Found ${boardChats.length} message(s)`);

    // ------------------------------------------------------------------------
    // 7. User Profile Operations
    // ------------------------------------------------------------------------
    console.log("\n7. Testing User / Profile Repository...");
    const profileUserId = `test_prof_${Date.now()}`;
    // Seed initial profile in userProfiles
    await db.collection("userProfiles").doc(profileUserId).set({
      id: profileUserId,
      name: "Initial Name",
      email: `${profileUserId}@example.com`,
      role: "Member",
      bio: "Initial Bio",
      createdAt: new Date().toISOString(),
    });

    const initialUser = await userRepository.findById(profileUserId);
    if (!initialUser || initialUser.name !== "Initial Name") {
      throw new Error("findById failed on userProfiles");
    }
    console.log(`   ✓ Profile findById verified: Found profile "${initialUser.name}"`);

    const updatedProfile = await userRepository.updateProfile(profileUserId, {
      name: "Updated Name",
      bio: "Updated Bio for Firestore",
    });
    if (updatedProfile.name !== "Updated Name" || updatedProfile.bio !== "Updated Bio for Firestore") {
      throw new Error("updateProfile failed");
    }
    console.log(`   ✓ Profile updateProfile verified: Name="${updatedProfile.name}", Bio="${updatedProfile.bio}"`);

    const userByEmail = await userRepository.findByEmail(`${profileUserId}@example.com`);
    if (!userByEmail || userByEmail.id !== profileUserId) {
      throw new Error("findByEmail failed for user profile");
    }
    console.log(`   ✓ Profile findByEmail verified`);

    // Clean up test user profile
    await db.collection("userProfiles").doc(profileUserId).delete();
    console.log(`   ✓ Cleaned up test user profile document`);

    // ------------------------------------------------------------------------
    // 8. Board Cascade Deletion
    // ------------------------------------------------------------------------
    console.log("\n8. Testing Board Cascade Deletion...");
    const deletedTasks = await taskRepository.deleteByBoardId(testBoard.id);
    const deletedComments = await commentRepository.deleteByBoardId(testBoard.id);
    const deletedChats = await chatRepository.deleteByBoardId(testBoard.id);
    const deletedActivities = await activityRepository.deleteByBoardId(testBoard.id);
    const deletedMembers = await memberRepository.deleteByBoardId(testBoard.id);
    const deletedBoard = await boardRepository.delete(testBoard.id);

    console.log(`   ✓ Cascade deletion completed:`);
    console.log(`     - Tasks deleted: ${deletedTasks}`);
    console.log(`     - Comments deleted: ${deletedComments}`);
    console.log(`     - Chat messages deleted: ${deletedChats}`);
    console.log(`     - Activities deleted: ${deletedActivities}`);
    console.log(`     - Members deleted: ${deletedMembers}`);
    console.log(`     - Board deleted: ${deletedBoard}`);

    // Verify all collections for this board are now empty
    const remainingTasks = await taskRepository.findByBoardId(testBoard.id);
    const remainingMembers = await memberRepository.findByBoardId(testBoard.id);
    const remainingComments = await commentRepository.findByTaskId(testTask.id);
    const remainingActivities = await activityRepository.findByBoardId(testBoard.id);
    const remainingChats = await chatRepository.findByBoardId(testBoard.id);
    const remainingBoard = await boardRepository.findById(testBoard.id);

    if (
      remainingTasks.length !== 0 ||
      remainingMembers.length !== 0 ||
      remainingComments.length !== 0 ||
      remainingActivities.length !== 0 ||
      remainingChats.length !== 0 ||
      remainingBoard !== null
    ) {
      throw new Error("Cascade deletion check failed - orphan documents remain!");
    }

    console.log("   ✓ Verified: 0 orphaned documents remain in Firestore.");

    console.log("\n==================================================");
    console.log("ALL 8 FIRESTORE PERSISTENCE CHECKS PASSED SUCCESSFULLY!");
    console.log("==================================================");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ VERIFICATION FAILED:", error);

    // Emergency cleanup
    if (testBoard && testBoard.id) {
      console.log("\nRunning emergency cleanup for board ID:", testBoard.id);
      try {
        await taskRepository.deleteByBoardId(testBoard.id);
        await commentRepository.deleteByBoardId(testBoard.id);
        await chatRepository.deleteByBoardId(testBoard.id);
        await activityRepository.deleteByBoardId(testBoard.id);
        await memberRepository.deleteByBoardId(testBoard.id);
        await boardRepository.delete(testBoard.id);
        console.log("Emergency cleanup completed.");
      } catch (cleanErr) {
        console.error("Emergency cleanup error:", cleanErr);
      }
    }
    process.exit(1);
  }
}

runVerification();
