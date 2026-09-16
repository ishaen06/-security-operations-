# ABB Security Operations | Enterprise Cyber Defense (HTML Edition)

**Official Standalone Pure-HTML Distribution**  
**Branch:** `ishaen`  
**Engine:** ABB Adaptive SOC Engine & OT Micro-Segmentation Platform  

---

## Overview
This branch contains the **complete, zero-dependency HTML edition** of the ABB Cybersecurity Operations Platform. The entire application—including interactive network topology visualization, 7-step incident response automation, real-time telemetry streaming, and executive incident dossiers—is self-contained within **`index.html`**.

### Key Features (100% Preserved from Original):
- **Zero-Trust Micro-Segmentation Canvas**: Visualizes Purdue Model infrastructure across Subnets A (Robotics), B (Process Chem), and C (Substation Grid) with bidirectional colored conduits (Downstream Electric Lilac `#615EEF` and Upstream Violet `#9061F9`).
- **7-Step Automated Response Sequence**:
  - **Step 01 (Detection)**: 3s
  - **Step 02 (Classification)**: 3s
  - **Step 03 (Subnet Identification)**: 3s
  - **Step 04 (Risk Assessment)**: 3s
  - **Step 05 (Network Isolation)**: 3s
  - **Step 06 (Incident Logging)**: 3s
  - **Step 07 (Remediation)**: 5s (Dynamic IP lease rotation `10.10.30.42` → `10.10.30.198` + mutual TLS 1.3 handshake packet to Main Server `10.10.0.1`).
- **Continuous Live Telemetry Feed**: Real-time NetFlow and Syslog streaming table with search, protocol filters, and severity tags.
- **Unified Single-Page Incident Dossier**: Complete modal report with timestamps, CVE mappings, physical consequences (turbines, pressure vessels, robotic arms), affected parameters, DNS sinkholes, and print-ready layout.
- **Industrial Dark & Light Modes**: Instant theme toggle preserving ABB signature industrial styling (`#FF000F` red accents).

---

## How to Run

No Node.js, npm, or build tools are required!

1. **Direct Browser Execution**:
   - Double-click [`index.html`](./index.html) to open directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari.
2. **GitHub Pages Deployment**:
   - In GitHub repository settings under **Pages**, select branch `ishaen` and root `/`. The live site will instantly be available online.
3. **Local Static Server (Optional)**:
   ```bash
   python -m http.server 8000
   # Open http://localhost:8000
   ```

---

## Reports Included
- [abb_executive_report.md](./abb_executive_report.md) — Comprehensive one-page technical & strategic brief for ABB.
- [ABB_Executive_Report.docx](./ABB_Executive_Report.docx) — Formal Microsoft Word document format.

*(For the complete TypeScript / React / Node development codebase, switch to the `main` branch).*

