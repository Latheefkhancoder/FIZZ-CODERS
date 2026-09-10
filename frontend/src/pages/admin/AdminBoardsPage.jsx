import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import BoardCard from '../../components/admin/BoardCard';
import BoardView from '../../components/admin/BoardView';
import CreateBoardModal from '../../components/admin/CreateBoardModal';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';
import './AdminBoardsPage.css';

/**
 * AdminBoardsPage — Lists all boards; opens a board into a full BoardView.
 */
export default function AdminBoardsPage() {
  const { boards, tasks, createBoard, deleteBoard, getBoardById } = useAdmin();

  const [activeBoardId,  setActiveBoardId]  = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [boardToDelete,  setBoardToDelete]  = useState(null);

  const activeBoard = activeBoardId ? getBoardById(activeBoardId) : null;

  const handleCreateBoard = (name) => {
    const board = createBoard(name);
    setActiveBoardId(board.id);
  };

  const handleDeleteBoard = (boardId) => {
    setBoardToDelete(boardId);
  };

  const confirmDeleteBoard = () => {
    if (boardToDelete) deleteBoard(boardToDelete);
    if (boardToDelete === activeBoardId) setActiveBoardId(null);
    setBoardToDelete(null);
  };

  const boardToDeleteObj = boardToDelete ? boards.find(b => b.id === boardToDelete) : null;

  /* ── If a board is open, show its Kanban view ── */
  if (activeBoard) {
    return (
      <>
        <BoardView
          board={activeBoard}
          onBack={() => setActiveBoardId(null)}
        />
        <ConfirmationDialog
          isOpen={!!boardToDelete}
          title="Delete Board?"
          message={`Are you sure you want to delete "${boardToDeleteObj?.name}"? All tasks inside will also be deleted.`}
          confirmLabel="Delete Board"
          onConfirm={confirmDeleteBoard}
          onCancel={() => setBoardToDelete(null)}
        />
      </>
    );
  }

  /* ── Board list view ── */
  return (
    <div className="boards-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Boards</h1>
          <p className="page-subtitle">Create and manage your project boards.</p>
        </div>
        <button
          id="new-board-btn"
          className="btn-primary-aqua"
          onClick={() => setCreateModalOpen(true)}
          type="button"
        >
          + New Board
        </button>
      </div>

      {/* Board Cards */}
      {boards.length === 0 ? (
        <div className="boards-empty">
          <div className="boards-empty-icon">📋</div>
          <h3>No boards yet</h3>
          <p>Create your first board to start organizing tasks.</p>
          <button className="btn-primary-aqua" onClick={() => setCreateModalOpen(true)} type="button">
            + New Board
          </button>
        </div>
      ) : (
        <div className="boards-grid">
          {boards.map(board => {
            const count = tasks.filter(t => t.boardId === board.id).length;
            return (
              <BoardCard
                key={board.id}
                board={board}
                taskCount={count}
                onClick={setActiveBoardId}
                onDelete={handleDeleteBoard}
              />
            );
          })}
        </div>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateBoard}
      />

      {/* Delete Board Confirmation */}
      <ConfirmationDialog
        isOpen={!!boardToDelete}
        title="Delete Board?"
        message={`Are you sure you want to delete "${boardToDeleteObj?.name}"? All tasks inside will also be deleted.`}
        confirmLabel="Delete Board"
        onConfirm={confirmDeleteBoard}
        onCancel={() => setBoardToDelete(null)}
      />
    </div>
  );
}
