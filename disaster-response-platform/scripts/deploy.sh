#!/bin/bash
# Smart Disaster Response Platform - AWS EC2 Provisioning Script
# Run this on a fresh Ubuntu 22.04 LTS instance

set -e

echo "Starting deployment process..."

# 1. Update System
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Docker
echo "Installing Docker..."
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-compose

# Start and enable Docker
sudo systemctl enable docker
sudo systemctl start docker

# Add current user to docker group (requires logout/login to take effect)
sudo usermod -aG docker $USER

# 3. Configure UFW Firewall
echo "Configuring Firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# 4. Install Certbot for SSL
echo "Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# 5. Start Application
echo "Starting Application via Docker Compose..."
# Pulling the latest changes if running from a repo, or just starting if copied
if [ -f "docker-compose.yml" ]; then
    sudo docker-compose pull
    sudo docker-compose up -d --build
else
    echo "Warning: docker-compose.yml not found in current directory. Please navigate to the project root and run 'docker-compose up -d'."
fi

echo "Deployment complete! Application is now running."
echo "Note: If you want to configure SSL, ensure your domain points to this EC2 instance and run: sudo certbot --nginx -d yourdomain.com"
