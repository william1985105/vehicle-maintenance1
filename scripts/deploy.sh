#!/bin/bash

# 车辆保养记录系统部署脚本

set -e

echo "🚀 开始部署车辆保养记录系统..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

# 检查docker-compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose未安装，请先安装docker-compose"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p logs/nginx
mkdir -p proxy/ssl

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down

# 构建新镜像
echo "🔨 构建新镜像..."
docker-compose build --no-cache

# 启动服务
echo "▶️ 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 健康检查
echo "🏥 执行健康检查..."
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ 服务部署成功！"
    echo "🌐 访问地址: http://localhost:3000"
else
    echo "❌ 服务启动失败，请检查日志"
    docker-compose logs
    exit 1
fi

echo "🎉 部署完成！"