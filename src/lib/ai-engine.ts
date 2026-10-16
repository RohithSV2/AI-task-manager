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
  project?: string;
  eisenhowerQuadrant: EisenhowerQuadrant;
  aiComplexityScore: number;
  aiInsight: string;
}

export async function parseWithGemini(prompt: string, apiKey: string): Promise<AIParsedTaskResult | null> {
  try {
    const systemPrompt = `You are a smart AI Personal Productivity Assistant and Task Planner.
Extract structured task details from the user prompt and respond ONLY with a raw JSON object (no markdown, no backticks):
{
  "title": "string (clear, actionable task title)",
  "description": "string (brief summary of objectives)",
  "priority": "low" | "medium" | "high" | "urgent",
  "category": "Work" | "Personal" | "Development" | "Design" | "Study" | "Health",
  "dueDate": "YYYY-MM-DD",
  "estimatedHours": number,
  "subtasks": [{"title": "string", "estimatedMinutes": number}],
  "tags": ["string"],
  "project": "string",
  "eisenhowerQuadrant": "q1_urgent_important" | "q2_not_urgent_important" | "q3_urgent_not_important" | "q4_not_urgent_not_important",
  "aiComplexityScore": number (1-100),
  "aiInsight": "string (practical tip or recommendation)"
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
  let category: TaskCategory = 'Work';
  if (lower.includes('study') || lower.includes('exam') || lower.includes('homework') || lower.includes('course') || lower.includes('assignment') || lower.includes('read') || lower.includes('learn')) {
    category = 'Study';
  } else if (lower.includes('workout') || lower.includes('gym') || lower.includes('run') || lower.includes('health') || lower.includes('cardio') || lower.includes('diet') || lower.includes('meditation')) {
    category = 'Health';
  } else if (lower.includes('design') || lower.includes('figma') || lower.includes('ui') || lower.includes('ux') || lower.includes('logo') || lower.includes('wireframe')) {
    category = 'Design';
  } else if (lower.includes('code') || lower.includes('bug') || lower.includes('api') || lower.includes('dev') || lower.includes('app') || lower.includes('git') || lower.includes('database')) {
    category = 'Development';
  } else if (lower.includes('home') || lower.includes('buy') || lower.includes('grocery') || lower.includes('trip') || lower.includes('vacation') || lower.includes('family') || lower.includes('personal')) {
    category = 'Personal';
  }

  // Due date detection
  const now = new Date();
  let daysToAdd = 2;
  if (lower.includes('today')) daysToAdd = 0;
  else if (lower.includes('tomorrow')) daysToAdd = 1;
  else if (lower.includes('friday')) daysToAdd = ((5 - now.getDay() + 7) % 7) || 7;
  else if (lower.includes('monday')) daysToAdd = ((1 - now.getDay() + 7) % 7) || 7;
  else if (lower.includes('weekend')) daysToAdd = ((6 - now.getDay() + 7) % 7) || 7;
  else if (lower.includes('next week')) daysToAdd = 7;
  else if (lower.includes('in 3 days')) daysToAdd = 3;
  else if (lower.includes('in 5 days')) daysToAdd = 5;

  const targetDate = new Date(now.getTime() + daysToAdd * 86400000);
  const dueDate = targetDate.toISOString().split('T')[0];

  // Hours estimation
  let estimatedHours = 3;
  const hourMatch = lower.match(/(\d+)\s*(?:hour|hr|h\b)/);
  if (hourMatch) {
    estimatedHours = parseInt(hourMatch[1], 10);
  } else if (priority === 'urgent') {
    estimatedHours = 4;
  } else if (priority === 'low') {
    estimatedHours = 1.5;
  }

  // Title formatting
  const cleanTitle = input
    .replace(/(urgent|asap|critical|high priority|by friday|by tomorrow|today|in \d+ days|by monday|by tonight)/gi, '')
    .trim()
    .replace(/^[-*•\s]+/, '');

  const title = cleanTitle.length > 5 
    ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)
    : input.charAt(0).toUpperCase() + input.slice(1);

  // Tags & Project
  const tags: string[] = [category];
  let project = `${category} Tasks`;

  if (category === 'Development') {
    tags.push('Engineering');
    project = 'Product Development';
  } else if (category === 'Design') {
    tags.push('UI/UX');
    project = 'Product Design';
  } else if (category === 'Study') {
    tags.push('Learning');
    project = 'Academics';
  } else if (category === 'Health') {
    tags.push('Wellness');
    project = 'Fitness & Routine';
  } else if (category === 'Work') {
    tags.push('Productivity');
    project = 'Quarterly Goals';
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
    { title: `Prepare materials and outline approach for ${title.slice(0, 30)}`, estimatedMinutes: 30 },
    { title: `Execute core work and main deliverables`, estimatedMinutes: 60 },
    { title: `Review results, refine details, and finalize`, estimatedMinutes: 30 }
  ];

  const aiComplexityScore = Math.min(95, Math.max(25, estimatedHours * 15 + (priority === 'urgent' ? 20 : 5)));
  const aiInsight = `AI Suggestion: Break this down into 45-minute focused focus sessions to maintain high cognitive momentum.`;

  return {
    title,
    description: `Created with AI Natural Language Engine. Target category: ${category}.`,
    priority,
    category,
    dueDate,
    estimatedHours,
    subtasks,
    tags,
    project,
    eisenhowerQuadrant,
    aiComplexityScore,
    aiInsight
  };
}

export function generateSmartSubtasks(title: string, category: TaskCategory): Subtask[] {
  let steps: string[] = [];

  if (category === 'Study') {
    steps = [
      `Review core syllabus concepts & lecture notes for ${title.slice(0, 30)}`,
      `Create high-yield revision summary sheet or flashcards`,
      `Solve practice questions and test understanding under timed conditions`
    ];
  } else if (category === 'Design') {
    steps = [
      `Gather visual inspiration and competitor benchmark examples`,
      `Create wireframes and layout structures in design tool`,
      `Refine typography, colors, interactions, and review with team`
    ];
  } else if (category === 'Development') {
    steps = [
      `Define technical architecture, schema, and API contracts`,
      `Implement feature logic, edge-case handling, and error states`,
      `Write unit tests and perform peer code review`
    ];
  } else if (category === 'Health') {
    steps = [
      `Set up equipment, warm up dynamically, and hydrate`,
      `Complete main workout or activity routine with target intensity`,
      `Post-workout cool down, stretching, and nutrition log`
    ];
  } else {
    steps = [
      `Phase 1: Clarify objectives, constraints, and gather requirements`,
      `Phase 2: Complete the primary deliverables and draft solutions`,
      `Phase 3: Polish, review with stakeholders, and confirm completion`
    ];
  }

  return steps.map((s, idx) => ({
    id: generateId(),
    title: s,
    completed: false,
    estimatedMinutes: idx === 1 ? 60 : 30
  }));
}
