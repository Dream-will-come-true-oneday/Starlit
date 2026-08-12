# Starlit 部署指南

> 本指南供你（用户）自行完成部署。开发与代码已全部就绪，按下面步骤操作即可。

## 架构总览

```
浏览器 ──HTTPS──▶ 腾讯云 COS + CDN（前端静态资源 dist/）
        └───────▶ 轻量服务器（Nginx → FastAPI :8000，Docker 运行）
                        ├── PostgreSQL 16（docker-compose 内置）
                        └── 每日备份 pg_dump → COS
```

## 0. 准备清单（建议现在就开始）

| 项 | 说明 |
|:---|:---|
| 域名 | 注册一个域名（.com 约 ¥70/年） |
| ICP 备案 | 腾讯云国内托管必须备案，流程 1-2 周，**建议立即提交** |
| 腾讯云账号 | 开通对象存储 COS + 轻量应用服务器 |

## 1. 本地联调（可选，开发用）

```bash
# 前端
npm install
npm run dev              # http://localhost:5173

# 后端（Python 3.11+）
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
# 导出内容并导入数据库（先运行前端目录下的导出脚本）
cd ..
node scripts/export-content.mjs                     # 生成 backend/data/content-export.json
cd backend
python migrate_content.py                           # 导入 learning_items
uvicorn app.main:app --reload --port 8000           # http://localhost:8000/docs
```

## 2. 构建前端产物

```bash
npm run build          # 产出 dist/ 目录，部署到 COS/CDN
```

## 3. 部署后端（轻量服务器 2C2G 即可）

```bash
# 1. 服务器安装 Docker + Docker Compose
# 2. 上传 backend 目录到服务器（含 data/content-export.json）
cd backend

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env：SECRET_KEY 改成随机值，CORS_ORIGINS 改成你的前端域名

# 4. 启动（自动建表 + 导入内容 + 启动 API）
docker compose up -d --build

# 5. 验证
curl http://localhost:8000/api/health
# → {"status":"ok","service":"Starlit API"}
```

## 4. 配置 Nginx 反向代理 + HTTPS

```nginx
server {
    listen 443 ssl;
    server_name api.your-domain.com;

    ssl_certificate     /etc/ssl/your-domain.pem;
    ssl_certificate_key /etc/ssl/your-domain.key;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 5. 部署前端到 COS + CDN

1. 腾讯云控制台创建 COS 存储桶（公有读），把 `dist/` 全部上传
2. 绑定 CDN 加速域名，开启 HTTPS 证书
3. 配置 CDN 回源 COS，缓存规则：静态资源长缓存

## 6. 数据备份（每日自动）

服务器 crontab 添加：

```cron
# 每天 3:00 备份数据库并上传 COS（保留 30 天由 COS 生命周期规则控制）
0 3 * * * docker exec starlit-db pg_dump -U starlit starlit > /backup/starlit-$(date +\%F).sql
0 3 * * * coscmd upload /backup/starlit-$(date +\%F).sql starlit-backup/  # 需安装 coscmd 并配置
```

COS 桶设置生命周期规则：`starlit-backup/` 前缀 30 天后过期删除。

## 7. 上线自检清单

- [ ] 域名备案通过，HTTPS 证书生效
- [ ] 前端可访问，能注册 / 登录
- [ ] API 健康检查通过，CORS 正常（前端能跨域请求）
- [ ] 内容已导入（GET /api/items?type=word&level=1 有数据）
- [ ] 手机 + 电脑双端登录，打卡数据能同步
- [ ] 备份 cron 已生效，恢复演练过一次

## 8. 常见问题

**Q: 前端登录后数据不同步？**
A: 检查 CORS_ORIGINS 是否包含前端域名；同步接口 POST /api/progress/sync 需带 Authorization: Bearer <token>。

**Q: 如何更新学习内容？**
A: 修改前端 src/data/ 下数据 → `node scripts/export-content.mjs` → 上传 backend/data/ → `docker exec starlit-api python migrate_content.py` → 重启 API。

**Q: SECRET_KEY 泄露了？**
A: 立即更换 .env 的 SECRET_KEY 并重启容器，所有旧 token 会失效（用户需重新登录）。

## 9. 前端接入后端（登录 + 数据同步）

前端已封装好 API 客户端与同步引擎（`src/api/client.js`、`src/api/sync.js`），部署后只需两步接入：

1. **配置 API 地址**：打开 `src/api/client.js`，把 `baseURL` 改成你的后端域名
   ```js
   this.baseURL = 'https://api.your-domain.com'
   ```

2. **在关键位置调用同步**（`src/api/sync.js` 提供三个函数）：
   ```js
   import { fullSync, syncLocalToCloud } from '../api/sync.js'

   // 登录成功后：拉取云端 + 推送本地（合并双端数据）
   await fullSync()

   // 每次学习/打卡后：把本地进度推送到云端
   syncLocalToCloud()
   ```

3. **登录界面**：MVP 阶段前端尚未内置登录页，可选择：
   - 先用 Swagger（`https://api.your-domain.com/docs`）注册账号拿 token，手动写入 localStorage（key: `starlit:authToken`）
   - 或让我补一个登录页组件（登录/注册/同步状态提示）

数据流：本地操作 → localStorage（离线可用）→ 联网时 `syncLocalToCloud()` 上传 → 换设备 `fullSync()` 拉取合并。
