# 🔬 ResearchMate AI
### AI-Powered Research Paper Assistant

ResearchMate AI is an AI-powered research assistant built to help students get started with academic research. Using Google's Gemini AI, it takes a research topic and generates structured content such as abstracts, literature reviews, research questions, methodology suggestions and research gaps.

The goal is to make the initial research process simpler and help students organize their ideas in one place.

## ✨ Features

- **Topic Analysis:** Understands the given research topic.
- **Abstract Generation:** Creates a concise research abstract.
- **Literature Review:** Provides an overview of existing research.
- **Research Questions:** Suggests questions for further exploration.
- **Methodology Suggestions:** Recommends suitable research approaches.
- **Research Gap Analysis:** Highlights areas that need further study.
- **Future Directions:** Suggests possible areas for future research.
- **Report Generation:** Organizes content into academic sections.
- **Export Options:** Download reports in TXT and JSON formats.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Node.js | Backend |
| Vite | Development and build tool |
| Gemini AI | AI content generation |
| Google AI Studio | AI configuration |
| JSON | Structured data |
| GitHub | Version control |

## 🧠 Prompting Technique

**Few-Shot Prompting** is used to guide Gemini AI in generating structured research reports.

The prompt includes two examples:
- Artificial Intelligence in Healthcare
- Cybersecurity Challenges in Cloud Computing

These examples help the model understand the expected format and maintain consistency in its responses.

## ⚙️ Application Workflow

1. User enters a research topic.
2. Application collects the required preferences.
3. Input and configured prompts are sent to Gemini AI.
4. Few-Shot examples guide the response structure.
5. Gemini generates the research content.
6. The report is displayed in organized sections.
7. User can copy or download the report.

### Generated Report Sections

- Research Title
- Abstract
- Introduction
- Research Questions
- Literature Review
- Research Methodology
- Key Findings
- Research Gaps
- Limitations
- Future Research Directions
- Conclusion
- References

## 📁 Project Structure

```text
ResearchMate-AI/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
│
├── public/
├── server/
├── researchmate_config.json
├── researchmate_prompt.txt
├── README.md
├── package.json
├── index.html
├── .env.example
└── .gitignore
```

## 🚀 Getting Started

**Prerequisites:** Node.js, npm and a Gemini API key.

**1. Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/ResearchMate-AI.git
```

**2. Navigate to the project**
```bash
cd ResearchMate-AI
```

**3. Install dependencies**
```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

**5. Start the application**
```bash
npm run dev
```

Open the localhost URL displayed in the terminal.

*If the backend requires a separate process, start it using the appropriate script.*

## 🔮 Future Scope

- Research paper PDF upload and summarization.
- Integration with Google Scholar and Semantic Scholar.
- APA and IEEE citation generation.
- Comparison of multiple research papers.
- Improved source verification.
- PDF report export.

## 🎓 Learning Outcomes

- Understanding AI-assisted application development.
- Learning prompt engineering and Few-Shot Prompting.
- Working with Gemini AI.
- Building applications using React and Node.js.
- Understanding JSON and API integration.
- Using Git and GitHub for version control.

## 👩‍💻 Author

**Harshita Nanda**  
Second-Year Engineering Student

Developed as part of the Skill Lab Assignment.

Note: ResearchMate AI is designed to support academic research. AI-generated information and references should be independently verified before use.
