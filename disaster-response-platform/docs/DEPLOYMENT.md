# 🚀 Deployment Guide

## AWS EC2 Bare-Metal Deploy
If you are deploying to a standard Ubuntu EC2 instance, utilize the automated provisioning scripts.

1. Clone the repository onto the instance.
2. Run the deployment script:
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```
3. The script will automatically install Docker, open the UFW firewall, and spin up `docker-compose`.

## Automated Backups
To ensure data isn't lost, set up a cron job for the `backup.sh` script:
```bash
crontab -e
# Add the following line to run daily at 3:00 AM
0 3 * * * /opt/disaster-platform/scripts/backup.sh >> /var/log/mongo_backup.log 2>&1
```
