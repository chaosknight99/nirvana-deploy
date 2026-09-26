---
title: RAG Engineering
slug: rag-engineering
color: #ff8ad4
accent: #7fa8f0
tagline: Retrieval + generation, done properly
ranks: Novice|Builder|Practitioner|Evaluator|RAG Specialist
---
## Document Processing
Getting messy real-world documents into shape.
- Parsing: PDFs, HTML, tables, and messy formats.
- Chunking Strategy: Fixed, semantic, and recursive chunking.

## Embeddings
Turning text into searchable vectors.
- Embedding Models: Choosing and evaluating embedding models.
- Vector Databases: Indexing and approximate nearest neighbor search.

## Retrieval
Getting the right context, not just any context.
- Hybrid Search: Combining keyword and vector search.
- Reranking: Improving precision after initial retrieval.

## Generation
Turning retrieved context into a grounded answer.
- Context Construction: Assembling prompts from retrieved chunks.
- Citations: Attributing answers back to sources.

## Failure Modes
Why RAG breaks, and how to notice.
- Hallucination Detection: Catching ungrounded claims.
- Stale Data Handling: Keeping the index fresh.

## Evaluation
Proving the system actually works.
- Retrieval Metrics: Precision, recall, and relevance at k.
- Groundedness Scoring: Measuring answer faithfulness.

## Production RAG
Running it at scale, reliably.
- Latency & Cost Dashboard: Operational visibility.
- Continuous Evaluation: Regression-testing your RAG pipeline.
