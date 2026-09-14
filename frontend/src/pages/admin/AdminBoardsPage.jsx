import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { taskService } from '../../services/task.service';
import BoardCard from '../../components/admin/BoardCard';
import BoardView from '../../components/admin/BoardView';
import CreateBoardModal from '../../components/admin/CreateBoardModal';
import ConfirmationDialog from '../../components/admin/ConfirmationDialog';
import './AdminBoardsPage.css';

/**
 * AdminBoardsPage — Lists all real boards; opens a board into a full BoardView.
 */
export default function AdminBoardsPage() {
  const { boards, createBoard, deleteBoard, getBoardById, selectBoard, fetchBoards, loading } = useAdmin();

  const [activeBoardId, setActiveBoardId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [taskCounts, setTaskCounts] = useState({});
  const [createError, setCreateError] = useState('');

  // Fetch boards on component mount
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Load task counts for each board
  useEffect(() => {
    if (boards.length === 0) {
      setTaskCounts({});
      return;
    }

    let isMounted = true;
    boards.forEach(async (board) => {
      try {
        const bTasks = await taskService.getBoardTasks(board.id);
        if (isMounted) {
          setTaskCounts(prev => ({ ...prev, [board.id]: bTasks.length }));
        }
      } catch {
        // Ignore task count error
      }
    });

    return () => { isMounted = false; };
  }, [boards]);

  const activeBoard = activeBoardId ? getBoardById(activeBoardId) : null;

  const handleOpenBoard = (boardId) => {
    selectBoard(boardId);
    setActiveBoardId(boardId);
  };

  const handleCreateBoard = async (name, code) => {
    try {
      setCreateError('');
      const board = await createBoard(name, code);
      if (board) {
        setActiveBoardId(board.id);
        setCreateModalOpen(false);
      }
    } catch (err) {
      setCreateError(err.message || 'Failed to create board.');
    }
  };

  const handleDeleteBoard = (boardId) => {
    setBoardToDelete(boardId);
  };

  const confirmDeleteBoard = async () => {
    if (boardToDelete) {
      try {
        await deleteBoard(boardToDelete);
        if (boardToDelete === activeBoardId) setActiveBoardId(null);
      } catch (err) {
        alert(err.message || 'Failed to delete board.');
      }
    }
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
          onClick={() => { setCreateError(''); setCreateModalOpen(true); }}
          type="button"
        >
          + New Board
        </button>
      </div>

      {createError && (
        <div style={{ margin: '0 0 16px 0', padding: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171' }}>
          {createError}
        </div>
      )}

      {/* Board Cards */}
      {loading && boards.length === 0 ? (
        <div className="boards-empty">
          <p style={{ color: 'var(--text-muted)' }}>Loading boards...</p>
        </div>
      ) : boards.length === 0 ? (
        <div className="boards-empty">
          <div className="boards-empty-icon">📋</div>
          <h3>No boards yet</h3>
          <p>Create your first board to start organizing tasks.</p>
          <button className="btn-primary-aqua" onClick={() => { setCreateError(''); setCreateModalOpen(true); }} type="button">
            + New Board
          </button>
        </div>
      ) : (
        <div className="boards-grid">
          {boards.map(board => {
            const count = taskCounts[board.id] ?? 0;
            return (
              <BoardCard
                key={board.id}
                board={board}
                taskCount={count}
                onClick={handleOpenBoard}
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
