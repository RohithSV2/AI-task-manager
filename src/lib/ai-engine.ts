import { Task, EisenhowerQuadrant, Priority, TaskCategory, Subtask } from '@/types';
import { generateId } from './utils';

export interface AIParsedTaskResult {
  title: string;
  description: string;
  priority: Priority;
  category: TaskCategory;
  dueDate: string;
  estimatedHours: number;
  subtasks: { title: string; estimatedMinutes: number }[];
  tags: string[];
  cloudResource: string;
  eisenhowerQuadrant: EisenhowerQuadrant;
  aiComplexityScore: number;
  aiInsight: string;
}

export async function parseWithGemini(prompt: string, apiKey: string): Promise<AIParsedTaskResult | null> {
  try {
    const systemPrompt = `You are an AI Task Architect specialized in Cloud Computing, DevOps, and Full-Stack Engineering.
Extract task details from the following user prompt and respond ONLY with a raw JSON object (no markdown, no backticks):
{
  "title": "string",
  "description": "string",
  "priority": "low" | "medium" | "high" | "urgent",
  "category": "Cloud Computing" | "DevOps" | "AI & ML" | "Architecture" | "General",
  "dueDate": "YYYY-MM-DD",
  "estimatedHours": number,
  "subtasks": [{"title": "string", "estimatedMinutes": number}],
  "tags": ["string"],
  "cloudResource": "string (e.g. AWS Lambda, S3, Vercel Edge, DynamoDB)",
  "eisenhowerQuadrant": "q1_urgent_important" | "q2_not_urgent_important" | "q3_urgent_not_important" | "q4_not_urgent_not_important",
  "aiComplexityScore": number (1-100),
  "aiInsight": "string"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\nUser Input: ${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (err) {
    console.error('Gemini API call failed, falling back to heuristic engine:', err);
    return null;
  }
}

export function parseWithHeuristics(input: string): AIParsedTaskResult {
  const lower = input.toLowerCase();

  // Priority detection
  let priority: Priority = 'medium';
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('critical') || lower.includes('immediately')) {
    priority = 'urgent';
  } else if (lower.includes('high') || lower.includes('important') || lower.includes('priority')) {
    priority = 'high';
  } else if (lower.includes('low') || lower.includes('later') || lower.includes('minor') || lower.includes('whenever')) {
    priority = 'low';
  }

  // Category detection
  let category: TaskCategory = 'Cloud Computing';
  if (lower.includes('devops') || lower.includes('ci/cd') || lower.includes('pipeline') || lower.includes('docker') || lower.includes('github action')) {
    category = 'DevOps';
  } else if (lower.includes('ai') || lower.includes('ml') || lower.includes('llm') || lower.includes('model') || lower.includes('prompt') || lower.includes('nlp')) {
    category = 'AI & ML';
  } else if (lower.includes('architect') || lower.includes('design') || lower.includes('system') || lower.includes('diagram') || lower.includes('terraform')) {
    category = 'Architecture';
  } else if (lower.includes('personal') || lower.includes('study') || lower.includes('exam') || lower.includes('gym')) {
    category = 'General';
  }

  // Due date detection
  const now = new Date();
  let daysToAdd = 2;
  if (lower.includes('today')) daysToAdd = 0;
  else if (lower.includes('tomorrow')) daysToAdd = 1;
  else if (lower.includes('friday')) daysToAdd = ((5 - now.getDay() + 7) % 7) || 7;
  else if (lower.includes('monday')) daysToAdd = ((1 - now.getDay() + 7) % 7) || 7;
  else if (lower.includes('next week')) daysToAdd = 7;
  else if (lower.includes('in 3 days')) daysToAdd = 3;
  else if (lower.includes('in 5 days')) daysToAdd = 5;

  const targetDate = new Date(now.getTime() + daysToAdd * 86400000);
  const dueDate = targetDate.toISOString().split('T')[0];

  // Hours estimation
  let estimatedHours = 4;
  const hourMatch = lower.match(/(\d+)\s*(?:hour|hr|h\b)/);
  if (hourMatch) {
    estimatedHours = parseInt(hourMatch[1], 10);
  } else if (priority === 'urgent') {
    estimatedHours = 6;
  } else if (priority === 'low') {
    estimatedHours = 2;
  }

  // Title formatting
  const cleanTitle = input
    .replace(/(urgent|asap|critical|high priority|by friday|by tomorrow|today|in \d+ days)/gi, '')
    .trim()
    .replace(/^[-*•\s]+/, '');

  const title = cleanTitle.length > 5 
    ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)
    : input.charAt(0).toUpperCase() + input.slice(1);

  // Tags & Cloud Resource
  const tags: string[] = ['Cloud'];
  let cloudResource = 'Vercel Serverless Function';

  if (category === 'DevOps') {
    tags.push('CI/CD', 'GitHub');
    cloudResource = 'GitHub Actions / Vercel Deploy Hooks';
  } else if (category === 'AI & ML') {
    tags.push('Gemini AI', 'Inference');
    cloudResource = 'Gemini Cloud LLM API';
  } else if (category === 'Architecture') {
    tags.push('IaC', 'Terraform');
    cloudResource = 'AWS CloudFront / API Gateway';
  } else {
    tags.push('Serverless', 'Microservices');
    cloudResource = 'AWS Lambda / Vercel Edge';
  }

  // Eisenhower Matrix
  let eisenhowerQuadrant: EisenhowerQuadrant = 'q2_not_urgent_important';
  if (priority === 'urgent') {
    eisenhowerQuadrant = 'q1_urgent_important';
  } else if (priority === 'high') {
    eisenhowerQuadrant = 'q2_not_urgent_important';
  } else if (priority === 'low') {
    eisenhowerQuadrant = 'q4_not_urgent_not_important';
  } else {
    eisenhowerQuadrant = 'q3_urgent_not_important';
  }

  // Subtasks generation
  const subtasks = [
    { title: `Initialize environment and specifications for ${title.slice(0, 30)}`, estimatedMinutes: 45 },
    { title: `Develop core implementation and serverless logic`, estimatedMinutes: 90 },
    { title: `Perform cloud benchmark and integration testing`, estimatedMinutes: 45 }
  ];

  const aiComplexityScore = Math.min(95, Math.max(30, estimatedHours * 12 + (priority === 'urgent' ? 25 : 10)));
  const aiInsight = `AI Analysis: Rated complexity ${aiComplexityScore}/100. Best executed in ${cloudResource} with automated scaling policies.`;

  return {
    title,
    description: `Task created via AI Natural Language Engine. Target cloud resource: ${cloudResource}.`,
    priority,
    category,
    dueDate,
    estimatedHours,
    subtasks,
    tags,
    cloudResource,
    eisenhowerQuadrant,
    aiComplexityScore,
    aiInsight
  };
}

export function generateSmartSubtasks(title: string, category: TaskCategory): Subtask[] {
  return [
    {
      id: generateId(),
      title: `Step 1: Architectural design and requirement mapping for ${title.slice(0, 35)}`,
      completed: false,
      estimatedMinutes: 45
    },
    {
      id: generateId(),
      title: `Step 2: Serverless implementation & API endpoint integration`,
      completed: false,
      estimatedMinutes: 90
    },
    {
      id: generateId(),
      title: `Step 3: Verification, latency benchmark, and cloud deployment validation`,
      completed: false,
      estimatedMinutes: 45
    }
  ];
}
