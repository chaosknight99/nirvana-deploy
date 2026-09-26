---
title: Kubernetes Mastery
slug: kubernetes-mastery
color: #b98bf0
accent: #ff8ad4
tagline: From kubectl apply to running the cluster
ranks: Beginner|User|Operator|SRE|Cluster Architect
---
## Core Objects
Pods, deployments, services, the basic vocabulary.
- Pods & Deployments: Desired state and rollouts.
- Services & Ingress: Getting traffic to the right place.

## Configuration
Keeping app config out of images.
- ConfigMaps & Secrets: Externalized configuration.
- Helm: Templated, versioned releases.

## Networking
How pods actually talk to each other.
- CNI & Network Policy: Pod-to-pod traffic rules.
- Service Mesh: mTLS, retries, traffic shaping.

## Storage
Stateful workloads on a stateless-by-default system.
- Persistent Volumes: Storage classes and claims.
- StatefulSets: Ordered, stable identities for stateful apps.

## Scaling & Resilience
Handling real load and real failure.
- HPA & Cluster Autoscaler: Scaling pods and nodes.
- Pod Disruption Budgets: Staying available during change.

## Security
Locking the cluster down.
- Pod Security Standards: Constraining what workloads can do.
- Image Scanning & Admission Control: Stopping bad images at the gate.

## Operating the Cluster
Running Kubernetes as a platform, not just a runtime.
- GPU Scheduling: Serving ML workloads efficiently.
- Multi-Tenancy & Cost: Namespaces, quotas, chargeback.
