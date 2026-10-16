import { Task } from '@/types';

export const initialTasks: Task[] = [
  {
    id: 'task_cloud_01',
    title: 'Deploy Serverless Microservices on Vercel Edge & AWS Lambda',
    description: 'Implement serverless handlers with zero cold-start latency, auto-scaling concurrency, and regional failover routing.',
    priority: 'urgent',
    status: 'in_progress',
    category: 'Cloud Computing',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    estimatedHours: 6,
    actualHours: 3.5,
    cloudResource: 'AWS Lambda / Vercel Edge',
    eisenhowerQuadrant: 'q1_urgent_important',
    aiSuggested: true,
    aiComplexityScore: 88,
    aiInsight: 'Critical milestone for cloud architecture verification. Edge routing reduces roundtrip latency by 64%.',
    tags: ['Serverless', 'Vercel', 'AWS', 'High Availability'],
    subtasks: [
      { id: 'sub_1', title: 'Configure Vercel Serverless Function regional settings (iad1)', completed: true, estimatedMinutes: 45 },
      { id: 'sub_2', title: 'Implement automated route fallback and retry backoff', completed: true, estimatedMinutes: 60 },
      { id: 'sub_3', title: 'Benchmark cold vs warm function invocation latency', completed: false, estimatedMinutes: 90 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_cloud_02',
    title: 'Automate CI/CD Cloud Pipeline via GitHub Actions',
    description: 'Create multi-stage workflow for automated linting, unit testing, security scanning, and production Vercel deployment on Git push.',
    priority: 'high',
    status: 'completed',
    category: 'DevOps',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimatedHours: 4,
    actualHours: 3,
    cloudResource: 'GitHub Actions / Vercel Deploy Hook',
    eisenhowerQuadrant: 'q1_urgent_important',
    aiSuggested: false,
    aiComplexityScore: 65,
    aiInsight: 'Continuous delivery pipeline guarantees zero-downtime updates and automated preview environments.',
    tags: ['CI/CD', 'GitHub', 'Automation', 'DevOps'],
    subtasks: [
      { id: 'sub_4', title: 'Write .github/workflows/deploy.yml', completed: true, estimatedMinutes: 40 },
      { id: 'sub_5', title: 'Configure environment secrets and token verification', completed: true, estimatedMinutes: 30 },
      { id: 'sub_6', title: 'Trigger initial production build verification', completed: true, estimatedMinutes: 20 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_cloud_03',
    title: 'Design Cloud Computing Architecture Diagram & Report',
    description: 'Document system topology, edge caching layer, serverless compute tier, cloud telemetry collector, and disaster recovery plan.',
    priority: 'high',
    status: 'in_progress',
    category: 'Architecture',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    estimatedHours: 5,
    actualHours: 2,
    cloudResource: 'CloudFront / AWS API Gateway',
    eisenhowerQuadrant: 'q2_not_urgent_important',
    aiSuggested: true,
    aiComplexityScore: 72,
    aiInsight: 'Key deliverable for college grading. High emphasis on horizontal scalability and SLA availability.',
    tags: ['Architecture', 'Documentation', 'SLA', 'Cloud'],
    subtasks: [
      { id: 'sub_7', title: 'Draft Component Interaction diagram (Edge to Cloud DB)', completed: true, estimatedMinutes: 60 },
      { id: 'sub_8', title: 'Document Vercel Serverless vs AWS Lambda comparison', completed: false, estimatedMinutes: 75 },
      { id: 'sub_9', title: 'Format academic report with KaTeX & benchmark graphs', completed: false, estimatedMinutes: 90 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_cloud_04',
    title: 'Fine-tune AI Task Breakdown and Semantic Parser Engine',
    description: 'Integrate LLM natural language processing to parse voice/text prompts into prioritized tasks, durations, and Eisenhower matrix tags.',
    priority: 'high',
    status: 'todo',
    category: 'AI & ML',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    estimatedHours: 8,
    actualHours: 0,
    cloudResource: 'Gemini Cloud LLM API',
    eisenhowerQuadrant: 'q2_not_urgent_important',
    aiSuggested: true,
    aiComplexityScore: 92,
    aiInsight: 'AI parsing utilizes few-shot cloud prompts with deterministic JSON schema validation.',
    tags: ['AI', 'LLM', 'Gemini', 'NLP'],
    subtasks: [
      { id: 'sub_10', title: 'Build structured JSON schema prompt for task extraction', completed: false, estimatedMinutes: 60 },
      { id: 'sub_11', title: 'Add real-time prompt token cost estimator', completed: false, estimatedMinutes: 45 },
      { id: 'sub_12', title: 'Implement fallback offline heuristics for 100% uptime', completed: false, estimatedMinutes: 60 }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_cloud_05',
    title: 'Configure Cloud Telemetry & Latency Monitor Dashboard',
    description: 'Simulate and render live serverless execution metrics, memory footprint, cache hit rates, and multi-region roundtrip times.',
    priority: 'medium',
    status: 'review',
    category: 'Cloud Computing',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    estimatedHours: 4,
    actualHours: 3.5,
    cloudResource: 'CloudWatch / Datadog Telemetry',
    eisenhowerQuadrant: 'q2_not_urgent_important',
    aiSuggested: false,
    aiComplexityScore: 55,
    aiInsight: 'Demonstrates observability and cloud performance monitoring for cloud examiners.',
    tags: ['Observability', 'Telemetry', 'CloudWatch', 'Metrics'],
    subtasks: [
      { id: 'sub_13', title: 'Create /api/cloud-telemetry serverless route', completed: true, estimatedMinutes: 40 },
      { id: 'sub_14', title: 'Render responsive charts and live terminal log stream', completed: true, estimatedMinutes: 60 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'task_cloud_06',
    title: 'Provision Terraform Multi-Cloud Infrastructure as Code',
    description: 'Write declarative HCL configurations for AWS provider with S3 bucket state storage, DynamoDB lock table, and IAM roles.',
    priority: 'medium',
    status: 'backlog',
    category: 'Architecture',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    estimatedHours: 5,
    actualHours: 0,
    cloudResource: 'Terraform / AWS S3',
    eisenhowerQuadrant: 'q2_not_urgent_important',
    aiSuggested: false,
    aiComplexityScore: 70,
    aiInsight: 'Demonstrates Infrastructure as Code (IaC) best practices for multi-tier cloud architectures.',
    tags: ['Terraform', 'IaC', 'AWS', 'Automation'],
    subtasks: [
      { id: 'sub_15', title: 'Write main.tf with AWS provider and DynamoDB resource', completed: false, estimatedMinutes: 60 },
      { id: 'sub_16', title: 'Add outputs.tf and variables.tf definitions', completed: false, estimatedMinutes: 45 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
