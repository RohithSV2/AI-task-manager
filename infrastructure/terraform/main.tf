# Multi-Cloud Terraform Infrastructure Specification
# Target: Amazon Web Services (AWS) Multi-Tier Serverless Backbone

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  description = "Target AWS Cloud deployment region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

# 1. AWS DynamoDB Table for Serverless Task State Persistence
resource "aws_dynamodb_table" "tasks_table" {
  name           = "ai-task-manager-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Environment = var.environment
    Project     = "CloudTask-AI"
    ManagedBy   = "Terraform"
  }
}

# 2. AWS S3 Bucket for Cloud Task Attachments & Build Artifacts
resource "aws_s3_bucket" "attachments_bucket" {
  bucket        = "ai-task-manager-artifacts-${var.environment}"
  force_destroy = true

  tags = {
    Environment = var.environment
    Project     = "CloudTask-AI"
  }
}

resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket                  = aws_s3_bucket.attachments_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 3. AWS CloudWatch Log Group for Serverless Observability
resource "aws_cloudwatch_log_group" "serverless_logs" {
  name              = "/aws/serverless/ai-task-manager"
  retention_in_days = 14

  tags = {
    Environment = var.environment
    Project     = "CloudTask-AI"
  }
}

output "dynamodb_table_name" {
  description = "DynamoDB Tasks Table Name"
  value       = aws_dynamodb_table.tasks_table.name
}

output "s3_bucket_name" {
  description = "S3 Artifacts Bucket Name"
  value       = aws_s3_bucket.attachments_bucket.bucket
}
