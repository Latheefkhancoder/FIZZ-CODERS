import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import AuthCard from '../components/auth/AuthCard';
import AuthButton from '../components/auth/AuthButton';
import PixelCollaborationVisual from '../components/auth/PixelCollaborationVisual';
import './ResetSuccess.css';

export default function ResetSuccess() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      centeredLayout={true}
      visualSlot={<PixelCollaborationVisual variant="reset-success" />}
    >
      <AuthCard
        centered={true}
        icon={
          <div className="pixel-success-badge-container">
            {/* Pixelated Checkmark Circle Badge */}
            <svg
              className="pixel-success-svg"
              width="96"
              height="96"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Pixelated Red Ring */}
              <rect x="18" y="2" width="12" height="4" fill="#1475E4" />
              <rect x="18" y="42" width="12" height="4" fill="#1475E4" />
              <rect x="2" y="18" width="4" height="12" fill="#1475E4" />
              <rect x="42" y="18" width="4" height="12" fill="#1475E4" />

              <rect x="8" y="6" width="10" height="4" fill="#1475E4" />
              <rect x="30" y="6" width="10" height="4" fill="#1475E4" />
              <rect x="8" y="38" width="10" height="4" fill="#1475E4" />
              <rect x="30" y="38" width="10" height="4" fill="#1475E4" />

              <rect x="6" y="10" width="4" height="8" fill="#1475E4" />
              <rect x="38" y="10" width="4" height="8" fill="#1475E4" />
              <rect x="6" y="30" width="4" height="8" fill="#1475E4" />
              <rect x="38" y="30" width="4" height="8" fill="#1475E4" />

              {/* Inner Circle Fill */}
              <rect x="10" y="10" width="28" height="28" fill="#FFFFFF" />

              {/* Pixel Checkmark */}
              <rect x="14" y="24" width="4" height="4" fill="#1475E4" />
              <rect x="18" y="28" width="4" height="4" fill="#1475E4" />
              <rect x="22" y="32" width="4" height="4" fill="#2E7AF9" />
              <rect x="26" y="28" width="4" height="4" fill="#2E7AF9" />
              <rect x="30" y="24" width="4" height="4" fill="#2E7AF9" />
              <rect x="34" y="20" width="4" height="4" fill="#FFFFFF" />
            </svg>
          </div>
        }
        title="Password Updated!"
        subtitle="Your password has been successfully reset. You can now log in with your new password."
      >
        <div className="success-action-wrap">
          <AuthButton
            type="button"
            onClick={() => navigate('/login')}
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            }
          >
            Go to Login
          </AuthButton>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}