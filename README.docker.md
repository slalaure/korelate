# Korelate

![Docker Image Version (latest by date)](https://img.shields.io/docker/v/slalaure/korelate?label=version)
![Docker Pulls](https://img.shields.io/docker/pulls/slalaure/korelate)
![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)

**The Open-Source Unified Namespace Explorer for the AI Era**

This image provides a self-contained, highly resilient, multi-protocol edge server that connects to your industrial and IT data sources, saves all events to an embedded DuckDB database, and broadcasts them via WebSocket to a real-time web frontend. Korelate bridges the gap between raw industrial data (OT) and contextualized intelligence (IT & AI).

## ✨ Key Features

* **Agnostic Data Providers:** Connect to diverse data sources simultaneously. Supports **MQTT, Modbus TCP, Siemens S7, EtherNet/IP, BACnet/IP, KNX/IP, SQL (Postgres/MySQL/MSSQL), REST APIs, SNMP, Kafka**, and Local Files.
* **I3X Protocol Support:** Full implementation of the Industrial Information Interface eXchange (RFC 001), enabling standardized contextualized data access and semantic graphing.
* **AI-Powered Semantic Modeling:** The built-in *Learning Studio* leverages DuckDB profiling and LLMs to automatically infer UNS hierarchies, object types, and relationships (ISA-95/Brick Schema) from raw telemetry.
* **HMI & 3D Digital Twins:** Animate 2D SVG diagrams, HTML views, and 3D `.glb` models using live data from your Unified Namespace.
* **Sparkplug B Support:** Automatically decodes Sparkplug B Protobuf payloads (`spBv1.0/`) for visualization via High-Performance Worker Threads.
* **Persistent History:** All messages are saved to an embedded, auto-pruning DuckDB database within the `data` volume.
* **Perennial Storage:** Optional dual-write to TimescaleDB, Azure Tables, DynamoDB, BigQuery, or AVEVA PI for long-term archiving.
* **ETL Mapper Engine:** Create real-time data transformations (e.g., "Modbus Register -> MQTT Topic") using sandboxed JavaScript.
* **Intelligent Alerting:** Define detection rules that trigger an Autonomous AI Agent to generate root-cause incident reports.
* **Advanced Charting:** Build, save, and share custom time-series charts using backend aggregation for massive datasets.
* **Agent Protocol (MCP):** Includes a Model Context Protocol server (`interfaces/mcp/mcpServer.mjs`) to allow external LLMs or agents (like Claude) to query and control the factory context.
* **Secure & Multi-Tenant:** Supports Local accounts, Google OAuth, and RBAC (Admin/User) to protect destructive actions.

---

## 🚀 How to Run (Recommended)

The best way to run Korelate is with `docker-compose`, as it correctly sets up the persistent data volume and the optional MCP server.

### 1. Create your `data` directory

This directory will store your configuration, database, user sessions, custom HMI files, and semantic models.

```sh
mkdir -p korelate-data/certs
cd korelate-data
```

### 2. Create a `docker-compose.yml`

In the directory above `korelate-data`, create this file:

```yml
version: '3.8'

services:
  korelate_app:
    image: slalaure/korelate:latest
    container_name: korelate_app
    restart: always
    ports:
      - "8080:8080" # Web application
    volumes:
      # Mount the data directory for persistence
      - ./korelate-data:/usr/src/app/data
    environment:
      - NODE_ENV=production
      - PORT=8080
      - BASE_PATH=/

  mcp:
    image: slalaure/korelate:latest
    container_name: korelate_mcp
    restart: always
    ports:
      - "3000:3000" # MCP server
    volumes:
      - ./korelate-data:/usr/src/app/data
    environment:
      - NODE_ENV=production
      - MCP_TRANSPORT=http
      - MCP_PORT=3000
      - MAIN_APP_HOST=korelate_app # Docker DNS name for the app service
      - PORT=8080
      - BASE_PATH=/
    command: node interfaces/mcp/mcpServer.mjs # Overrides the default command
    depends_on:
      - korelate_app
```

### 3. Run!

```sh
docker-compose up -d
```

On the first run, Korelate will automatically generate a `.env` file inside your `korelate-data` directory. You can easily configure your data providers (MQTT, Modbus, etc.) via the Web UI Wizard (`/config.html`) or by editing the `.env` file manually.

Access the web viewer at **`http://localhost:8080`**.

---

## 🔧 Complete Configuration Guide (`.env`)

All configuration is managed via the `.env` file located in your persistent `data` volume. 

### Data Providers & Connectivity
| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATA_PROVIDERS` | JSON array defining all multi-protocol connections (MQTT, OPC UA, Modbus, SQL, REST, etc.). Replaces the legacy `MQTT_BROKERS` array. | `[...]` |
| `SPARKPLUG_ENABLED` | Set to `true` to decode `spBv1.0/` Protobuf payloads. | `true` |
| `EXTERNAL_API_ENABLED` | Set to `true` to enable the external publish API at `/api/external/publish`. | `false` |
| `EXTERNAL_API_KEYS_FILE` | JSON filename in `/data` storing external API keys and their topic permissions. | `api_keys.json` |

### Database & Storage (DuckDB)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `DUCKDB_MAX_SIZE_MB` | Maximum local DB size before auto-pruning triggers. | `20` |
| `DUCKDB_PRUNE_CHUNK_SIZE` | Number of old messages to delete when size limit is reached. | `500` |
| `DB_INSERT_BATCH_SIZE` | Messages buffered in RAM before a bulk DB write. | `5000` |
| `DB_BATCH_INTERVAL_MS` | Flush interval in milliseconds for DB writes. | `2000` |

### Perennial Storage (TimescaleDB / PostgreSQL / Cloud)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PERENNIAL_DRIVER` | Driver for long-term data storage. Options: `none`, `timescale`, `azure_table`, `dynamodb`, `aveva_pi`, `bigquery`. | `none` |
| `PG_HOST` | Hostname for TimescaleDB/PostgreSQL. | `localhost` |
| `PG_PORT` | Port for TimescaleDB/PostgreSQL. | `5432` |
| `PG_USER` / `PG_PASSWORD` | Credentials for PostgreSQL. | `postgres` / `password` |
| `PG_DATABASE` / `PG_TABLE_NAME`| DB and Table name to write events to. | `korelate` / `korelate_events` |

*(Refer to `.env.example` in the repository for specific Cloud configurations like AWS DynamoDB or Azure Tables).*

### Authentication & Security
| Variable | Description | Default |
| :--- | :--- | :--- |
| `SESSION_SECRET` | **REQUIRED.** A strong secret key for signing user session cookies. | `dev_secret...` |
| `ADMIN_USERNAME` | Auto-provisions or updates an Administrator account on startup. | `admin` |
| `ADMIN_PASSWORD` | Password for the auto-provisioned Administrator. | `admin` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID to enable Google Sign-In. | (empty) |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret for Google Sign-In. | (empty) |
| `PUBLIC_URL` | Public URL of the app (required for Google OAuth redirects). | `http://localhost:8080` |

### AI / LLM Integration & MCP
| Variable | Description | Default |
| :--- | :--- | :--- |
| `LLM_API_URL` | OpenAI-compatible endpoint (Gemini, ChatGPT, or Local LM Studio). | `https://generativelanguage...` |
| `LLM_API_KEY` | API Key for the internal Chat Assistant and Alert Analyst. | (empty) |
| `LLM_MODEL` | Model string to use (e.g., `gemini-2.5-flash`, `gpt-4o`). | `gemini-2.5-flash` |
| `MCP_TRANSPORT` | Protocol for the MCP Server (`http` or `stdio`). | `http` |
| `MCP_PORT` | Port for the MCP Server HTTP transport. | `3000` |
| `MCP_API_KEY` | API Key for securing the `/mcp` HTTP endpoint. | (empty) |

*You can granularly control the AI's permissions using `LLM_TOOL_ENABLE_READ`, `LLM_TOOL_ENABLE_SEMANTIC`, `LLM_TOOL_ENABLE_PUBLISH`, `LLM_TOOL_ENABLE_FILES`, `LLM_TOOL_ENABLE_SIMULATOR`, `LLM_TOOL_ENABLE_MAPPER`, and `LLM_TOOL_ENABLE_ADMIN` (all default to `true`).*

### UI & Application Settings
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Internal port the Node.js server binds to. | `8080` |
| `BASE_PATH` | Base path for reverse proxy deployment (e.g., `/korelate`). | `/` |
| `SIMULATOR_ENABLED` | Set to `true` to enable built-in JavaScript data simulators. | `true` |
| `VIEW_*_ENABLED` | Toggles for specific UI tabs (Tree, HMI, History, Mapper, Chart, Publish, Chat, Alerts). | `true` |
| `HMI_FILE_PATH` | The default HTML or SVG file to load in the HMI tab (from `/data`). | `view.html` |
| `VIEW_CONFIG_ENABLED` | Enables the `/config.html` UI (Admins only). | `true` |

---

## 📄 License

This project is licensed under the Apache License, Version 2.0.
