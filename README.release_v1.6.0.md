# Release Notes: Korelate v1.6.0

This major release marks a significant milestone in Korelate's evolution, introducing full **I3X protocol compliance**, **AI-driven semantic modeling**, and a massive expansion of industrial and IT **data connectors**.

---

### 🚀 Key Features & Highlights

*   **I3X Protocol Support (RFC 001)**: Full implementation of the Industrial Information Interface eXchange. Connect to remote I3X servers, subscribe via SSE streaming, and build standard contextualized data models.
*   **AI-Powered Semantic Modeling**: The new "Learning Studio" in the Chart view leverages DuckDB profiling and LLMs (Gemini/Claude/OpenAI) to automatically infer UNS hierarchies, object types, and relationships based on ISA-95 or Brick Schema.
*   **Expanded Connector Library**:
    *   **Industrial**: Modbus TCP, Siemens S7 (S7-Comm), EtherNet/IP (CIP), BACnet/IP, KNX/IP.
    *   **IT & Data**: SQL (Postgres, MySQL, MSSQL) Poller, REST API Poller, SNMP, Apache Kafka.
*   **Native InfluxDB Support**: Added InfluxDB v2 as a native Perennial Storage driver alongside TimescaleDB.
*   **Granular RBAC**: Replaced the binary User/Admin model with a granular hierarchy: Viewer (Read-only), Operator (Publish), Engineer (Mappers/Rules), and Admin.

### 🏗️ Architecture & Performance

*   **Worker Threads**: Offloaded heavy JSON parsing and Sparkplug B Protobuf decoding to Node.js Worker Threads (`core/messageDispatcher.js`) to protect the main event loop and ensure UI responsiveness during massive telemetry spikes.
*   **DuckDB Profiling API**: Implemented advanced SQL window functions in DuckDB (`lag()`) for real-time statistical analysis (Min, Max, Mean, StdDev, Frequency, Chatter) of time-series data without impacting performance.
*   **WebSocket Backpressure**: Implemented strict backpressure management to prevent Node.js memory leaks (OOM) when connected to high-throughput MQTT brokers.
*   **Connectivity Resilience**: Added sequential asynchronous hot-reloading for Data Providers to ensure clean socket closures and prevent "zombie" connections during configuration changes.
*   **Docker Test Matrix**: Overhauled `docker-compose.yml.local` with 14 simulation containers and Compose Profiles for local protocol integration testing.

### 🎨 UI/UX Overhaul & Fixes

*   **Lean View Pattern**: Refactored major views (Chart, Mapper, Alerts) into highly decoupled Web Components with native DOM shadow-isolation.
*   **Tree Polish**: Tree views (Main, Chart, Mapper) are now significantly more compact and automatically inject protocol-specific icons (📡, ⚙️, 🧠).
*   **CDM Modeler V3**: Introduced a 3-Column IDE Layout, a dependency-free SVG force-directed graph (`KorelateGraph`), and an "Advanced Raw JSON" editing mode.
*   **AI Chat Widget**: Fixed infinite loop approvals, restored real-time generation streaming, and harmonized the widget's `z-index` across all fullscreen dashboards.
*   **HMI Management**: Added direct "Import" and "Export" capabilities to the HMI Dashboard view to seamlessly manage SVGs and JS bindings.

### 🛠️ Important Bugfixes

*   Fixed a critical logic flaw where the AI agent loop would prematurely halt during tool execution.
*   Fixed a payload parsing bug where numeric and boolean metrics nested inside JSON arrays were silently ignored.
*   Resolved an Express/`path-to-regexp` startup crash related to unnamed wildcard splats.
*   Fixed cross-view state synchronization ensuring selected topics persist when navigating between tabs.

---

### 📦 Updating Instructions

If you are using Docker Compose, simply pull the latest image and restart your containers:

```bash
docker pull slalaure/korelate:latest
docker-compose up -d
```