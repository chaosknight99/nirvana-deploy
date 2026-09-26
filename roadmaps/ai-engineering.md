---
title: AI Engineering & Systems
slug: ai-engineering
color: #57e0c9
accent: #b98bf0
tagline: Cloud Engineer → AI Engineer → AI Systems Engineer → AI Architect
ranks: Cloud Engineer|AI Engineer (Emerging)|AI Engineer|AI Systems Engineer|AI Architect
---
## Baseline
Inventory your existing Azure, Terraform/Bicep, Kubernetes and FastAPI skills.
- REST & FastAPI: APIs, auth, OBO, managed identity.
- IaC & CI/CD: Terraform/Bicep and GitHub Actions.

## LLM Fundamentals
Tokens, embeddings, attention, context window, sampling.
- Tokens & Embeddings: Text to tokens to IDs to vector representations.
- Attention & Transformer: What attention does across stacked blocks.

## LLM App Engineering
Structured outputs, streaming, retries, provider abstraction.
- Structured Outputs: JSON schemas and function calling.
- LLM Gateway: Provider-agnostic layer over OpenAI, Claude, Azure.

## RAG
Chunking, embeddings, vector search, reranking, citations.
- Chunking & Vector DB: Parsing, chunking, embedding, retrieval.
- Reranking & Citations: Context construction, grounded answers.

## Agents
The reason, plan, act, observe loop built by hand once.
- Tool-Calling Loop: Question to tool decision to result to answer.
- Multi-Agent Patterns: Planning, reflection, retries, permissions.

## MCP
Servers, clients, tools, resources, auth, auditability.
- MCP Server & Client: Tools, resources and prompts at protocol level.
- Auth & Auditability: Authorization, statelessness, tool permissions.

## Evaluation
Correctness, groundedness, tool-call accuracy, cost and latency.
- Groundedness Testing: Offline eval sets scoring expected vs actual.
- Tool-Call Accuracy: Judging process, not just final outcome.

## AI System Design
Gateway, cache, model router, agent layer, observability.
- Semantic Cache: Cutting redundant model calls.
- Model Router: Routing requests by cost and capability.

## AI Infrastructure
vLLM, KV cache, GPU scheduling, Kubernetes autoscaling.
- Inference Serving: Prefill/decode, batching, TTFT, throughput.
- GPU & Kubernetes: Quantization, GPU Operator, autoscaling.

## ATLAS
The capstone: an AI Cloud Operations Platform end to end.
- Orchestration & Approval: Agent loop with human approval gates.
- Production Deployment: Auditability, cost and quality monitoring.
