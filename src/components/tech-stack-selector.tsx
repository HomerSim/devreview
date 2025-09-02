import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface TechStackSelectorProps {
  selectedTechStack: string[];
  onAddTech: (tech: string) => void;
  onRemoveTech: (tech: string) => void;
  error?: string;
}

export const TechStackSelector: React.FC<TechStackSelectorProps> = ({
  selectedTechStack,
  onAddTech,
  onRemoveTech,
  error
}) => {
  const [searchTech, setSearchTech] = useState('');

  const filteredTechOptions = TECH_OPTIONS.filter(tech =>
    tech.toLowerCase().includes(searchTech.toLowerCase()) &&
    !selectedTechStack.includes(tech)
  );

  const handleAddTech = (tech: string) => {
    onAddTech(tech);
    setSearchTech('');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchTech}
          onChange={(e) => setSearchTech(e.target.value)}
          placeholder="기술 스택을 검색하고 선택하세요"
          className={cn(
            "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base",
            error ? "border-red-500" : "border-gray-300"
          )}
        />
        
        {searchTech && filteredTechOptions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
            {filteredTechOptions.map((tech) => (
              <button
                key={tech}
                onClick={() => handleAddTech(tech)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors text-sm sm:text-base first:rounded-t-lg last:rounded-b-lg"
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
            <TechBadge
              key={tech}
              tech={tech}
              onRemove={() => onRemoveTech(tech)}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

interface TechBadgeProps {
  tech: string;
  onRemove: () => void;
}

const TechBadge: React.FC<TechBadgeProps> = ({ tech, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm font-medium">
    {tech}
    <button
      onClick={onRemove}
      className="hover:text-blue-800 transition-colors"
      aria-label={`Remove ${tech}`}
    >
      <X className="w-3 h-3 sm:w-4 sm:h-4" />
    </button>
  </span>
);
