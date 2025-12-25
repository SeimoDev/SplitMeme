# SpiltMeme - Image Splitter Tool

A modern web-based image splitting tool built with Vue 3 + TypeScript + Vite.

![SpiltMeme Preview](https://via.placeholder.com/800x400/1a1a2e/00d9a5?text=SpiltMeme)

## Features

- 🖼️ **Drag & Drop Upload** - Simply drag your image or click to browse
- ⊞ **Uniform Grid Split** - Split by rows and columns
- ⊟ **Custom Size Split** - Split by custom pixel dimensions  
- 📐 **Live Preview** - See split grid overlay in real-time
- 📦 **ZIP Export** - Download all parts as a single ZIP file
- 🎨 **Multiple Formats** - Export as PNG, JPG, or WebP
- 🔧 **Quality Control** - Adjust compression for JPG/WebP
- 📱 **Responsive Design** - Works on desktop and mobile

## Supported Image Formats

- PNG
- JPEG / JPG
- WebP
- GIF

## Tech Stack

- **Framework**: Vue 3.4+ with Composition API
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Styling**: CSS Variables (Custom Properties)
- **Image Processing**: Canvas API
- **ZIP Generation**: JSZip

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SpiltMeme.git
cd SpiltMeme

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Upload Image**: Drag and drop an image onto the upload zone, or click to browse
2. **Configure Split**:
   - Choose between **Uniform Grid** (rows × columns) or **Custom Size** (width × height in pixels)
   - Select export format (PNG, JPG, WebP)
   - Adjust quality for lossy formats
3. **Preview**: See the split grid overlay on your image
4. **Split**: Click "Split Image" to process
5. **Export**: Download individual parts or all parts as a ZIP file

## Project Structure

```
src/
├── components/
│   ├── ImageUploader.vue    # Drag & drop image upload
│   ├── SplitPreview.vue     # Canvas grid preview
│   ├── SettingsPanel.vue    # Split configuration
│   └── ExportPanel.vue      # Export controls & results
├── composables/
│   ├── useImageSplitter.ts  # Image splitting logic
│   └── useExporter.ts       # ZIP export logic
├── utils/
│   └── canvas.ts            # Canvas utility functions
├── types/
│   └── index.ts             # TypeScript interfaces
├── App.vue                  # Main application
├── main.ts                  # Entry point
└── style.css                # Global styles
```

## License

MIT License - feel free to use this project for any purpose.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
