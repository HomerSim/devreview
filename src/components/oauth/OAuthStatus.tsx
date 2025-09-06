'use client';

import { useOAuthStatus } from '@/hooks/useOAuth';
import { RefreshCw, Unlink, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useState } from 'react';

export function OAuthStatusCard() {
  const {
    isConnected,
    isExpired,
    canRefresh,
    provider,
    expiresAt,
    loading,
    error,
    checkStatus,
    refreshToken,
    disconnect,
  } = useOAuthStatus();

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleRefresh = async () => {
    setActionLoading('refresh');
    const success = await refreshToken();
    if (success) {
      alert('토큰이 성공적으로 갱신되었습니다.');
    } else {
      alert('토큰 갱신에 실패했습니다.');
    }
    setActionLoading(null);
  };

  const handleDisconnect = async () => {
    if (!confirm(`${provider} 연동을 해제하시겠습니까?`)) return;
    
    setActionLoading('disconnect');
    const success = await disconnect();
    if (success) {
      alert('OAuth 연동이 해제되었습니다.');
    } else {
      alert('연동 해제에 실패했습니다.');
    }
    setActionLoading(null);
  };

  const handleCheckStatus = async () => {
    setActionLoading('check');
    await checkStatus();
    setActionLoading(null);
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-gray-400" />
          <span className="text-gray-600">OAuth 연동 정보 없음</span>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (isExpired) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (isExpired) {
      return canRefresh ? '토큰 만료됨 (갱신 가능)' : '토큰 만료됨 (갱신 불가)';
    }
    return '연동 활성';
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">OAuth 연동 상태</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      
      <div className="space-y-3">
        {/* 연동 상태 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-medium">{provider?.toUpperCase()} 연동</span>
          </div>
          <span className={`text-sm ${
            isExpired ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {getStatusText()}
          </span>
        </div>

        {/* 만료 시간 */}
        {expiresAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">만료 시간:</span>
            <span className="text-gray-700">{formatExpiryDate(expiresAt)}</span>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex space-x-2 pt-3 border-t border-gray-100">
          <button
            onClick={handleCheckStatus}
            disabled={loading || actionLoading === 'check'}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${actionLoading === 'check' ? 'animate-spin' : ''}`} />
            <span>상태 확인</span>
          </button>

          {canRefresh && (
            <button
              onClick={handleRefresh}
              disabled={loading || actionLoading === 'refresh'}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${actionLoading === 'refresh' ? 'animate-spin' : ''}`} />
              <span>토큰 갱신</span>
            </button>
          )}

          <button
            onClick={handleDisconnect}
            disabled={loading || actionLoading === 'disconnect'}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors disabled:opacity-50"
          >
            <Unlink className="w-4 h-4" />
            <span>연동 해제</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 간단한 OAuth 상태 인디케이터 (헤더 등에서 사용)
export function OAuthStatusIndicator() {
  const { isConnected, isExpired, provider } = useOAuthStatus();

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-1 text-gray-500 text-sm">
        <XCircle className="w-4 h-4" />
        <span>미연동</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-sm">
      {isExpired ? (
        <>
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span className="text-yellow-600">{provider} 토큰 만료</span>
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-600">{provider} 연동됨</span>
        </>
      )}
    </div>
  );
}
