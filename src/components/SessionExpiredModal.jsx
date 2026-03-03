// src/components/SessionExpiredModal.jsx
import React from "react";

const SessionExpiredModal = ({ show, onConfirm }) => {
  if (!show) return null;

  // บล็อกการปิดด้วย ESC หรือ click overlay
  const handleOverlayClick = (e) => e.preventDefault();
  const handleKeyDown = (e) => e.preventDefault();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">การล็อคอินหมดอายุ</h2>
        <p className="mb-6">กรุณาล็อคอินใหม่</p>
        <button
          onClick={onConfirm}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:opacity-90"
        >
          ตกลง
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
