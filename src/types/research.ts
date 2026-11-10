export type AcademicDomain =
  | 'Computer Science & AI'
  | 'Medicine & Healthcare'
  | 'Environmental Science'
  | 'Engineering & Technology'
  | 'Social Sciences & Psychology'
  | 'Economics & Business'
  | 'Physics & Mathematics'
  | 'Biotechnology & Genetics'
  | 'Humanities & Law'
  | 'Interdisciplinary';

export type ReportLength = 'concise' | 'standard' | 'comprehensive';
export type ResearchLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ResearchQuestion {
  question: string;
  rationale: string;
  hypothesis?: string;
}

export interface LiteratureTheme {
  themeTitle: string;
  synthesis: string;
  keyStudies?: Array<{
    citation: string;
    focus: string;
    finding: string;
    methodology: string;
  }>;
}

export interface ResearchGap {
  area: string;
  gapDescription: string;
  significance: string;
  suggestedApproach: string;
}

export interface ReferenceItem {
  id: string;
  title: string;
  authors: string;
  year?: string;
  publication?: string;
  url?: string;
  doi?: string;
  status: 'verified' | 'suggested_query' | 'unverified';
  citationKey?: string;
  annotation?: string;
  isGrounded?: boolean;
}

export interface ResearchReport {
  id: string;
  topic: string;
  domain: AcademicDomain;
  identifiedDomain?: string; // Automatically identified specific engineering/research field
  level: ResearchLevel;
  reportLength: ReportLength;
  objectives?: string;
  createdAt: string;

  // 13 Core Academic Sections
  title: string;
  abstract: string;
  introduction: string;
  backgroundAndContext: string;
  researchQuestions: ResearchQuestion[]; // 3 to 5 questions
  literatureReview: {
    summary: string;
    themes: LiteratureTheme[];
    stateOfArt: string;
  };
  methodology: {
    framework: string;
    dataCollection: string;
    analyticalMethods: string;
    ethicalConsiderations: string;
    validityThreats: string;
  };
  keyFindings: Array<{
    point: string;
    evidence: string;
    impact: string;
  }>;
  researchGaps: ResearchGap[];
  limitations: string[];
  evidenceLimitations?: string[]; // Specific limitations of available evidence
  futureDirections: string[];
  conclusion: string;
  references: ReferenceItem[];

  // Source Reliability & Grounding metadata
  suggestedSearchQueries: string[];
  groundingSources?: Array<{
    title: string;
    url: string;
  }>;
  isPreliminaryOverview?: boolean;
  preliminaryNotice?: string;
}

export interface GenerateResearchRequest {
  topic: string;
  domain?: AcademicDomain;
  level?: ResearchLevel;
  reportLength?: ReportLength;
  objectives?: string;
}
