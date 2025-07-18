#!/bin/bash

# 数据备份脚本

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="vehicle_maintenance_backup_${TIMESTAMP}.tar.gz"

echo "📦 开始备份数据..."

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份容器数据（如果有持久化数据）
echo "💾 备份应用数据..."

# 创建备份文件
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='logs' \
    --exclude='.git' \
    .

echo "✅ 备份完成: ${BACKUP_DIR}/${BACKUP_FILE}"

# 清理旧备份（保留最近7天）
echo "🧹 清理旧备份..."
find $BACKUP_DIR -name "vehicle_maintenance_backup_*.tar.gz" -mtime +7 -delete

echo "🎉 备份任务完成！"