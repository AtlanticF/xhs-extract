# xhs-extract / 小红书解析服务

[🇨🇳 简体中文](#简体中文说明) | [🇬🇧 English](#english-description)

---

## <a id="简体中文说明">🇨🇳 简体中文说明</a>

### 项目简介
本项目基于 Node.js + Puppeteer + Docker，提供小红书内容解析与签名服务，支持容器化部署，适合自动化采集与接口调用。

### 功能特性
- 自动获取小红书笔记详情
- 支持签名服务接口
- 支持 Docker 一键部署
- 兼容 ARM/AMD 架构

### 快速开始
1. 克隆项目
   ```bash
   git clone <your-repo-url>
   cd xhs-guess-service
   ```
2. Docker 构建与运行
   ```bash
   docker-compose up --build
   ```
3. 访问服务
   - 解析服务: `http://localhost:3000/api/xhs/note`
   - 签名服务: `http://sign_service:3001/api/xhs/sign`

### 依赖
- Node.js 22.x
- Puppeteer-extra & Stealth plugin
- Express
- Docker & docker-compose

### 目录结构
```
├── Dockerfile
├── docker-compose.yml
├── package.json
├── parse_xhs.js         # 小红书解析主服务
├── sign_service.js      # 签名服务
├── stealth.min.js       # Puppeteer Stealth 插件
```

### License
本项目采用 GNU General Public License v3.0 (GPL-3.0) 开源协议。

### 免责声明
本项目仅供学习与研究使用，严禁用于任何违反中国及使用者所在国家/地区法律法规的用途。因使用本项目产生的任何后果，均由使用者自行承担，作者不承担任何法律责任。

---

## <a id="english-description">🇬🇧 English Description</a>

### Introduction
This project is a Node.js + Puppeteer + Docker based service for extracting and signing content from Xiaohongshu (RED), supporting containerized deployment for automation and API usage.

### Features
- Automatically fetch Xiaohongshu note details
- Signature service API
- Docker one-click deployment
- Compatible with ARM/AMD architectures

### Quick Start
1. Clone the repo
   ```bash
   git clone <your-repo-url>
   cd xhs-guess-service
   ```
2. Docker build & run
   ```bash
   docker-compose up --build
   ```
3. Access the service
   - Extract service: `http://localhost:3000/api/xhs/note`
   - Signature service: `http://sign_service:3001/api/xhs/sign`

### Dependencies
- Node.js 22.x
- Puppeteer-extra & Stealth plugin
- Express
- Docker & docker-compose

### Directory Structure
```
├── Dockerfile
├── docker-compose.yml
├── package.json
├── parse_xhs.js         # Main extract service
├── sign_service.js      # Signature service
├── stealth.min.js       # Puppeteer Stealth plugin
```

### License
This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

### Disclaimer
This project is for educational and research purposes only. Any illegal use is strictly prohibited. The author assumes no responsibility for any consequences arising from the use of this project.
