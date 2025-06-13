"use client"

import { useState } from "react"
import { Code, Eye, Save, Copy, Download, FileText, ImageIcon, Play, Volume2 } from "lucide-react"

interface FileViewerProps {
  file: {
    id: string
    name: string
    type: string
    size: string
  }
}

export default function FileViewer({ file }: FileViewerProps) {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit")
  const [content, setContent] = useState(getFileContent(file))

  function getFileContent(file: any) {
    // 模拟不同文件类型的内容
    switch (file.type) {
      case "vue":
        return `<template>
  <div class="header">
    <h1>{{ title }}</h1>
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('我的网站')
</script>

<style scoped>
.header {
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

h1 {
  margin: 0;
  color: #333;
}

nav {
  margin-top: 1rem;
}

nav a {
  margin-right: 1rem;
  text-decoration: none;
  color: #007bff;
}
</style>`

      case "javascript":
        return `// 工具函数库
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}`

      case "json":
        return `{
  "name": "my-vue-project",
  "version": "1.0.0",
  "description": "一个Vue.js项目",
  "main": "src/main.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.3.0",
    "eslint": "^8.39.0"
  }
}`

      case "markdown":
        return `# 项目说明

这是一个基于Vue 3的现代化Web应用程序。

## 特性

- ⚡️ Vue 3 + Vite - 快速的开发体验
- 🎨 现代化的UI设计
- 📱 响应式布局
- 🔧 TypeScript支持
- 📦 组件化开发

## 快速开始

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
\`\`\`

## 项目结构

\`\`\`
src/
├── components/     # 组件
├── views/         # 页面
├── utils/         # 工具函数
├── assets/        # 静态资源
└── main.js        # 入口文件
\`\`\`

## 贡献

欢迎提交Issue和Pull Request！`

      case "html":
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的Vue应用</title>
    <link rel="icon" href="/favicon.ico">
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
</body>
</html>`

      default:
        return `// ${file.name}
// 文件类型: ${file.type}
// 大小: ${file.size}

这是一个示例文件内容。
您可以在这里编辑文件内容。`
    }
  }

  const renderFileContent = () => {
    if (file.type === "image") {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">图片预览</p>
            <p className="text-sm text-gray-500">{file.name}</p>
            <p className="text-sm text-gray-500">{file.size}</p>
          </div>
        </div>
      )
    }

    if (file.type === "video") {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">视频文件</p>
            <p className="text-sm text-gray-500">{file.name}</p>
            <p className="text-sm text-gray-500">{file.size}</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">播放视频</button>
          </div>
        </div>
      )
    }

    if (file.type === "audio") {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <Volume2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">音频文件</p>
            <p className="text-sm text-gray-500">{file.name}</p>
            <p className="text-sm text-gray-500">{file.size}</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">播放音频</button>
          </div>
        </div>
      )
    }

    // 文本文件编辑器
    return (
      <div className="h-full flex flex-col">
        <div className="border-b bg-gray-50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("edit")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "edit" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Code className="w-4 h-4 inline mr-1" />
              编辑
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === "preview" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              预览
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-200 rounded">
              <Copy className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded">
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {viewMode === "edit" ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none"
              placeholder="在这里编辑文件内容..."
            />
          ) : (
            <div className="h-full overflow-auto">
              {file.type === "markdown" ? (
                <div className="p-4 prose max-w-none">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">{content}</pre>
                </div>
              ) : (
                <pre className="p-4 font-mono text-sm whitespace-pre-wrap">{content}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 文件标签栏 */}
      <div className="border-b bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-800">{file.name}</span>
          <span className="text-xs text-gray-500">({file.size})</span>
        </div>
      </div>

      {/* 文件内容 */}
      <div className="flex-1 overflow-hidden">{renderFileContent()}</div>
    </div>
  )
}
