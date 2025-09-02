export interface PortfolioFormData {
  title: string;
  description: string;
  githubUrl: string;
  deployUrl: string;
  content: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface PortfolioSubmission extends PortfolioFormData {
  techStack: string[];
  isDraft: boolean;
}
