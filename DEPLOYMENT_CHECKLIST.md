# AtlasOS Deployment Checklist

## Pre-Deployment

### Infrastructure
- [ ] Kubernetes cluster provisioned (EKS, AKS, GKE, or on-prem)
- [ ] Storage classes configured (PersistentVolumes)
- [ ] Load balancer provisioned
- [ ] Ingress controller installed
- [ ] Monitoring stack ready (Prometheus/Grafana)

### Database
- [ ] PostgreSQL 15+ deployed
- [ ] TimescaleDB extension enabled
- [ ] Replication configured
- [ ] Automated backups enabled
- [ ] Restore procedure tested

### Cache & Message Queue
- [ ] Redis 7+ deployed with persistence
- [ ] RDB snapshots configured
- [ ] Kafka cluster deployed (or RabbitMQ)
- [ ] Topic configuration complete

### Storage
- [ ] S3 bucket created and configured
- [ ] IAM roles and policies set up
- [ ] Encryption at rest enabled
- [ ] Versioning enabled
- [ ] Lifecycle policies configured

### Security
- [ ] TLS certificates generated
- [ ] SSL/TLS configured on all endpoints
- [ ] Secrets management system deployed (Vault)
- [ ] API key generation system ready
- [ ] OAuth2/OIDC provider configured

---

## Kubernetes Deployment

### Pre-Deployment
- [ ] Docker images pushed to registry
- [ ] Image pull secrets configured
- [ ] Namespace created
- [ ] Resource limits defined
- [ ] Network policies configured

### Deploy AtlasOS
```bash
# Add Helm repository
helm repo add atlases https://charts.atlases.io
helm repo update

# Install AtlasOS
helm install atlas atlases/atlas \
  --namespace atlas \
  --create-namespace \
  --values values-prod.yaml

# Verify deployment
kubectl get pods -n atlas
kubectl get svc -n atlas
```

### Post-Deployment Checks
- [ ] All pods are running (`kubectl get pods`)
- [ ] Services are accessible (`kubectl get svc`)
- [ ] Database migrations complete
- [ ] Health checks passing (`curl /health`)
- [ ] Logs are normal (`kubectl logs`)

---

## AWS Deployment

### Terraform Deployment
```bash
cd packages/infra/terraform

# Initialize
terraform init

# Plan
terraform plan -out=prod.tfplan

# Apply
terraform apply prod.tfplan
```

### AWS Resources Created
- [ ] VPC and subnets
- [ ] EKS cluster
- [ ] RDS PostgreSQL instance
- [ ] ElastiCache Redis cluster
- [ ] S3 buckets
- [ ] ECR repositories
- [ ] Security groups and IAM roles

### Post-Deployment
- [ ] DNS configured
- [ ] SSL certificates deployed
- [ ] Auto-scaling policies configured
- [ ] Backups automated
- [ ] Monitoring enabled

---

## Application Configuration

### Environment Variables
- [ ] `DATABASE_URL` set correctly
- [ ] `REDIS_URL` configured
- [ ] `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` configured
- [ ] `QDRANT_URL` set
- [ ] `KAFKA_BROKERS` configured
- [ ] `JWT_SECRET` generated and secured
- [ ] `OPENAI_API_KEY` configured (if using OpenAI)
- [ ] `ANTHROPIC_API_KEY` configured (if using Anthropic)

### Database
```bash
# Run migrations
npm run db:migrate

# Verify schema
psql -U atlas -d atlas -c "\dt"
```

### API Keys & Credentials
- [ ] Admin user created
- [ ] API keys generated
- [ ] OAuth2 client credentials set up
- [ ] Service account keys generated
- [ ] Secrets stored in Vault

---

## Monitoring & Observability

### Prometheus
- [ ] Prometheus deployed
- [ ] Scrape configs configured
- [ ] Retention policy set
- [ ] Backup strategy configured

### Grafana
- [ ] Grafana deployed
- [ ] Prometheus data source added
- [ ] Dashboards created
- [ ] Alerts configured
- [ ] SSL/TLS enabled

### Logging
- [ ] ELK stack deployed (or CloudWatch)
- [ ] Log aggregation configured
- [ ] Log retention policy set
- [ ] Alerts configured

### Distributed Tracing (Optional)
- [ ] Jaeger deployed
- [ ] OpenTelemetry SDK integrated
- [ ] Trace sampling configured

---

## Security Hardening

### Network Security
- [ ] Network policies configured
- [ ] Firewall rules set up
- [ ] WAF (Web Application Firewall) enabled
- [ ] DDoS protection enabled

### Access Control
- [ ] RBAC fully configured
- [ ] Service accounts created
- [ ] Pod security policies enforced
- [ ] Network segmentation implemented

### Data Security
- [ ] Encryption at rest enabled
- [ ] Encryption in transit (TLS 1.3)
- [ ] Database encryption enabled
- [ ] PII handling policies enforced

### Audit & Compliance
- [ ] Audit logging enabled
- [ ] Compliance reports configured
- [ ] Data retention policies set
- [ ] GDPR/HIPAA compliance verified

---

## High Availability & Disaster Recovery

### HA Setup
- [ ] Multiple replicas configured
- [ ] Pod disruption budgets set
- [ ] Node affinity configured
- [ ] Multi-zone deployment

### Backup & Restore
- [ ] Daily backups automated
- [ ] Backup retention policy set
- [ ] Restore procedure documented
- [ ] Restore tested monthly

### Disaster Recovery
- [ ] DR plan documented
- [ ] RTO/RPO defined and achieved
- [ ] Failover procedure tested
- [ ] Multi-region setup (optional)

---

## Performance Tuning

### Database
- [ ] Connection pooling configured
- [ ] Query optimization completed
- [ ] Indexes analyzed
- [ ] Statistics updated

### Cache
- [ ] Cache TTL optimized
- [ ] Memory allocation adjusted
- [ ] Eviction policy configured

### Application
- [ ] Request timeouts configured
- [ ] Rate limiting enabled
- [ ] Connection limits set
- [ ] Resource limits adjusted

---

## Testing

### Integration Tests
```bash
npm run test:integration
```
- [ ] Database connectivity tests pass
- [ ] API endpoint tests pass
- [ ] Authentication tests pass
- [ ] Data ingestion tests pass

### Load Tests
```bash
npm run test:load
```
- [ ] 1,000 req/s sustained
- [ ] P95 latency < 500ms
- [ ] Error rate < 0.1%

### Security Tests
```bash
npm run test:security
```
- [ ] SQL injection tests pass
- [ ] XSS tests pass
- [ ] CSRF tests pass
- [ ] Authentication bypass tests pass

---

## Monitoring & Alerting

### Key Metrics
- [ ] Request latency (p50, p95, p99)
- [ ] Error rate (4xx, 5xx)
- [ ] Database connection pool usage
- [ ] Cache hit rate
- [ ] Memory usage
- [ ] CPU usage
- [ ] Disk I/O

### Alerts Configured
- [ ] High error rate (> 1%)
- [ ] Database down
- [ ] Redis down
- [ ] Disk usage > 80%
- [ ] Memory usage > 80%
- [ ] API latency > 1s

### Incident Response
- [ ] On-call schedule configured
- [ ] Incident response playbook written
- [ ] Communication channels set up
- [ ] Post-mortem process defined

---

## Documentation

- [ ] Deployment guide written
- [ ] Architecture diagram updated
- [ ] API documentation updated
- [ ] Runbook for common operations
- [ ] Troubleshooting guide
- [ ] Disaster recovery procedure

---

## Go-Live

### Final Checks
- [ ] All checklist items completed
- [ ] Load tests passed
- [ ] Security tests passed
- [ ] Backup/restore tested
- [ ] Monitoring verified
- [ ] Alerts tested

### Communication
- [ ] Stakeholders notified
- [ ] Maintenance window scheduled
- [ ] User documentation ready
- [ ] Training completed

### Deployment
- [ ] Code reviewed and approved
- [ ] Feature flags configured
- [ ] Gradual rollout planned
- [ ] Rollback procedure ready

### Post-Deployment
- [ ] System health verified
- [ ] User acceptance testing
- [ ] Performance baseline established
- [ ] Incident response team briefed

---

## Success Criteria

- ✅ System uptime: 99.9%
- ✅ API latency p95: < 500ms
- ✅ Database response time: < 100ms
- ✅ Error rate: < 0.1%
- ✅ All health checks passing
- ✅ Monitoring and alerting working
- ✅ Backups automated and tested
- ✅ Security audit passed
- ✅ Documentation complete
- ✅ Team trained on operations

---

## Sign-Off

- [ ] Technical Lead Approval: ___________  Date: _______
- [ ] DevOps Lead Approval: ___________  Date: _______
- [ ] Security Lead Approval: ___________  Date: _______
- [ ] Product Owner Approval: ___________  Date: _______

---

**Deployment completed on**: ____________
**Deployed by**: ____________
**Approved by**: ____________
