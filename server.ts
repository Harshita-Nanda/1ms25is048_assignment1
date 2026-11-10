import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GenerateResearchRequest, ResearchReport } from './src/types/research';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});



// Helper to sanitize and extract JSON from model output
function cleanAndParseJSON(rawText: string): any {
  let cleaned = rawText.trim();

  // Strip markdown code fence if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

// AI Research Generation Endpoint
app.post('/api/research/generate', async (req, res) => {
  try {
    const { topic, domain, level, reportLength, objectives } = req.body as GenerateResearchRequest;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({
        error: 'Research topic is required. Please enter an academic topic to explore.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API key is not configured on the server. Please verify your GEMINI_API_KEY in the Settings > Secrets panel.',
      });
    }
    const aiClient = ai;

    // Build the research prompt with explicit Few-Shot examples as required
    const wordTarget =
      reportLength === 'concise'
        ? 'around 1000 - 1400 words total across sections'
        : reportLength === 'comprehensive'
        ? 'around 2800 - 3800 words with thorough analytical depth'
        : 'around 1800 - 2400 words with balanced breadth and rigor';

    const systemPrompt = `You are ResearchMate AI, an expert academic engineering research assistant and faculty mentor.
Your mission is to generate structured, rigorous, and accessible research reports for undergraduate engineering students embarking on capstone projects, senior design theses, or scholarly literature reviews.

### AUDIENCE & TONE:
- Write in clear, pedagogical academic language appropriate for undergraduate engineering students.
- Balance technical precision with intuitive conceptual explanations. Avoid unnecessary convoluted jargon while maintaining scholarly and engineering rigor.

### STRICT SOURCE RELIABILITY & ACADEMIC HONESTY RULES:
1. NEVER fabricate or hallucinate research findings, fictional authors, non-existent conference proceedings, fake DOIs, or fabricated URLs.
2. If real-time search grounding is unavailable, clearly state in the preliminary notice that the report is an AI-generated preliminary conceptual overview and supply targeted Boolean search queries for locating primary empirical papers.
3. Distinguish established seminal engineering papers from suggested academic search queries.

### REQUIRED 8-POINT CORE RESEARCH REPORT SPECIFICATION:
1. Identify the main research domain: Refine the specific engineering field and sub-discipline (e.g. "Computer Science & Engineering: Cloud Infrastructure & Zero-Trust Security").
2. Generate 3 to 5 relevant research questions: Provide between 3 and 5 focused, well-formulated engineering questions investigating system feasibility, performance trade-offs, security, efficiency, or scalability.
3. Prepare a structured literature review: Synthesize existing knowledge thematically (e.g., architectural paradigms, benchmark standards, and state-of-the-art implementations).
4. Suggest an appropriate research methodology: Propose practical, actionable experimental setups, simulation platforms (e.g., NS-3, CloudSim, PyTorch, MATLAB, or hardware testbeds), data collection procedures, and evaluation metrics (latency, throughput, resource utilization, error bounds).
5. Identify possible research gaps: Highlight concrete, unaddressed challenges that an undergraduate student or research team could realistically investigate.
6. Explain the limitations of the available evidence: Provide an explicit breakdown of current empirical limitations (e.g. lack of open-source benchmarks, reliance on synthetic workloads, conflicting trade-off studies, lack of hardware-in-the-loop validation).
7. Suggest future research directions: Detail 3 to 5 high-impact prospective engineering project directions.
8. Generate a concise conclusion: Summarize core technical insights and engineering takeaways in a concise, authoritative synthesis.

### FEW-SHOT GUIDING EXAMPLES FOR OUTPUT STRUCTURE:
---
Example 1:
Input Topic: Artificial Intelligence in Healthcare
Output Structure:
- Identified Domain: Biomedical Engineering & Applied Machine Learning
- Title: Applications of Artificial Intelligence in Healthcare: Diagnostic Systems, Clinical Validation, and Algorithmic Reliability
- Abstract: A concise summary of AI applications in medical diagnosis, physiological monitoring, and clinical decision support.
- Research Questions (3-5): 1. How do convolutional architectures compare to clinicians in diagnostic accuracy? 2. What preprocessing methods minimize sensor noise in continuous patient monitoring? 3. How can model explainability reduce false-positive triage alerts?
- Literature Review: Discuss relevant published studies, algorithmic foundations, and diagnostic imaging benchmarks.
- Methodology: Simulation and retrospective cohort validation using open datasets (e.g., MIMIC-IV), ROC/AUC evaluation, and cross-validation protocols.
- Research Gaps: Lack of prospective multi-center clinical trials and silent dataset drift over long-term deployment.
- Limitations of Available Evidence: Reliance on curated retrospective data and scarcity of representative edge-case cohorts.
- Future Directions: Lightweight edge-AI on wearable microcontrollers and federated cross-hospital learning.
- Conclusion: Summarize the major engineering takeaways and trade-offs.

Example 2:
Input Topic: Cybersecurity Challenges in Cloud Computing
Output Structure:
- Identified Domain: Computer Science & Engineering: Distributed Systems and Cloud Security
- Title: Security Challenges and Architectural Solutions in Multi-Tenant Cloud Computing Environments
- Abstract: A summary of cloud security risks, isolation mechanisms, and cryptographic data protection methods.
- Research Questions (3-5): 1. What are the throughput penalties of homomorphic encryption in multi-tenant databases? 2. How can zero-trust access control mitigate credential exfiltration? 3. What microarchitectural side-channels persist in modern hypervisors?
- Literature Review: Discuss relevant research on hypervisor vulnerabilities, shared memory isolation, and encryption frameworks.
- Methodology: Benchmarking containerized workloads against hypervisor-isolated instances, measuring CPU overhead and network jitter.
- Research Gaps: Unresolved challenges in cross-tenant hardware side-channel mitigation without substantial throughput degradation.
- Limitations of Available Evidence: Most published benchmarks use synthetic workloads rather than heterogeneous production traffic.
- Future Directions: Hardware-assisted confidential computing and automated zero-trust policy generation.
- Conclusion: Present the key architectural findings and future mitigation trajectories.
---

### TARGET PARAMETERS:
- Research Topic: "${topic.trim()}"
- Selected Domain Category: "${domain || 'Engineering & Technology'}"
- Academic Level: "${level || 'Intermediate'}" (Tailored for undergraduate engineering students)
- Scope Profile: ${wordTarget}
${objectives ? `- Specific Student Objectives: "${objectives.trim()}"` : ''}

### REQUIRED JSON SCHEMA:
Respond with a single, valid JSON object matching this exact structure:
{
  "identifiedDomain": "Specific engineering discipline and sub-branch (e.g. Electrical & Computer Engineering: Distributed Systems)",
  "title": "Clear, professional academic research title",
  "abstract": "Concise summary (150-250 words) synthesizing the engineering problem, methodology, findings, and conclusion.",
  "introduction": "Clear introduction covering problem definition, engineering relevance, and real-world industrial or academic context.",
  "backgroundAndContext": "Foundational engineering concepts, mathematical/architectural basis, and contemporary standards.",
  "researchQuestions": [
    {
      "question": "Clear engineering research question (provide 3 to 5 total)",
      "rationale": "Why this question matters from an engineering/design perspective",
      "hypothesis": "Hypothesis or expected experimental outcome"
    }
  ],
  "literatureReview": {
    "summary": "Cohesive summary of existing engineering literature and current scientific consensus.",
    "themes": [
      {
        "themeTitle": "Specific thematic area (e.g., Algorithmic Optimization, Architectural Trade-offs)",
        "synthesis": "Synthesis of existing methods, common paradigms, and trade-offs.",
        "keyStudies": [
          {
            "citation": "Seminal author/study reference (real or landmark)",
            "focus": "Core focus of the investigation",
            "finding": "Key empirical finding or performance result",
            "methodology": "Methodology used (e.g. simulation, prototype benchmarking)"
          }
        ]
      }
    ],
    "stateOfArt": "Current engineering frontier and industry/academic benchmark standards."
  },
  "methodology": {
    "framework": "Recommended experimental/engineering design framework suitable for undergraduate research.",
    "dataCollection": "Data acquisition strategies, simulator tools (e.g., NS-3, Gazebo, SPICE, PyTorch), or hardware testbeds.",
    "analyticalMethods": "Engineering metrics (e.g., latency, throughput, energy efficiency, error bounds, statistical significance).",
    "ethicalConsiderations": "Safety, data privacy, intellectual property, and engineering code of ethics (e.g., IEEE/ACM ethics code).",
    "validityThreats": "Simulation fidelity threats, hardware noise, and confounding variables."
  },
  "keyFindings": [
    {
      "point": "Key engineering finding or synthesized principle",
      "evidence": "Evidence, benchmark data, or theoretical proof",
      "impact": "Practical design or implementation implication"
    }
  ],
  "researchGaps": [
    {
      "area": "Specific sub-discipline or system component",
      "gapDescription": "Detailed explanation of what remains unknown or poorly investigated",
      "significance": "Why solving this gap is meaningful for students and engineers",
      "suggestedApproach": "Proposed engineering approach or experimental setup to explore this gap"
    }
  ],
  "evidenceLimitations": [
    "Specific limitation in the existing published evidence (e.g. reliance on synthetic datasets rather than production workloads)",
    "Constraint regarding hardware variability or lack of open-source reproducibility testbeds",
    "Geographic, temporal, or scale limitations in current literature"
  ],
  "limitations": [
    "Scope boundary 1 for undergraduate implementation",
    "Equipment or computational resource constraints 2",
    "Assumption or simplification made in proposed model 3"
  ],
  "futureDirections": [
    "Concrete future engineering project direction 1",
    "Scalability or hardware deployment trajectory 2",
    "Cross-disciplinary integration pathway 3"
  ],
  "conclusion": "Concise, impactful conclusion summarizing the core engineering insights, trade-offs, and final takeaway.",
  "references": [
    {
      "id": "ref-1",
      "title": "Title of seminal paper or landmark standard",
      "authors": "Author name(s)",
      "year": "Publication year",
      "publication": "IEEE, ACM, Nature, Science, or relevant journal/conference",
      "url": "https://... or empty if unavailable",
      "doi": "10.xxxx/... or empty if unavailable",
      "status": "verified" | "suggested_query" | "unverified",
      "citationKey": "[1]",
      "annotation": "Brief explanation of how this source informs the research."
    }
  ],
  "suggestedSearchQueries": [
    "Precise Google Scholar search query 1",
    "IEEE Xplore or ACM Digital Library query 2",
    "arXiv search query with keywords 3"
  ]
}

DO NOT include any markdown code fences or conversational text. Return only the JSON object.`;

    console.log(`[ResearchMate AI] Starting generation for: "${topic}" (${domain}, ${level}, ${reportLength})`);
    const startTime = Date.now();

    // Resilient generation helper with search grounding and direct synthesis fallback
    async function executeModelCall() {
      // First attempt with Google Search grounding if quota permits
      try {
        console.log('[ResearchMate AI] Attempting grounded generation with gemini-3.1-flash-lite...');
        const res = await aiClient.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
          config: {
            tools: [{ googleSearch: {} }],
          },
        });
        return { response: res, modelUsed: 'gemini-3.1-flash-lite (grounded)' };
      } catch (groundingErr: any) {
        console.warn('[ResearchMate AI] Search grounding unavailable or rate-limited, falling back to direct synthesis:', groundingErr?.message || groundingErr);
      }

      // High-speed reliable scholarly synthesis
      const candidates = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let lastErr: any;

      for (const modelName of candidates) {
        try {
          console.log(`[ResearchMate AI] Generating with ${modelName}...`);
          const config: any = {};
          if (modelName === 'gemini-3.8-flash') {
            config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
          }

          const res = await aiClient.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
            config,
          });
          return { response: res, modelUsed: modelName };
        } catch (err: any) {
          lastErr = err;
          console.warn(`[ResearchMate AI] ${modelName} error:`, err?.message || err);
        }
      }

      throw lastErr;
    }

    const { response, modelUsed } = await executeModelCall();
    console.log(`[ResearchMate AI] Generation succeeded with ${modelUsed} in ${(Date.now() - startTime) / 1000}s`);

    let groundedChunks: Array<{ title: string; url: string }> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          groundedChunks.push({
            title: chunk.web.title || 'Academic Web Resource',
            url: chunk.web.uri,
          });
        }
      }
    }
    console.log(`[ResearchMate AI] Extracted ${groundedChunks.length} search grounding chunks.`);

    const rawText = response.text;
    if (!rawText) {
      throw new Error('No content was generated by Gemini model.');
    }

    let parsedData: any;
    try {
      parsedData = cleanAndParseJSON(rawText);
    } catch (parseErr) {
      console.error('Failed to parse model JSON:', rawText.slice(0, 500));
      throw new Error('Failed to parse structured academic report. The model returned non-standard format.');
    }

    // Merge grounded chunks into references if any real sources were discovered
    const finalReferences: any[] = Array.isArray(parsedData.references) ? parsedData.references : [];

    // Add unique grounded web sources as verified citations if not already present
    groundedChunks.forEach((chunk, idx) => {
      const alreadyIncluded = finalReferences.some((r) => r.url === chunk.url);
      if (!alreadyIncluded) {
        finalReferences.push({
          id: `grounded-${idx + 1}`,
          title: chunk.title,
          authors: 'Verified Web Source / Publisher',
          year: new Date().getFullYear().toString(),
          publication: new URL(chunk.url).hostname.replace('www.', ''),
          url: chunk.url,
          status: 'verified',
          citationKey: `[G${idx + 1}]`,
          annotation: 'Verified source retrieved via live academic search grounding.',
          isGrounded: true,
        });
      }
    });

    const isPreliminary = groundedChunks.length === 0;

    const report: ResearchReport = {
      id: `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      topic: topic.trim(),
      domain: domain || 'Engineering & Technology',
      identifiedDomain: parsedData.identifiedDomain || `${domain || 'Engineering & Technology'}: Specialized Analysis`,
      level: level || 'Intermediate',
      reportLength: reportLength || 'standard',
      objectives: objectives?.trim() || undefined,
      createdAt: new Date().toISOString(),

      title: parsedData.title || `Research Investigation: ${topic}`,
      abstract: parsedData.abstract || 'Abstract generation in progress.',
      introduction: parsedData.introduction || '',
      backgroundAndContext: parsedData.backgroundAndContext || '',
      researchQuestions: Array.isArray(parsedData.researchQuestions) ? parsedData.researchQuestions.slice(0, 5) : [],
      literatureReview: {
        summary: parsedData.literatureReview?.summary || '',
        themes: Array.isArray(parsedData.literatureReview?.themes) ? parsedData.literatureReview.themes : [],
        stateOfArt: parsedData.literatureReview?.stateOfArt || '',
      },
      methodology: {
        framework: parsedData.methodology?.framework || '',
        dataCollection: parsedData.methodology?.dataCollection || '',
        analyticalMethods: parsedData.methodology?.analyticalMethods || '',
        ethicalConsiderations: parsedData.methodology?.ethicalConsiderations || '',
        validityThreats: parsedData.methodology?.validityThreats || '',
      },
      keyFindings: Array.isArray(parsedData.keyFindings) ? parsedData.keyFindings : [],
      researchGaps: Array.isArray(parsedData.researchGaps) ? parsedData.researchGaps : [],
      limitations: Array.isArray(parsedData.limitations) ? parsedData.limitations : [],
      evidenceLimitations: Array.isArray(parsedData.evidenceLimitations)
        ? parsedData.evidenceLimitations
        : Array.isArray(parsedData.limitations)
        ? parsedData.limitations
        : [
            'Empirical benchmarks predominantly tested on simulated workloads rather than production hardware.',
            'Lack of multi-institutional open-source testbeds for direct replication.',
          ],
      futureDirections: Array.isArray(parsedData.futureDirections) ? parsedData.futureDirections : [],
      conclusion: parsedData.conclusion || '',
      references: finalReferences,
      suggestedSearchQueries: Array.isArray(parsedData.suggestedSearchQueries)
        ? parsedData.suggestedSearchQueries
        : [
            `"${topic}" systematic review IEEE`,
            `"${topic}" empirical benchmarking methodology ACM`,
            `"${topic}" performance evaluation AND limitations arXiv`,
          ],
      groundingSources: groundedChunks,
      isPreliminaryOverview: isPreliminary,
      preliminaryNotice: isPreliminary
        ? 'Preliminary Academic Overview: This report provides an AI-synthesized conceptual framework and foundational synthesis for undergraduate engineering research. When primary peer-reviewed literature is not directly accessible via live search grounding, use the curated Boolean search queries below to locate primary empirical papers in IEEE Xplore, ACM Digital Library, Google Scholar, and arXiv.'
        : undefined,
    };

    return res.json({ report });
  } catch (error: any) {
    console.error('Error generating research report:', error);

    let clientMessage = error.message || 'An error occurred during research generation.';

    // Try extracting message from nested JSON error string
    try {
      if (typeof clientMessage === 'string' && (clientMessage.startsWith('{') || clientMessage.includes('{"error"'))) {
        const parsed = JSON.parse(clientMessage);
        if (parsed.error?.message) {
          clientMessage = parsed.error.message;
        }
      }
    } catch {
      // Keep original message if JSON parse fails
    }

    if (error.status === 403 || clientMessage.includes('PERMISSION_DENIED') || clientMessage.includes('API_KEY_INVALID')) {
      clientMessage =
        'Access denied: Please verify that a valid Gemini API key is configured in the AI Studio Settings > Secrets panel.';
    } else if (error.status === 429 || clientMessage.includes('RESOURCE_EXHAUSTED')) {
      clientMessage =
        'API quota exhausted: Please wait a moment before trying again, or select a paid key in Settings > Secrets.';
    } else if (error.status === 503 || clientMessage.includes('UNAVAILABLE') || clientMessage.includes('high demand')) {
      clientMessage =
        'The Gemini model is temporarily experiencing high demand. Please wait a few seconds and click Generate Research again.';
    }

    return res.status(500).json({
      error: clientMessage,
    });
  }
});

// Setup Vite dev server or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ResearchMate AI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[ResearchMate AI] Failed to start server:', err);
  process.exit(1);
});
