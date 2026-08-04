# 🚨 Smart Disaster Response & Resource Allocation Platform

An enterprise-grade, cloud-native platform engineered to revolutionize disaster management through real-time communication, advanced routing algorithms, and dynamic resource allocation.

## 🌟 Key Features
- **Real-Time SOS & Tracking:** Powered by `Socket.IO` and `Leaflet.js`, providing live location updates of victims and responders.
- **Dynamic Resource Allocation:** Custom-built Knapsack DP (Dynamic Programming) algorithm engine to maximize lives saved given constrained medical/rescue resources.
- **Advanced Graph Routing:** Dijkstra's algorithm integration to instantly calculate the fastest path for ambulances while avoiding mathematically "blocked" flooded roads.
- **Trie Search Engine:** Custom `O(L)` autocomplete engine for instantly querying cities, relief camps, and hospitals.
- **Cloud-Native Scalability:** Fully Dockerized with Kubernetes manifests, featuring Horizontal Pod Autoscalers (HPA) and NGINX Ingress load balancing.
- **OWASP Security:** Hardened Node.js backend using `helmet`, rate-limiting, NoSQL injection sanitization, and XSS prevention.

## 🏗️ Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS, React-Leaflet, Chart.js
- **Backend:** Node.js, Express.js, Socket.IO, BullMQ
- **Databases:** MongoDB (GeoJSON spatial indexing), Redis (Caching, Pub/Sub, Priority Queues)
- **DevOps:** Docker, Kubernetes, Jenkins, GitHub Actions, NGINX
- **Observability:** Prometheus, Grafana

## 🚀 Quick Start (Docker Compose)
The easiest way to spin up the entire distributed system locally is via Docker Compose.

```bash
git clone https://github.com/username/disaster-response-platform.git
cd disaster-response-platform
docker-compose up -d --build
```
The application will instantly be available at `http://localhost`.

## 📚 Documentation Directory
Please explore the `docs/` directory for exhaustive technical documentation:
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Entity-Relationship Diagram](docs/ER_DIAGRAM.md)
- [Sequence Diagrams](docs/SEQUENCE_DIAGRAMS.md)
- [Kubernetes & Deployment Guide](docs/KUBERNETES.md)
- [API Reference](docs/API_DOCS.md)
