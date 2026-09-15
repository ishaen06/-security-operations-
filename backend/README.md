# ABB Security Operations - Backend Architecture & API Specifications

This directory represents the isolated backend layer for the ABB Enterprise Cybersecurity Monitoring and Incident-Response Platform.

> [!NOTE]
> Per specification, the platform operates purely on client-side simulation with realistic, high-fidelity mock datasets. Real firewall automation, live packet sniffing, database persistence, and external APIs are decoupled from the frontend interface.

## Repository Separation
- **`frontend/`**: Complete React 19 + TypeScript + Tailwind CSS desktop application using official ABB branding, top navigation bar, and enterprise SOC telemetry views.
- **`backend/`**: Backend service definitions, data schemas, and OpenAPI contracts for enterprise integration (SIEM, EDR, NGFW, and CMDB).

## Decoupled API Contract
The backend service contracts are documented in [`openapi.json`](./openapi.json):
- `GET /api/v1/dashboard/metrics`: 24-hour ingestion velocity, alert spikes, and uncontained incident counters.
- `GET /api/v1/incidents`: Query, filter, and stream security incidents.
- `POST /api/v1/incidents/{id}/actions/{actionId}/execute`: Trigger containment playbooks (host isolation, IP blocking, port restriction, domain sinkholing).
- `GET /api/v1/network/topology`: Hierarchical flow (Internet → Perimeter NGFW → Core Router → Subnets → Hosts).
- `GET /api/v1/assets`: Endpoint CMDB asset register and real-time sensor metrics.
- `GET /api/v1/vulnerabilities`: CVSS v3.1 vulnerability catalog and remediation playbooks.
- `GET /api/v1/reports`: Incident report dossiers and formal compliance records.
