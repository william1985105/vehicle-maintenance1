#!/bin/bash

# Cloudflare Pages 部署脚本

set -e

echo "🚀 开始部署到 Cloudflare Pages..."

# 检查必要的工具
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI 未安装，正在安装..."
    npm install -g wrangler
fi

# 检查是否已登录
if ! wrangler whoami &> /dev/null; then
    echo "🔐 请先登录 Cloudflare..."
    wrangler login
fi

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
rm -rf dist

# 安装依赖
echo "📦 安装依赖..."
npm ci

# 构建应用
echo "🔨 构建应用..."
npm run build

# 检查构建结果
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

echo "📊 构建统计:"
du -sh dist/*

# 部署到 Cloudflare Pages
echo "🌐 部署到 Cloudflare Pages..."
wrangler pages publish dist --project-name=vehicle-maintenance

echo "✅ 部署完成！"
echo "🔗 您的应用将在几分钟内在以下地址可用:"
echo "   https://vehicle-maintenance.pages.dev"

# 可选：打开浏览器
if command -v open &> /dev/null; then
    echo "🌐 正在打开浏览器..."
    open "https://vehicle-maintenance.pages.dev"
elif command -v xdg-open &> /dev/null; then
    echo "🌐 正在打开浏览器..."
    xdg-open "https://vehicle-maintenance.pages.dev"
fi