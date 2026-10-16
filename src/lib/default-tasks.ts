import { Task } from '@/types';

export const initialTasks: Task[] = [
  {
    id: 'task_gen_01',
    title: 'Finalize Q4 Product Roadmap & Feature Specifications',
    description: 'Synthesize feedback from customer interviews, prioritize high-impact feature requests, and align sprint milestones with engineering capacity.',
    priority: 'urgent',
    status: 'in_progress',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    estimatedHours: 5,
    actualHours: 2.5,
    project: 'Product Strategy',
    eisenhowerQuadrant: 'q1_urgent_important',
    aiSuggested: true,
    aiComplexityScore: 82,
    aiInsight: 'Critical project deliverable. Focus on the core value proposition first before expanding scope.',
    tags: ['Roadmap', 'Strategy', 'Planning'],
    subtasks: [
      { id: 'sub_1', title: 'Review customer interview notes and survey results', completed: true, estimatedMinutes: 45 },
      { id: 'sub_2', title: 'Draft prioritized feature matrix with effort estimates', completed: true, estimatedMinutes: 60 },
      { id: 'sub_3', title: 'Schedule stakeholder alignment review meeting', completed: false, estimatedMinutes: 30 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_gen_02',
    title: 'Redesign Mobile Checkout User Interface',
    description: 'Streamline the cart checkout flow, simplify address input, and improve conversion rate on mobile devices.',
    priority: 'high',
    status: 'completed',
    category: 'Design',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    estimatedHours: 4,
    actualHours: 4,
    project: 'Mobile UX',
    eisenhowerQuadrant: 'q1_urgent_important',
    aiSuggested: false,
    aiComplexityScore: 68,
    aiInsight: 'A 2-step simplified checkout reduces user drop-off by up to 28%.',
    tags: ['UX', 'Figma', 'Mobile', 'Design'],
    subtasks: [
      { id: 'sub_4', title: 'Analyze existing funnel drop-off analytics', completed: true, estimatedMinutes: 45 },
      { id: 'sub_5', title: 'Create interactive Figma wireframes and prototypes', completed: true, estimatedMinutes: 90 },
      { id: 'sub_6', title: 'Conduct quick usability review with design team', completed: true, estimatedMinutes: 30 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_gen_03',
    title: 'Implement User Authentication & OAuth Social Login',
    description: 'Add secure email/password and Google/GitHub authentication with JWT sessions and password recovery.',
    priority: 'high',
    status: 'in_progress',
    category: 'Development',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    estimatedHours: 6,
    actualHours: 3,
    project: 'Core Platform',
    eisenhowerQuadrant: 'q2_not_urgent_important',
    aiSuggested: true,
    aiComplexityScore: 78,
    aiInsight: 'Implementing OAuth standardizes session management and boosts user signup completion.',
    tags: ['Auth', 'Security', 'TypeScript'],
    subtasks: [
      { id: 'sub_7', title: 'Set up OAuth client credentials and redirect handlers', completed: true, estimatedMinutes: 60 },
      { id: 'sub_8', title: 'Build clean login and registration modal screens', completed: false, estimatedMinutes: 60 },
      { id: 'sub_9', title: 'Write unit tests for session verification and logout', completed: false, estimatedMinutes: 45 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_gen_04',
    title: 'Prepare Final Academic Project Presentation & Slide Deck',
    description: 'Create concise 12-slide presentation summarizing project architecture, problem statement, demo screenshots, and metrics.',
    priority: 'urgent',
    status: 'todo',
    category: 'Study',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimatedHours: 4,
    actualHours: 0,
    project: 'Academics',
    eisenhowerQuadrant: 'q1_urgent_important',
    aiSuggested: true,
    aiComplexityScore: 70,
    aiInsight: 'High deadline urgency. Keep slides visual and practice the 5-minute live demonstration.',
    tags: ['Presentation', 'Slides', 'Demo'],
    subtasks: [
      { id: 'sub_10', title: 'Outline key sections: Problem, Solution, Architecture, Demo', completed: false, estimatedMinutes: 30 },
      { id: 'sub_11', title: 'Capture high-res application screenshots and flow diagrams', completed: false, estimatedMinutes: 45 },
      { id: 'sub_12', title: 'Rehearse speech and timing', completed: false, estimatedMinutes: 45 }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_gen_05',
    title: 'Weekly 10K Training & Cardio Routine',
    description: 'Complete 3 running sessions focusing on steady pacing and active recovery stretching.',
    priority: 'medium',
    status: 'in_progress',
    category: 'Health',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    estimatedHours: 3,
    actualHours: 1.5,
    project: 'Fitness Goals',
    eisenhowerQuadrant: 'q2_not_urgent_important',
    aiSuggested: false,
    aiComplexityScore: 40,
    aiInsight: 'Consistent exercise directly improves daily focus and cognitive stamina.',
    tags: ['Running', 'Fitness', 'Routine'],
    subtasks: [
      { id: 'sub_13', title: 'Session 1: 4km steady base pace', completed: true, estimatedMinutes: 30 },
      { id: 'sub_14', title: 'Session 2: 5km tempo run with intervals', completed: false, estimatedMinutes: 35 },
      { id: 'sub_15', title: 'Session 3: 6km endurance run', completed: false, estimatedMinutes: 45 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_gen_06',
    title: 'Plan Weekend Trip & Booking Accommodations',
    description: 'Research scenic hiking destinations, compare cabin rentals, and assemble the packing checklist.',
    priority: 'low',
    status: 'backlog',
    category: 'Personal',
    dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    estimatedHours: 2,
    actualHours: 0,
    project: 'Leisure',
    eisenhowerQuadrant: 'q4_not_urgent_not_important',
    aiSuggested: false,
    aiComplexityScore: 30,
    aiInsight: 'Relaxation and recovery prevent burnout. Schedule this during evening downtime.',
    tags: ['Travel', 'Weekend', 'Leisure'],
    subtasks: [
      { id: 'sub_16', title: 'Check trail conditions and weather forecasts', completed: false, estimatedMinutes: 20 },
      { id: 'sub_17', title: 'Confirm lodging reservations and packing list', completed: false, estimatedMinutes: 30 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
