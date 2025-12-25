<div align="center">

# ✂️ SpiltMeme

**优雅的在线图片分割工具**

将任意图片按网格裁切，一键打包导出

[![Vue](https://img.shields.io/badge/Vue-3.4+-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[在线演示](#) · [功能特性](#-功能特性) · [快速开始](#-快速开始) · [使用说明](#-使用说明)

---

<img src="https://via.placeholder.com/800x450/1a1a2e/00d9a5?text=SpiltMeme+Preview" alt="SpiltMeme Preview" width="100%" />

</div>

## ✨ 功能特性

<table>
<tr>
<td width="50%">

### 🖼️ 智能上传
- 拖拽上传或点击选择
- 支持 PNG / JPG / WebP / GIF
- 实时显示图片信息

</td>
<td width="50%">

### ⊞ 灵活分割
- **均匀网格** - 按行列数平均分割
- **自定义尺寸** - 指定每块像素大小
- 实时预览分割效果

</td>
</tr>
<tr>
<td width="50%">

### 🎨 格式控制
- PNG 无损导出
- JPG / WebP 有损压缩
- 可调节压缩质量 (10%-100%)

</td>
<td width="50%">

### 📦 便捷导出
- 一键打包 ZIP 下载
- 单击任意切片独立下载
- 智能文件命名 (行-列.格式)

</td>
</tr>
</table>

## 🛠️ 技术栈

| 技术 | 说明 |
|:---:|:---|
| ![Vue](https://img.shields.io/badge/-Vue_3-4FC08D?style=flat-square&logo=vue.js&logoColor=white) | 渐进式 JavaScript 框架，使用 Composition API |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) | 类型安全的 JavaScript 超集 |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | 下一代前端构建工具 |
| ![Canvas](https://img.shields.io/badge/-Canvas_API-E34F26?style=flat-square&logo=html5&logoColor=white) | 原生图片处理与渲染 |
| ![JSZip](https://img.shields.io/badge/-JSZip-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | ZIP 文件生成与打包 |

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

打开浏览器访问 `http://localhost:5173`

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建产物位于 `dist/` 目录，可直接部署到任意静态服务器。

## 📖 使用说明

<table>
<tr>
<td align="center" width="25%">
<img src="https://via.placeholder.com/200x150/252542/00d9a5?text=Step+1" alt="Step 1" />
<br><b>1. 上传图片</b>
<br><sub>拖拽或点击上传</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/200x150/252542/00d9a5?text=Step+2" alt="Step 2" />
<br><b>2. 配置参数</b>
<br><sub>选择分割模式</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/200x150/252542/00d9a5?text=Step+3" alt="Step 3" />
<br><b>3. 预览效果</b>
<br><sub>实时查看网格</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/200x150/252542/00d9a5?text=Step+4" alt="Step 4" />
<br><b>4. 导出下载</b>
<br><sub>ZIP 打包下载</sub>
</td>
</tr>
</table>

### 分割模式说明

#### 均匀网格模式 (Uniform Grid)

将图片按指定的行数和列数均匀分割。

| 参数 | 范围 | 说明 |
|:---:|:---:|:---|
| 行数 (Rows) | 1-50 | 垂直方向分割数量 |
| 列数 (Columns) | 1-50 | 水平方向分割数量 |

**示例**: 3行 × 4列 = 12 个切片

#### 自定义尺寸模式 (Custom Size)

按指定的像素尺寸分割，边缘不足部分保留原尺寸。

| 参数 | 范围 | 说明 |
|:---:|:---:|:---|
| 宽度 (Width) | ≥10px | 每块切片的宽度 |
| 高度 (Height) | ≥10px | 每块切片的高度 |

**示例**: 100×100px 切片尺寸

## 📁 项目结构

```
SpiltMeme/
├── 📂 src/
│   ├── 📂 components/          # Vue 组件
│   │   ├── ImageUploader.vue   # 图片上传组件
│   │   ├── SplitPreview.vue    # 分割预览组件
│   │   ├── SettingsPanel.vue   # 设置面板组件
│   │   └── ExportPanel.vue     # 导出面板组件
│   │
│   ├── 📂 composables/         # 组合式函数
│   │   ├── useImageSplitter.ts # 图片分割逻辑
│   │   └── useExporter.ts      # 导出打包逻辑
│   │
│   ├── 📂 utils/               # 工具函数
│   │   └── canvas.ts           # Canvas 相关工具
│   │
│   ├── 📂 types/               # TypeScript 类型
│   │   └── index.ts            # 类型定义
│   │
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── style.css               # 全局样式
│
├── 📂 public/                  # 静态资源
├── index.html                  # HTML 模板
├── vite.config.ts              # Vite 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 项目配置
```

## 🎨 界面预览

<div align="center">

| 暗色主题 | 功能展示 |
|:---:|:---:|
| ![Dark Theme](https://via.placeholder.com/400x300/1a1a2e/00d9a5?text=Dark+Theme) | ![Features](https://via.placeholder.com/400x300/1a1a2e/00d9a5?text=Features) |

</div>

## 🔧 配置说明

### 导出格式对比

| 格式 | 特点 | 适用场景 |
|:---:|:---|:---|
| **PNG** | 无损压缩，支持透明 | 需要透明背景、高质量图片 |
| **JPG** | 有损压缩，体积小 | 照片、不需要透明的图片 |
| **WebP** | 优秀压缩率，现代格式 | 网页展示、平衡质量与体积 |

### 质量设置 (JPG/WebP)

- **100%**: 最高质量，文件较大
- **80%**: 推荐设置，质量与体积平衡
- **60%**: 较小体积，轻微质量损失
- **30%**: 最小体积，明显质量损失

## 📝 开发计划

- [x] 基础图片上传功能
- [x] 均匀网格分割
- [x] 自定义尺寸分割
- [x] Canvas 实时预览
- [x] ZIP 打包导出
- [x] 多格式支持
- [ ] 图片旋转/翻转
- [ ] 批量处理多张图片
- [ ] 本地历史记录
- [ ] PWA 离线支持

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐ Star！**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
