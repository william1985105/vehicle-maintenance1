# Cloudflare Pages 部署指南

本文档介绍如何将车辆保养记录系统部署到 Cloudflare Pages。

## 快速开始

### 方法一：通过 Git 仓库部署（推荐）

1. **准备 Git 仓库**
   ```bash
   # 初始化 Git 仓库
   git init
   git add .
   git commit -m "Initial commit"
   
   # 推送到 GitHub/GitLab
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **连接到 Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 "Pages" 部分
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 授权并选择您的仓库

3. **配置构建设置**
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

4. **环境变量（如需要）**
   - 在 Pages 项目设置中添加环境变量
   - 例如：`NODE_ENV=production`

### 方法二：直接上传部署

1. **本地构建**
   ```bash
   npm install
   npm run build
   ```

2. **上传到 Cloudflare Pages**
   - 在 Cloudflare Dashboard 中创建新项目
   - 选择 "Upload assets"
   - 将 `dist` 文件夹拖拽上传

### 方法三：使用 Wrangler CLI

1. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **创建 Pages 项目**
   ```bash
   wrangler pages project create vehicle-maintenance
   ```

4. **部署**
   ```bash
   npm run build
   wrangler pages publish dist --project-name=vehicle-maintenance
   ```

## 配置文件

### wrangler.toml
```toml
name = "vehicle-maintenance"
compatibility_date = "2024-01-01"

[env.production]
name = "vehicle-maintenance"

[[env.production.routes]]
pattern = "your-domain.com/*"
zone_name = "your-domain.com"
```

### _redirects 文件
创建 `public/_redirects` 文件以支持 SPA 路由：
```
/*    /index.html   200
```

### _headers 文件
创建 `public/_headers` 文件以设置安全头：
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;
```

## 自动部署设置

### GitHub Actions
创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Cloudflare Pages
      uses: cloudflare/pages-action@v1
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
        projectName: vehicle-maintenance
        directory: dist
        gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## 自定义域名

1. **添加自定义域名**
   - 在 Pages 项目设置中点击 "Custom domains"
   - 添加您的域名
   - 按照提示配置 DNS 记录

2. **SSL/TLS 设置**
   - Cloudflare 自动提供免费 SSL 证书
   - 在 SSL/TLS 设置中选择 "Full (strict)" 模式

## 性能优化

### 缓存配置
在 Cloudflare Dashboard 中配置缓存规则：
- 静态资源（JS、CSS、图片）：缓存 1 年
- HTML 文件：缓存 1 小时
- API 响应：根据需要配置

### 压缩设置
- 启用 Brotli 压缩
- 启用 Gzip 压缩
- 启用 Auto Minify（HTML、CSS、JS）

## 环境变量管理

在 Cloudflare Pages 项目设置中添加环境变量：
```
NODE_ENV=production
VITE_APP_VERSION=1.0.0
```

## 监控和分析

### Web Analytics
- 在 Cloudflare Dashboard 中启用 Web Analytics
- 获取详细的访问统计和性能指标

### 错误监控
```javascript
// 在应用中添加错误监控
window.addEventListener('error', (event) => {
  // 发送错误信息到监控服务
  console.error('Application error:', event.error);
});
```

## 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查 Node.js 版本
   node --version
   
   # 清理缓存
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **路由问题**
   - 确保 `_redirects` 文件正确配置
   - 检查 SPA 路由设置

3. **静态资源加载失败**
   - 检查 `vite.config.ts` 中的 base 配置
   - 确保资源路径正确

### 调试命令
```bash
# 本地预览构建结果
npm run preview

# 检查构建输出
ls -la dist/

# 测试 Wrangler 部署
wrangler pages dev dist
```

## 安全最佳实践

1. **启用安全功能**
   - Bot Fight Mode
   - DDoS Protection
   - WAF (Web Application Firewall)

2. **访问控制**
   - 配置 IP 白名单（如需要）
   - 设置地理位置限制（如需要）

3. **HTTPS 强制**
   - 启用 "Always Use HTTPS"
   - 配置 HSTS 头

## 成本优化

- Cloudflare Pages 提供慷慨的免费额度
- 监控使用量避免超出限制
- 优化资源大小减少带宽使用

## 备份和恢复

1. **代码备份**
   - 使用 Git 版本控制
   - 定期推送到远程仓库

2. **配置备份**
   - 导出 Cloudflare 配置
   - 记录重要设置

## 支持和文档

- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [社区支持](https://community.cloudflare.com/)

---

通过以上步骤，您可以成功将车辆保养记录系统部署到 Cloudflare Pages，享受全球 CDN 加速和高可用性服务。