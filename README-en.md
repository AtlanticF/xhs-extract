# xhs-extract

[中文版说明](./README-zh_CN.md)

---

## Introduction
This project is a Node.js + Puppeteer + Docker based service for extracting and signing content from Xiaohongshu (RED), supporting containerized deployment for automation and API usage.

## Features
- Automatically fetch Xiaohongshu note details
- Signature service API
- Docker one-click deployment
- Compatible with ARM/AMD architectures

## Quick Start
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

## Dependencies
- Node.js 22.x
- Puppeteer-extra & Stealth plugin
- Express
- Docker & docker-compose

## Directory Structure
```
├── Dockerfile
├── docker-compose.yml
├── package.json
├── parse_xhs.js         # Main extract service
├── sign_service.js      # Signature service
├── stealth.min.js       # Puppeteer Stealth plugin
```

## License
This project is licensed under the GNU General Public License v3.0 (GPL-3.0).

## Disclaimer
This project is for educational and research purposes only. Any illegal use is strictly prohibited. The author assumes no responsibility for any consequences arising from the use of this project. 

## Project Reference

- [ReaJason/xhs](https://github.com/ReaJason/xhs)
- [JoeanAmier/XHS-Downloader](https://github.com/JoeanAmier/XHS-Downloader) 