'use client';

import { X, UserMinus } from 'lucide-react';

interface WithdrawConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function WithdrawConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}: WithdrawConfirmModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 transform transition-all duration-200 scale-100 opacity-100">
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <UserMinus className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              회원 탈퇴 확인
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed mb-2">
            정말로 회원 탈퇴하시겠습니까?
          </p>
          <p className="text-sm text-gray-500">
            탈퇴하더라도 기존에 작성한 피드백과 포트폴리오는 삭제되지 않습니다.<br />
            탈퇴 후에는 복구가 불가능합니다.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                탈퇴 중...
              </div>
            ) : (
              '탈퇴하기'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
