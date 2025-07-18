# Docker 部署指南

本文档介绍如何使用 Docker 部署车辆保养记录系统。

## 快速开始

### 1. 生产环境部署

```bash
# 克隆项目
git clone <repository-url>
cd vehicle-maintenance-system

# 使用部署脚本（推荐）
chmod +x scripts/deploy.sh
./scripts/deploy.sh

# 或手动部署
docker-compose up -d
```

访问地址：http://localhost:3000

### 2. 开发环境

```bash
# 启动开发环境
docker-compose -f docker-compose.dev.yml up -d
```

访问地址：http://localhost:5173

## 配置说明

### 环境变量

在 `docker-compose.yml` 中可以配置以下环境变量：

- `NODE_ENV`: 运行环境（production/development）

### 端口配置

- 生产环境：3000 端口
- 开发环境：5173 端口

可以在 `docker-compose.yml` 中修改端口映射：

```yaml
ports:
  - "8080:80"  # 将应用映射到8080端口
```

### 数据持久化

应用数据存储在浏览器的 localStorage 中，无需额外的数据库配置。

如需备份数据，可以：

1. 导出浏览器数据
2. 使用备份脚本：`./scripts/backup.sh`

## 常用命令

### 查看服务状态

```bash
docker-compose ps
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs vehicle-maintenance

# 实时查看日志
docker-compose logs -f
```

### 重启服务

```bash
docker-compose restart
```

### 停止服务

```bash
docker-compose down
```

### 更新应用

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 高级配置

### 使用反向代理

如果需要 HTTPS 或多域名支持，可以启用反向代理：

```bash
# 启用代理配置
docker-compose --profile proxy up -d
```

### 自定义 Nginx 配置

编辑 `nginx.conf` 文件来自定义 Nginx 配置：

- 修改缓存策略
- 添加安全头
- 配置 SSL
- 设置访问控制

### 健康检查

系统包含健康检查端点：`/health`

可以通过以下方式检查服务状态：

```bash
curl http://localhost:3000/health
```

### 监控和日志

日志文件位置：
- Nginx 访问日志：`./logs/nginx/access.log`
- Nginx 错误日志：`./logs/nginx/error.log`

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   lsof -i :3000
   
   # 修改docker-compose.yml中的端口映射
   ```

2. **容器启动失败**
   ```bash
   # 查看详细日志
   docker-compose logs vehicle-maintenance
   
   # 检查容器状态
   docker-compose ps
   ```

3. **构建失败**
   ```bash
   # 清理Docker缓存
   docker system prune -a
   
   # 重新构建
   docker-compose build --no-cache
   ```

### 性能优化

1. **启用 Gzip 压缩**（已默认启用）
2. **配置静态资源缓存**（已默认配置）
3. **使用 CDN**（可选）

### 安全建议

1. **定期更新基础镜像**
2. **使用非 root 用户运行**
3. **配置防火墙规则**
4. **启用 HTTPS**
5. **定期备份数据**

## 生产环境建议

1. **使用环境变量管理敏感信息**
2. **配置日志轮转**
3. **设置监控和告警**
4. **定期备份**
5. **使用 Docker Swarm 或 Kubernetes 进行集群部署**

## 支持

如有问题，请查看：
1. 应用日志
2. Docker 日志
3. 系统资源使用情况

或联系技术支持。