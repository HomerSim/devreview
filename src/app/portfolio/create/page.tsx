'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Send, X } from 'lucide-react';
import Link from 'next/link';

const TECH_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js',
  'Node.js', 'Express', 'NestJS', 'Spring Boot', 'Django',
  'Flask', 'FastAPI', 'Laravel', 'Ruby on Rails',
  'TypeScript', 'JavaScript', 'Python', 'Java', 'C#',
  'Go', 'Rust', 'PHP', 'Swift', 'Kotlin',
  'React Native', 'Flutter', 'iOS', 'Android',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Git'
];

const MARKDOWN_TEMPLATE = `## 프로젝트 소개
프로젝트의 배경과 목적을 설명해주세요.

## 주요 기능
- 기능 1: 설명
- 기능 2: 설명  
- 기능 3: 설명

## 기술적 도전과 해결 과정
개발 중 마주한 기술적 문제와 해결 방법을 구체적으로 설명해주세요.

## 궁금한 점
시니어 개발자에게 특별히 피드백받고 싶은 부분이 있다면 적어주세요.`;

export default function CreatePortfolioPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    deployUrl: '',
    content: MARKDOWN_TEMPLATE
  });
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [searchTech, setSearchTech] = useState('');

  const filteredTechOptions = TECH_OPTIONS.filter(tech =>
    tech.toLowerCase().includes(searchTech.toLowerCase()) &&
    !selectedTechStack.includes(tech)
  );

  const addTechStack = (tech: string) => {
    if (!selectedTechStack.includes(tech)) {
      setSelectedTechStack([...selectedTechStack, tech]);
    }
    setSearchTech('');
  };

  const removeTechStack = (tech: string) => {
    setSelectedTechStack(selectedTechStack.filter(t => t !== tech));
  };

  const handleSubmit = (isDraft: boolean) => {
    // TODO: API 연결
    console.log('Submit:', { ...formData, techStack: selectedTechStack, isDraft });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/feed" className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                포트폴리오 만들기
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Save className="w-4 h-4" />
                임시저장
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                게시하기
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">기본 정보</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: E-커머스 풀스택 웹사이트"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  한 줄 소개 *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="프로젝트를 한 줄로 설명해주세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL *
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/repository"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    배포 URL (선택)
                  </label>
                  <input
                    type="url"
                    value={formData.deployUrl}
                    onChange={(e) => setFormData({ ...formData, deployUrl: e.target.value })}
                    placeholder="https://your-project.vercel.app"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 기술 스택 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">기술 스택</h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={searchTech}
                  onChange={(e) => setSearchTech(e.target.value)}
                  placeholder="기술 스택을 검색하고 선택하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                
                {searchTech && filteredTechOptions.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg">
                    {filteredTechOptions.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => addTechStack(tech)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedTechStack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTechStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-500 rounded-md"
                    >
                      {tech}
                      <button
                        onClick={() => removeTechStack(tech)}
                        className="hover:text-blue-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">상세 설명</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 상세 설명 (Markdown 형식)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono text-sm"
                placeholder="Markdown 형식으로 프로젝트를 자세히 설명해주세요"
              />
              <p className="mt-2 text-sm text-gray-500">
                Markdown 문법을 사용할 수 있습니다. (예: **굵게**, *기울임*, `코드`, ## 제목 등)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
