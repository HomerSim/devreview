'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  type?: 'danger' | 'warning';
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '삭제 확인',
  message = '정말로 삭제하시겠습니까?',
  confirmText = '삭제',
  cancelText = '취소',
  isLoading = false,
  type = 'danger'
}: DeleteConfirmModalProps) {
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              type === 'danger' ? 'bg-red-100' : 'bg-amber-100'
            }`}>
              {type === 'danger' ? (
                <Trash2 className="w-5 h-5 text-red-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
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

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                삭제 중...
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// 피드백 전용 삭제 모달
interface FeedbackDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  feedbackPreview?: string;
}

export function FeedbackDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  feedbackPreview
}: FeedbackDeleteModalProps) {
  const previewText = feedbackPreview && feedbackPreview.length > 50 
    ? `"${feedbackPreview.substring(0, 50)}..."` 
    : feedbackPreview ? `"${feedbackPreview}"` : '';

  return (
    <DeleteConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="피드백 삭제"
      message={
        previewText 
          ? `다음 피드백을 삭제하시겠습니까?\n\n${previewText}`
          : "이 피드백을 삭제하시겠습니까?"
      }
      confirmText="삭제하기"
      cancelText="취소"
      type="danger"
    />
  );
}
