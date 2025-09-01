'use client';

import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Send } from 'lucide-react';
import Link from 'next/link';

export default function SeniorVerifyPage() {
  const [formData, setFormData] = useState({
    linkedinUrl: '',
    careerDescription: '',
    companyName: '',
    position: '',
    experience: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연결
    console.log('Submit verification:', { formData, uploadedFile });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="text-green-500 mb-4">
              <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              인증 요청이 완료되었습니다
            </h1>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              제출해주신 정보를 검토한 후 24-48시간 내에 결과를 알려드리겠습니다.
              인증이 완료되면 이메일로 안내해드릴 예정입니다.
            </p>
            <div className="space-y-3">
              <Link
                href="/feed"
                className="block w-full bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors text-center text-sm sm:text-base"
              >
                피드로 이동
              </Link>
              <Link
                href="/"
                className="block w-full text-gray-600 hover:text-gray-900 transition-colors text-center text-sm sm:text-base"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/role-selection" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                <span className="hidden sm:inline">시니어 개발자 인증</span>
                <span className="sm:hidden">시니어 인증</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              시니어 개발자 인증 신청
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              주니어 개발자들에게 양질의 피드백을 제공하기 위해 시니어 개발자 인증을 진행하고 있습니다.
              아래 정보를 입력해주시면 검토 후 인증해드리겠습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn 프로필 URL *
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      현재 회사명 *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="예: 네이버, 카카오, 토스 등"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      직급/직책 *
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="예: 시니어 개발자, 팀리드, CTO 등"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    개발 경력 *
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm sm:text-base"
                    required
                  >
                    <option value="">경력을 선택해주세요</option>
                    <option value="3-5년">3-5년</option>
                    <option value="5-7년">5-7년</option>
                    <option value="7-10년">7-10년</option>
                    <option value="10년 이상">10년 이상</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 경력 설명 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">경력 설명</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주요 경력 및 전문 분야 *
                </label>
                <textarea
                  value={formData.careerDescription}
                  onChange={(e) => setFormData({ ...formData, careerDescription: e.target.value })}
                  rows={6}
                  placeholder="예: 
- 네이버에서 5년간 백엔드 개발 담당
- Spring Boot, MSA 아키텍처 전문
- 주니어 개발자 멘토링 경험 다수
- 코드 리뷰 및 기술 가이드 제공 경험"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm sm:text-base"
                  required
                />
                <p className="mt-2 text-xs sm:text-sm text-gray-500">
                  주요 프로젝트, 사용 기술, 멘토링 경험 등을 구체적으로 작성해주세요.
                </p>
              </div>
            </div>

            {/* 증빙 서류 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">증빙 서류</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  재직증명서 또는 명함 이미지 *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm sm:text-base">
                      클릭하여 파일을 업로드하거나 드래그하여 추가하세요
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      JPG, PNG, PDF 파일만 지원 (최대 10MB)
                    </p>
                  </label>
                </div>
                
                {uploadedFile && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      <span className="text-xs sm:text-sm text-green-700">
                        {uploadedFile.name} 업로드 완료
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 개인정보 처리 동의 */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm text-gray-700">
                  <p className="font-medium mb-2">개인정보 처리 안내</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 제출된 정보는 시니어 개발자 인증 목적으로만 사용됩니다</li>
                    <li>• 인증 완료 후 증빙 서류는 즉시 삭제됩니다</li>
                    <li>• 개인정보는 암호화되어 안전하게 보관됩니다</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                인증 신청하기
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
