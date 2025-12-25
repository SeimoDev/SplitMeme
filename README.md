<div align="center">

# ✂️ SpiltMeme

### 现代化图片分割工具

一款优雅的在线图片裁切工具，支持自定义网格分割，一键打包导出

[![Vue](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[在线演示](#) · [功能特性](#-功能特性) · [快速开始](#-快速开始) · [使用指南](#-使用指南)

---

<img src="https://via.placeholder.com/800x450/1a1a2e/00d9a5?text=SpiltMeme+Preview" alt="SpiltMeme Preview" width="100%" />

</div>

## ✨ 功能特性

<table>
<tr>
<td width="50%">

### 🖼️ 智能上传
- 拖拽上传，即拖即用
- 点击浏览，快速选择
- 支持 PNG / JPG / WebP / GIF
- 实时显示图片信息

</td>
<td width="50%">

### ⊞ 灵活分割
- **均匀网格**：按行列数平均分割
- **自定义尺寸**：按像素大小分割
- 实时预览分割效果
- 显示每块预计尺寸

</td>
</tr>
<tr>
<td width="50%">

### 📦 便捷导出
- 一键打包 ZIP 下载
- 单独下载任意切片
- 智能文件命名规则
- 进度实时反馈

</td>
<td width="50%">

### 🎨 多格式支持
- PNG（无损，支持透明）
- JPG（有损压缩）
- WebP（现代格式）
- 可调节压缩质量

</td>
</tr>
</table>

## 🛠️ 技术栈

| 技术 | 说明 |
|:-----|:-----|
| ![Vue](https://img.shields.io/badge/-Vue_3-4FC08D?style=flat-square&logo=vue.js&logoColor=white) | 渐进式 JavaScript 框架，使用 Composition API |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 类型安全的 JavaScript 超集 |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | 下一代前端构建工具 |
| ![Canvas](https://img.shields.io/badge/-Canvas_API-E34F26?style=flat-square&logo=html5&logoColor=white) | 原生图像处理能力 |
| ![JSZip](https://img.shields.io/badge/-JSZip-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | 前端 ZIP 文件生成 |

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- npm 或 yarn 或 pnpm

### 安装步骤

```bash
# 克隆项目
git clone https://github.com/yourusername/SpiltMeme.git

# 进入目录
cd SpiltMeme

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可使用

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

构建产物位于 `dist/` 目录，可部署到任意静态托管服务

## 📖 使用指南

### 1️⃣ 上传图片

将图片拖拽到上传区域，或点击选择文件

<img src="https://via.placeholder.com/600x300/252542/00d9a5?text=Step+1:+Upload" alt="Upload" width="100%" />

### 2️⃣ 配置分割参数

选择分割模式并设置参数：

| 模式 | 说明 | 示例 |
|:-----|:-----|:-----|
| 均匀网格 | 按行列数分割 | 3行 × 4列 = 12块 |
| 自定义尺寸 | 按像素大小分割 | 100×100px 每块 |

<img src="https://via.placeholder.com/600x300/252542/00d9a5?text=Step+2:+Configure" alt="Configure" width="100%" />

### 3️⃣ 预览与导出

- 点击 **Split Image** 执行分割
- 点击 **Download ZIP** 下载全部
- 点击单个切片可单独下载

<img src="https://via.placeholder.com/600x300/252542/00d9a5?text=Step+3:+Export" alt="Export" width="100%" />

## 📁 项目结构

```
SpiltMeme/
├── 📂 src/
│   ├── 📂 components/          # Vue 组件
│   │   ├── ImageUploader.vue   # 图片上传组件
│   │   ├── SplitPreview.vue    # Canvas 预览组件
│   │   ├── SettingsPanel.vue   # 设置面板组件
│   │   └── ExportPanel.vue     # 导出面板组件
│   │
│   ├── 📂 composables/         # 组合式函数
│   │   ├── useImageSplitter.ts # 图片分割逻辑
│   │   └── useExporter.ts      # ZIP 导出逻辑
│   │
│   ├── 📂 utils/               # 工具函数
│   │   └── canvas.ts           # Canvas 辅助函数
│   │
│   ├── 📂 types/               # 类型定义
│   │   └── index.ts            # TypeScript 接口
│   │
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── style.css               # 全局样式
│
├── 📄 index.html               # HTML 模板
├── 📄 package.json             # 项目配置
├── 📄 tsconfig.json            # TS 配置
├── 📄 vite.config.ts           # Vite 配置
└── 📄 README.md                # 项目文档
```

## 🎨 界面预览

<div align="center">

| 暗色主题 | 分割预览 |
|:--------:|:--------:|
| <img src="https://via.placeholder.com/400x250/1a1a2e/00d9a5?text=Dark+Theme" width="100%" /> | <img src="https://via.placeholder.com/400x250/1a1a2e/00d9a5?text=Grid+Preview" width="100%" /> |

| 设置面板 | 导出结果 |
|:--------:|:--------:|
| <img src="https://via.placeholder.com/400x250/1a1a2e/00d9a5?text=Settings" width="100%" /> | <img src="https://via.placeholder.com/400x250/1a1a2e/00d9a5?text=Results" width="100%" /> |

</div>

## 🔧 配置说明

### 导出格式对比

| 格式 | 特点 | 适用场景 |
|:-----|:-----|:---------|
| **PNG** | 无损压缩，支持透明 | 需要透明背景、高质量要求 |
| **JPG** | 有损压缩，体积小 | 照片、不需要透明 |
| **WebP** | 现代格式，压缩率高 | Web 展示、兼容性允许时 |

### 质量参数

- 仅对 JPG 和 WebP 生效
- 范围：10% ~ 100%
- 推荐：80% ~ 90%（平衡质量与体积）

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
