-- Migration: 002_create_password_reset_tokens.sql
-- Description: Create password_reset_tokens table for secure forgot/reset password flow

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    used_at TIMESTAMPTZ NULL DEFAULT NULL
);

-- Index for fast user reset token lookup and invalidation
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- Index for fast token validation by token_hash
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON password_reset_tokens(token_hash);

-- Composite index for token verification query (token_hash + expires_at + used_at)
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_lookup ON password_reset_tokens(token_hash, expires_at, used_at);
