# Cloud Computing System Architecture & Project Documentation
## Project: CloudTask AI - Autonomous Cloud-Native Task Management Platform
**Author:** Rohith S V  
**Repository:** [https://github.com/RohithSV2/AI-task-manager](https://github.com/RohithSV2/AI-task-manager)  
**Target Cloud Platforms:** Vercel Edge Serverless & Amazon Web Services (AWS)

---

## 1. Executive Summary & Problem Statement
Modern DevOps and cloud engineering teams manage thousands of distributed tasks, incident responses, and infrastructure deployments across multiple cloud providers. Traditional task trackers lack cloud awareness, real-time telemetry, serverless scaling, and intelligent workload decomposition.

**CloudTask AI** addresses this problem by providing a cloud-native platform that:
1. Employs a **5-tier serverless microservices architecture** that scales automatically with zero idle server cost.
2. Integrates **LLM Inference Engines (Google Gemini)** for natural language task parsing, milestone decomposition, and Eisenhower Matrix prioritization.
3. Provides **real-time cloud observability and telemetry** simulating serverless function execution latencies, memory consumption, and edge cache hit ratios.
4. Implements automated **CI/CD pipelines via GitHub Actions** for zero-downtime rolling updates.

---

## 2. Cloud Architecture Diagram

```
[ User Web Browser ]
         │
         ▼ (HTTPS / TLS 1.3 / DNS Anycast)
┌─────────────────────────────────────────────────────────────┐
│ Tier 1: Vercel Anycast Edge Network / AWS CloudFront CDN   │
│  - Static Asset Edge Caching                                │
│  - Dynamic SSR Bundle Delivery                              │
│  - Regional Routing (iad1 - US East 1)                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼ (Sub-10ms Route Dispatch)
┌─────────────────────────────────────────────────────────────┐
│ Tier 2: Serverless Microservices Layer (AWS Lambda / Vercel)│
│  ├── /api/tasks             - CRUD REST Operations          │
│  ├── /api/ai/parse          - Natural Language NLP Parser   │
│  ├── /api/ai/breakdown      - Milestone Decomposition       │
│  ├── /api/ai/prioritize     - Eisenhower Matrix Engine      │
│  ├── /api/ai/chat           - Task Copilot Assistant        │
│  └── /api/cloud-telemetry   - Observability & Metrics       │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌─────────────────────────────┐ ┌─────────────────────────────┐
│ Tier 3: AI Cloud Inference  │ │ Tier 4: Storage & Caching   │
│  - Google Gemini 1.5 Flash  │ │  - LocalStorage State Cache │
│  - Heuristic Engine Fallback│ │  - Serverless REST Store    │
│  - Token Cost Tracker       │ │  - Multi-Cloud S3 / DynamoDB│
└─────────────────────────────┘ └─────────────────────────────┘
                               ▲
                               │ (Continuous Deployment)
┌─────────────────────────────────────────────────────────────┐
│ Tier 5: DevOps & Infrastructure as Code (IaC)               │
│  - GitHub Actions Workflow (.github/workflows/deploy.yml)   │
│  - Terraform Multi-Cloud Manifests (infrastructure/terraform│
│  - Containerized Docker Build (Dockerfile)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Mapping: AWS Native Services vs. Vercel Serverless

| Architectural Component | AWS Native Equivalent | Vercel Implementation | Advantage in Project |
| :--- | :--- | :--- | :--- |
| **Content Delivery Network (CDN)** | AWS CloudFront | Vercel Edge Network | Sub-15ms edge cache delivery |
| **Serverless Compute** | AWS Lambda | Vercel Serverless Functions | Automatic scale-to-zero, 0 cold start issues |
| **API Gateway** | AWS API Gateway (v2) | Next.js 14 App Router Routes | Native TypeScript routing and unified middleware |
| **AI Inference** | AWS Bedrock (Claude / Titan) | Google Gemini 1.5 Flash API | Structured JSON mode and natural language parsing |
| **Monitoring & Telemetry** | AWS CloudWatch / X-Ray | Live Telemetry Dashboard | Real-time visual metrics and runtime logs |
| **Infrastructure as Code** | AWS CloudFormation | Terraform HCL (`main.tf`) | Multi-cloud portability and declarative syntax |
| **CI/CD Automation** | AWS CodePipeline / CodeBuild | GitHub Actions CI/CD | Push-to-deploy automated release pipeline |

---

## 4. Key Cloud Computing Concepts Demonstrated

### 4.1 Serverless Scalability & Elasticity
The application contains zero long-running EC2/VM instances. Each HTTP request to `/api/*` triggers an isolated serverless function instance. During traffic spikes, the cloud provider horizontally spins up parallel instances without manual capacity provisioning.

### 4.2 High Availability & SLA
- Multi-Region Availability: By leveraging Anycast routing, client requests automatically route to the lowest latency PoP (Point of Presence).
- Fallback Heuristics: If external cloud AI APIs experience network timeouts or rate limits, the system seamlessly activates the internal rule-based heuristic engine with zero downtime.

### 4.3 Security & Least Privilege
- Environment Variable Isolation: All API credentials remain isolated in serverless memory environments and are never leaked to client bundles.
- TLS 1.3 Encryption: Enforced HTTPS for all edge communications.
- Content Security & Input Sanitization: Strict TypeScript validation and JSON parsing prevent injection attacks.

---

## 5. API Microservices Specification

### `POST /api/ai/parse`
Deconstructs natural language inputs into structured task specifications.
- **Request Body:**
  ```json
  { "prompt": "Deploy Redis cluster on AWS EC2 by tomorrow 6pm with high priority" }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "title": "Deploy Redis cluster on AWS EC2",
      "priority": "high",
      "category": "Cloud Computing",
      "dueDate": "2026-10-17",
      "estimatedHours": 4,
      "eisenhowerQuadrant": "q2_not_urgent_important",
      "cloudResource": "AWS EC2 / Elasticache",
      "subtasks": [...]
    }
  }
  ```

### `POST /api/ai/breakdown`
Generates structured sub-phases for complex engineering tasks.

### `POST /api/ai/prioritize`
Evaluates tasks against urgency and importance matrices, reclassifying tasks across the 4 Eisenhower quadrants.

### `GET /api/cloud-telemetry`
Returns simulated cloud runtime telemetry including serverless function latency, allocated memory, edge cache hit ratio, and live CloudWatch logs stream.
