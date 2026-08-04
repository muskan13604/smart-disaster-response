# ☸️ Kubernetes & Observability Guide

## 1. Cluster Deployment
All manifests are isolated in the `/k8s` directory. To deploy the entire distributed system to your cluster (Minikube, EKS, GKE):

```bash
kubectl apply -f k8s/
```

This will automatically create:
- Persistent Volumes (PVC) for MongoDB.
- Redis & Mongo Deployments.
- Node Backend Deployment (Replica: 3) & React Frontend.
- NGINX Ingress routes.

## 2. Horizontal Pod Autoscaling (HPA)
The system is configured to auto-scale the Node Backend if CPU spikes.
```bash
# Monitor the scaling metrics
kubectl get hpa backend-hpa --watch
```

## 3. Observability (Prometheus & Grafana)
The Node API exposes `http_request_duration_seconds` at `/metrics`.
Apply the `monitoring/prometheus.yml` to your cluster's Prometheus config to instantly begin scraping telemetry data. Use the provided `monitoring/grafana-dashboards.json` to visualize real-time API latency.
