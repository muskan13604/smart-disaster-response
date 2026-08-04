#!/bin/bash
# MongoDB automated backup script

set -e

BACKUP_DIR="/opt/disaster-platform/backups"
TIMESTAMP=$(date +"%F_%H-%M-%S")
BACKUP_NAME="disaster_db_$TIMESTAMP"
CONTAINER_NAME="disaster_mongo" # The container name in docker-compose.yml

mkdir -p $BACKUP_DIR

echo "Starting backup for MongoDB container: $CONTAINER_NAME..."

# Dump database from the docker container
docker exec $CONTAINER_NAME mongodump --archive=/tmp/$BACKUP_NAME.archive --db disaster

# Copy the archive to host
docker cp $CONTAINER_NAME:/tmp/$BACKUP_NAME.archive $BACKUP_DIR/$BACKUP_NAME.archive

# Remove archive from container to save space
docker exec $CONTAINER_NAME rm /tmp/$BACKUP_NAME.archive

# Compress the backup on the host
gzip $BACKUP_DIR/$BACKUP_NAME.archive

echo "Backup successful! Saved as $BACKUP_DIR/$BACKUP_NAME.archive.gz"

# Optional: Upload to AWS S3 (Uncomment and configure if aws-cli is installed)
# S3_BUCKET="s3://your-backup-bucket/disaster-platform/"
# echo "Uploading to S3..."
# aws s3 cp $BACKUP_DIR/$BACKUP_NAME.archive.gz $S3_BUCKET
# echo "Upload complete."

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -type f -name "*.gz" -mtime +7 -exec rm {} \;
echo "Old backups cleaned up."
