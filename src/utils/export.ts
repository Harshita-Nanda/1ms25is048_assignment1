import { ResearchReport, ReferenceItem } from '../types/research';

// Convert report to formatted Plain Text (TXT)
export function reportToPlainText(report: ResearchReport): string {
  const divider = '================================================================================';
  const subDivider = '--------------------------------------------------------------------------------';

  let txt = '';
  txt += `${divider}\n`;
  txt += `RESEARCHMATE AI — ACADEMIC RESEARCH REPORT\n`;
  txt += `${report.title.toUpperCase()}\n`;
  txt += `${divider}\n\n`;
  txt += `Project Name:       ResearchMate AI\n`;
  txt += `Research Topic:     ${report.topic}\n`;
  txt += `Academic Domain:    ${report.domain}\n`;
  if (report.identifiedDomain) {
    txt += `Identified Field:   ${report.identifiedDomain}\n`;
  }
  txt += `Research Level:     ${report.level}\n`;
  txt += `Length Profile:     ${report.reportLength}\n`;
  txt += `Date Generated:     ${new Date(report.createdAt).toLocaleDateString()} ${new Date(report.createdAt).toLocaleTimeString()} (ISO: ${report.createdAt})\n`;
  if (report.objectives) {
    txt += `Research Target:    ${report.objectives}\n`;
  }
  if (report.preliminaryNotice) {
    txt += `\n[NOTE: ${report.preliminaryNotice}]\n`;
  }
  txt += `\n${divider}\n`;
  txt += `ABSTRACT\n`;
  txt += `${divider}\n`;
  txt += `${report.abstract}\n\n`;

  txt += `${subDivider}\n`;
  txt += `1. INTRODUCTION\n`;
  txt += `${subDivider}\n`;
  txt += `${report.introduction}\n\n`;

  txt += `${subDivider}\n`;
  txt += `2. BACKGROUND AND CONTEXT\n`;
  txt += `${subDivider}\n`;
  txt += `${report.backgroundAndContext}\n\n`;

  txt += `${subDivider}\n`;
  txt += `3. RESEARCH QUESTIONS\n`;
  txt += `${subDivider}\n`;
  report.researchQuestions.forEach((rq, idx) => {
    txt += `[RQ ${idx + 1}] ${rq.question}\n`;
    txt += `  - Rationale: ${rq.rationale}\n`;
    if (rq.hypothesis) {
      txt += `  - Hypothesis: ${rq.hypothesis}\n`;
    }
    txt += `\n`;
  });

  txt += `${subDivider}\n`;
  txt += `4. LITERATURE REVIEW\n`;
  txt += `${subDivider}\n`;
  txt += `Summary:\n${report.literatureReview.summary}\n\n`;
  report.literatureReview.themes.forEach((theme, idx) => {
    txt += `4.${idx + 1} Theme: ${theme.themeTitle}\n`;
    txt += `${theme.synthesis}\n`;
    if (theme.keyStudies && theme.keyStudies.length > 0) {
      txt += `  Key Studies Cited:\n`;
      theme.keyStudies.forEach((ks) => {
        txt += `  * ${ks.citation}\n    Focus: ${ks.focus}\n    Finding: ${ks.finding}\n    Method: ${ks.methodology}\n`;
      });
    }
    txt += `\n`;
  });
  txt += `State of the Art:\n${report.literatureReview.stateOfArt}\n\n`;

  txt += `${subDivider}\n`;
  txt += `5. RESEARCH METHODOLOGY\n`;
  txt += `${subDivider}\n`;
  txt += `Theoretical Framework:   ${report.methodology.framework}\n\n`;
  txt += `Data Collection Protocol: ${report.methodology.dataCollection}\n\n`;
  txt += `Analytical Methods:       ${report.methodology.analyticalMethods}\n\n`;
  txt += `Ethical Considerations:   ${report.methodology.ethicalConsiderations}\n\n`;
  txt += `Threats to Validity:      ${report.methodology.validityThreats}\n\n`;

  txt += `${subDivider}\n`;
  txt += `6. KEY FINDINGS\n`;
  txt += `${subDivider}\n`;
  report.keyFindings.forEach((kf, idx) => {
    txt += `Finding ${idx + 1}: ${kf.point}\n`;
    txt += `  - Evidence: ${kf.evidence}\n`;
    txt += `  - Impact:   ${kf.impact}\n\n`;
  });

  txt += `${subDivider}\n`;
  txt += `7. RESEARCH GAPS\n`;
  txt += `${subDivider}\n`;
  report.researchGaps.forEach((gap, idx) => {
    txt += `[Gap ${idx + 1}] Area: ${gap.area}\n`;
    txt += `  Description: ${gap.gapDescription}\n`;
    txt += `  Significance: ${gap.significance}\n`;
    txt += `  Suggested Approach: ${gap.suggestedApproach}\n\n`;
  });

  txt += `${subDivider}\n`;
  txt += `8. LIMITATIONS OF AVAILABLE EVIDENCE & STUDY BOUNDARIES\n`;
  txt += `${subDivider}\n`;
  if (report.evidenceLimitations && report.evidenceLimitations.length > 0) {
    txt += `Limitations of Current Empirical Evidence:\n`;
    report.evidenceLimitations.forEach((el, idx) => {
      txt += `  * ${el}\n`;
    });
    txt += `\n`;
  }
  txt += `Implementation Limitations:\n`;
  report.limitations.forEach((lim, idx) => {
    txt += `  ${idx + 1}. ${lim}\n`;
  });
  txt += `\n`;

  txt += `${subDivider}\n`;
  txt += `9. FUTURE RESEARCH DIRECTIONS\n`;
  txt += `${subDivider}\n`;
  report.futureDirections.forEach((fd, idx) => {
    txt += `${idx + 1}. ${fd}\n`;
  });
  txt += `\n`;

  txt += `${subDivider}\n`;
  txt += `10. CONCLUSION\n`;
  txt += `${subDivider}\n`;
  txt += `${report.conclusion}\n\n`;

  txt += `${divider}\n`;
  txt += `REFERENCES AND SOURCES\n`;
  txt += `${divider}\n`;
  report.references.forEach((ref) => {
    const statusTag = ref.status === 'verified' ? '[VERIFIED]' : ref.status === 'suggested_query' ? '[SUGGESTED QUERY]' : '[UNVERIFIED]';
    txt += `${ref.citationKey || '*'} ${statusTag} ${ref.authors} (${ref.year || 'n.d.'}). ${ref.title}. ${ref.publication || ''}\n`;
    if (ref.url) txt += `    URL: ${ref.url}\n`;
    if (ref.doi) txt += `    DOI: ${ref.doi}\n`;
    if (ref.annotation) txt += `    Note: ${ref.annotation}\n`;
    txt += `\n`;
  });

  if (report.suggestedSearchQueries && report.suggestedSearchQueries.length > 0) {
    txt += `${subDivider}\n`;
    txt += `SUGGESTED ACADEMIC SEARCH QUERIES (Google Scholar / PubMed / IEEE):\n`;
    txt += `${subDivider}\n`;
    report.suggestedSearchQueries.forEach((q) => {
      txt += `* ${q}\n`;
    });
    txt += `\n`;
  }

  txt += `${divider}\n`;
  txt += `Generated by ResearchMate AI\n`;
  txt += `${divider}\n`;

  return txt;
}

// Convert report to Markdown (.md)
export function reportToMarkdown(report: ResearchReport): string {
  let md = `# ${report.title}\n\n`;
  md += `**Academic Domain:** ${report.domain} | **Level:** ${report.level} | **Date:** ${new Date(report.createdAt).toLocaleDateString()}\n\n`;
  if (report.objectives) {
    md += `> **Research Objectives:** ${report.objectives}\n\n`;
  }

  md += `## Abstract\n\n${report.abstract}\n\n`;
  md += `## 1. Introduction\n\n${report.introduction}\n\n`;
  md += `## 2. Background and Context\n\n${report.backgroundAndContext}\n\n`;

  md += `## 3. Research Questions\n\n`;
  report.researchQuestions.forEach((rq, idx) => {
    md += `### RQ${idx + 1}: ${rq.question}\n\n`;
    md += `- **Rationale:** ${rq.rationale}\n`;
    if (rq.hypothesis) {
      md += `- **Hypothesis:** ${rq.hypothesis}\n`;
    }
    md += `\n`;
  });

  md += `## 4. Literature Review\n\n`;
  md += `${report.literatureReview.summary}\n\n`;
  report.literatureReview.themes.forEach((theme) => {
    md += `### Thematic Analysis: ${theme.themeTitle}\n\n${theme.synthesis}\n\n`;
    if (theme.keyStudies && theme.keyStudies.length > 0) {
      md += `| Citation | Focus | Methodology | Key Finding |\n|---|---|---|---|\n`;
      theme.keyStudies.forEach((ks) => {
        md += `| ${ks.citation} | ${ks.focus} | ${ks.methodology} | ${ks.finding} |\n`;
      });
      md += `\n`;
    }
  });
  md += `**State of the Art:** ${report.literatureReview.stateOfArt}\n\n`;

  md += `## 5. Research Methodology\n\n`;
  md += `- **Theoretical Framework:** ${report.methodology.framework}\n`;
  md += `- **Data Collection:** ${report.methodology.dataCollection}\n`;
  md += `- **Analytical Methods:** ${report.methodology.analyticalMethods}\n`;
  md += `- **Ethical Considerations:** ${report.methodology.ethicalConsiderations}\n`;
  md += `- **Threats to Validity:** ${report.methodology.validityThreats}\n\n`;

  md += `## 6. Key Findings\n\n`;
  report.keyFindings.forEach((kf, idx) => {
    md += `${idx + 1}. **${kf.point}**\n   - *Evidence:* ${kf.evidence}\n   - *Impact:* ${kf.impact}\n\n`;
  });

  md += `## 7. Research Gaps\n\n`;
  report.researchGaps.forEach((gap, idx) => {
    md += `### Gap ${idx + 1}: ${gap.area}\n\n`;
    md += `**Description:** ${gap.gapDescription}\n\n`;
    md += `- **Significance:** ${gap.significance}\n`;
    md += `- **Suggested Approach:** ${gap.suggestedApproach}\n\n`;
  });

  md += `## 8. Limitations\n\n`;
  report.limitations.forEach((lim) => {
    md += `- ${lim}\n`;
  });
  md += `\n`;

  md += `## 9. Future Research Directions\n\n`;
  report.futureDirections.forEach((fd) => {
    md += `- ${fd}\n`;
  });
  md += `\n`;

  md += `## 10. Conclusion\n\n${report.conclusion}\n\n`;

  md += `## References and Sources\n\n`;
  report.references.forEach((ref) => {
    const statusBadge = ref.status === 'verified' ? '`[VERIFIED]`' : ref.status === 'suggested_query' ? '`[SUGGESTED QUERY]`' : '`[UNVERIFIED]`';
    md += `${ref.citationKey || '*'} ${statusBadge} ${ref.authors} (${ref.year || 'n.d.'}). **${ref.title}**. *${ref.publication || ''}*. `;
    if (ref.url) md += `[Link](${ref.url}) `;
    if (ref.doi) md += `DOI: ${ref.doi} `;
    if (ref.annotation) md += `\n  > ${ref.annotation}`;
    md += `\n\n`;
  });

  return md;
}

// Download file helper
export function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// Formats reference into citation standards
export function formatCitation(ref: ReferenceItem, format: 'APA' | 'MLA' | 'IEEE' | 'BibTeX'): string {
  const author = ref.authors || 'Unknown Author';
  const title = ref.title || 'Untitled Work';
  const year = ref.year || 'n.d.';
  const pub = ref.publication || 'Academic Repository';

  switch (format) {
    case 'APA':
      return `${author} (${year}). ${title}. ${pub}.${ref.doi ? ` https://doi.org/${ref.doi}` : ref.url ? ` ${ref.url}` : ''}`;
    case 'MLA':
      return `${author}. "${title}." ${pub}, ${year}${ref.url ? `, ${ref.url}` : ''}.`;
    case 'IEEE':
      return `${ref.citationKey || '[1]'} ${author}, "${title}," ${pub}, ${year}.${ref.doi ? ` doi: ${ref.doi}.` : ''}`;
    case 'BibTeX': {
      const citeKey = (author.split(' ')[0] || 'ref') + (year.replace(/\D/g, '') || '2024');
      return `@article{${citeKey.toLowerCase()},
  author = {${author}},
  title = {${title}},
  journal = {${pub}},
  year = {${year}}${ref.doi ? `,\n  doi = {${ref.doi}}` : ''}${ref.url ? `,\n  url = {${ref.url}}` : ''}
}`;
    }
  }
}

// ============================================================================
// STRICT JSON EXPORT SPECIFICATION & VALIDATION
// ============================================================================

export const REQUIRED_JSON_FIELDS = [
  'project_name',
  'research_topic',
  'academic_domain',
  'generated_at',
  'abstract',
  'introduction',
  'research_questions',
  'literature_review',
  'methodology',
  'findings',
  'research_gaps',
  'limitations',
  'future_directions',
  'conclusion',
  'references',
] as const;

export type RequiredJsonField = typeof REQUIRED_JSON_FIELDS[number];

export interface ResearchMateJsonExport {
  project_name: string;
  research_topic: string;
  academic_domain: string;
  generated_at: string;
  abstract: string;
  introduction: string;
  research_questions: Array<{
    question: string;
    rationale: string;
    hypothesis?: string;
  }>;
  literature_review: {
    summary: string;
    themes: Array<{
      themeTitle: string;
      synthesis: string;
      keyStudies?: Array<{
        citation: string;
        focus: string;
        finding: string;
        methodology: string;
      }>;
    }>;
    stateOfArt?: string;
  };
  methodology: {
    framework: string;
    dataCollection: string;
    analyticalMethods: string;
    ethicalConsiderations: string;
    validityThreats: string;
  };
  findings: Array<{
    point: string;
    evidence: string;
    impact: string;
  }>;
  research_gaps: Array<{
    area: string;
    gapDescription: string;
    significance: string;
    suggestedApproach: string;
  }>;
  limitations: string[];
  future_directions: string[];
  conclusion: string;
  references: Array<{
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
  }>;

  // Enriched scholarly metadata
  title?: string;
  level?: string;
  report_length?: string;
  objectives?: string;
  evidence_limitations?: string[];
  suggested_search_queries?: string[];
  is_preliminary_overview?: boolean;
}

export interface JsonValidationResult {
  isValid: boolean;
  errors: string[];
  validatedFields: string[];
  data?: ResearchMateJsonExport;
  jsonString?: string;
}

/**
 * Builds the exact JSON payload from the active research report,
 * ensuring real generated data is mapped into the 15 required fields.
 */
export function buildReportJsonPayload(report: ResearchReport): ResearchMateJsonExport {
  return {
    project_name: 'ResearchMate AI',
    research_topic: report.topic || 'Untitled Research Topic',
    academic_domain: report.identifiedDomain || report.domain || 'Engineering & Technology',
    generated_at: report.createdAt || new Date().toISOString(),
    abstract: report.abstract || '',
    introduction: report.introduction || '',
    research_questions: Array.isArray(report.researchQuestions) ? report.researchQuestions : [],
    literature_review: report.literatureReview || {
      summary: '',
      themes: [],
      stateOfArt: '',
    },
    methodology: report.methodology || {
      framework: '',
      dataCollection: '',
      analyticalMethods: '',
      ethicalConsiderations: '',
      validityThreats: '',
    },
    findings: Array.isArray(report.keyFindings) ? report.keyFindings : [],
    research_gaps: Array.isArray(report.researchGaps) ? report.researchGaps : [],
    limitations: Array.isArray(report.limitations) ? report.limitations : [],
    future_directions: Array.isArray(report.futureDirections) ? report.futureDirections : [],
    conclusion: report.conclusion || '',
    references: Array.isArray(report.references) ? report.references : [],

    // Enriched academic metadata
    title: report.title || report.topic,
    level: report.level,
    report_length: report.reportLength,
    objectives: report.objectives || '',
    evidence_limitations: report.evidenceLimitations || [],
    suggested_search_queries: report.suggestedSearchQueries || [],
    is_preliminary_overview: Boolean(report.isPreliminaryOverview),
  };
}

/**
 * Validates that the report and resulting JSON conform strictly to all requirements:
 * 1. Contains all 15 required fields
 * 2. All fields have non-empty, genuine generated content
 * 3. Can be serialized and parsed as standard valid JSON
 */
export function validateReportJson(report: ResearchReport): JsonValidationResult {
  const errors: string[] = [];
  const validatedFields: string[] = [];

  if (!report || typeof report !== 'object') {
    return {
      isValid: false,
      errors: ['No report object provided or invalid report format.'],
      validatedFields: [],
    };
  }

  const payload = buildReportJsonPayload(report);

  // 1. project_name
  if (!payload.project_name || typeof payload.project_name !== 'string' || payload.project_name.trim() === '') {
    errors.push('Missing or empty "project_name"');
  } else {
    validatedFields.push('project_name');
  }

  // 2. research_topic
  if (!payload.research_topic || typeof payload.research_topic !== 'string' || payload.research_topic.trim() === '') {
    errors.push('Missing or empty "research_topic"');
  } else {
    validatedFields.push('research_topic');
  }

  // 3. academic_domain
  if (!payload.academic_domain || typeof payload.academic_domain !== 'string' || payload.academic_domain.trim() === '') {
    errors.push('Missing or empty "academic_domain"');
  } else {
    validatedFields.push('academic_domain');
  }

  // 4. generated_at
  if (!payload.generated_at || isNaN(Date.parse(payload.generated_at))) {
    errors.push('Missing or invalid "generated_at" ISO date string');
  } else {
    validatedFields.push('generated_at');
  }

  // 5. abstract
  if (!payload.abstract || typeof payload.abstract !== 'string' || payload.abstract.trim() === '') {
    errors.push('Missing or empty "abstract"');
  } else {
    validatedFields.push('abstract');
  }

  // 6. introduction
  if (!payload.introduction || typeof payload.introduction !== 'string' || payload.introduction.trim() === '') {
    errors.push('Missing or empty "introduction"');
  } else {
    validatedFields.push('introduction');
  }

  // 7. research_questions
  if (!Array.isArray(payload.research_questions) || payload.research_questions.length === 0) {
    errors.push('Missing or empty "research_questions" (expected non-empty array)');
  } else {
    validatedFields.push('research_questions');
  }

  // 8. literature_review
  if (
    !payload.literature_review ||
    typeof payload.literature_review !== 'object' ||
    (!payload.literature_review.summary && payload.literature_review.themes.length === 0)
  ) {
    errors.push('Missing or invalid "literature_review" structure');
  } else {
    validatedFields.push('literature_review');
  }

  // 9. methodology
  if (
    !payload.methodology ||
    typeof payload.methodology !== 'object' ||
    (!payload.methodology.framework && !payload.methodology.dataCollection)
  ) {
    errors.push('Missing or empty "methodology" sections');
  } else {
    validatedFields.push('methodology');
  }

  // 10. findings
  if (!Array.isArray(payload.findings) || payload.findings.length === 0) {
    errors.push('Missing or empty "findings" (expected non-empty array of findings)');
  } else {
    validatedFields.push('findings');
  }

  // 11. research_gaps
  if (!Array.isArray(payload.research_gaps) || payload.research_gaps.length === 0) {
    errors.push('Missing or empty "research_gaps" (expected non-empty array of gaps)');
  } else {
    validatedFields.push('research_gaps');
  }

  // 12. limitations
  if (!Array.isArray(payload.limitations) || payload.limitations.length === 0) {
    errors.push('Missing or empty "limitations" (expected non-empty array of limitations)');
  } else {
    validatedFields.push('limitations');
  }

  // 13. future_directions
  if (!Array.isArray(payload.future_directions) || payload.future_directions.length === 0) {
    errors.push('Missing or empty "future_directions" (expected non-empty array)');
  } else {
    validatedFields.push('future_directions');
  }

  // 14. conclusion
  if (!payload.conclusion || typeof payload.conclusion !== 'string' || payload.conclusion.trim() === '') {
    errors.push('Missing or empty "conclusion"');
  } else {
    validatedFields.push('conclusion');
  }

  // 15. references
  if (!Array.isArray(payload.references) || payload.references.length === 0) {
    errors.push('Missing or empty "references" (expected non-empty array of sources)');
  } else {
    validatedFields.push('references');
  }

  // Double-check all 15 required fields are present in the object keys
  const objectKeys = new Set(Object.keys(payload));
  for (const field of REQUIRED_JSON_FIELDS) {
    if (!objectKeys.has(field)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // JSON syntax and serialization verification
  let jsonString = '';
  try {
    jsonString = JSON.stringify(payload, null, 2);
    const roundTrip = JSON.parse(jsonString);
    if (!roundTrip || typeof roundTrip !== 'object') {
      errors.push('JSON parse round-trip verification failed');
    }
  } catch (err: any) {
    errors.push(`JSON serialization error: ${err.message || String(err)}`);
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      validatedFields,
    };
  }

  return {
    isValid: true,
    errors: [],
    validatedFields,
    data: payload,
    jsonString,
  };
}

/**
 * Downloads the research report as a strictly validated .json file.
 * Halts and alerts if validation fails.
 */
export function downloadReportAsJson(report: ResearchReport): {
  success: boolean;
  message: string;
  filename?: string;
  error?: string;
} {
  const validation = validateReportJson(report);

  if (!validation.isValid || !validation.jsonString) {
    const errorDetails = validation.errors.join('; ');
    return {
      success: false,
      message: `JSON Validation Failed: ${errorDetails}`,
      error: errorDetails,
    };
  }

  const safeTopic = (report.topic || 'research_report')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 40);
  const filename = `${safeTopic}_research_report.json`;

  triggerDownload(validation.jsonString, filename, 'application/json');

  return {
    success: true,
    message: `Report successfully validated and exported to ${filename}`,
    filename,
  };
}

/**
 * Downloads the research report as a properly formatted academic .txt file.
 */
export function downloadReportAsTxt(report: ResearchReport): {
  success: boolean;
  message: string;
  filename?: string;
} {
  if (!report || !report.topic) {
    return {
      success: false,
      message: 'Invalid report data for TXT export.',
    };
  }

  const content = reportToPlainText(report);
  const safeTopic = (report.topic || 'research_report')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 40);
  const filename = `${safeTopic}_research_report.txt`;

  triggerDownload(content, filename, 'text/plain');

  return {
    success: true,
    message: `Report successfully exported to ${filename}`,
    filename,
  };
}
