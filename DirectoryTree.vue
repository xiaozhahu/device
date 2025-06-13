<template>
  <div class="directory-tree bg-gray-50 h-screen p-4">
    <div class="bg-white rounded-lg shadow-sm border h-full">
      <div class="p-4 border-b bg-gray-50 rounded-t-lg">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FolderOpen class="w-5 h-5" />
          项目目录
        </h2>
      </div>
      
      <div class="p-2 overflow-auto h-full">
        <TreeNode
          v-for="item in treeData"
          :key="item.id"
          :node="item"
          :level="0"
          @toggle="toggleNode"
          @select="selectNode"
          @drag-start="handleDragStart"
          @drag-over="handleDragOver"
          @drop="handleDrop"
          @show-menu="showDropdownMenu"
        />
      </div>
    </div>

    <!-- 下拉菜单 -->
    <div
      v-if="dropdownMenu.show"
      :style="{ top: dropdownMenu.y + 'px', left: dropdownMenu.x + 'px' }"
      class="fixed bg-white border rounded-lg shadow-lg py-1 z-50 min-w-40"
      @click.stop
    >
      <div
        v-for="action in getMenuActions(dropdownMenu.node)"
        :key="action.label"
        class="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm text-gray-700"
        @click="handleMenuAction(action, dropdownMenu.node)"
      >
        <component :is="action.icon" class="w-4 h-4" />
        {{ action.label }}
      </div>
    </div>

    <!-- 遮罩层用于关闭下拉菜单 -->
    <div
      v-if="dropdownMenu.show"
      class="fixed inset-0 z-40"
      @click="hideDropdownMenu"
    ></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  FolderOpen,
  Folder,
  File,
  FileText,
  Code,
  Image,
  Music,
  Video,
  Archive,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Plus,
  FolderPlus,
  Edit,
  Trash2,
  Copy,
  Cut,
  Download,
  Share,
  Eye,
  Play,
  FileCode
} from 'lucide-vue-next'

// 树形数据
const treeData = ref([
  {
    id: '1',
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        expanded: false,
        children: [
          { id: '3', name: 'Header.vue', type: 'vue', size: '2.1KB' },
          { id: '4', name: 'Footer.vue', type: 'vue', size: '1.8KB' }
        ]
      },
      {
        id: '5',
        name: 'views',
        type: 'folder',
        expanded: true,
        children: [
          { id: '6', name: 'Home.vue', type: 'vue', size: '3.2KB' },
          { id: '7', name: 'About.vue', type: 'vue', size: '1.5KB' }
        ]
      },
      { id: '8', name: 'main.js', type: 'javascript', size: '0.8KB' },
      { id: '9', name: 'App.vue', type: 'vue', size: '2.5KB' }
    ]
  },
  {
    id: '10',
    name: 'public',
    type: 'folder',
    expanded: false,
    children: [
      { id: '11', name: 'index.html', type: 'html', size: '1.2KB' },
      { id: '12', name: 'favicon.ico', type: 'image', size: '4.1KB' },
      {
        id: '13',
        name: 'assets',
        type: 'folder',
        expanded: false,
        children: [
          { id: '14', name: 'logo.png', type: 'image', size: '15.3KB' },
          { id: '15', name: 'background.jpg', type: 'image', size: '234KB' }
        ]
      }
    ]
  },
  { id: '16', name: 'package.json', type: 'json', size: '1.1KB' },
  { id: '17', name: 'README.md', type: 'markdown', size: '2.3KB' },
  { id: '18', name: 'vite.config.js', type: 'javascript', size: '0.6KB' }
])

// 选中的节点
const selectedNode = ref(null)

// 拖拽相关
const draggedNode = ref(null)

// 下拉菜单
const dropdownMenu = reactive({
  show: false,
  x: 0,
  y: 0,
  node: null
})

// 获取文件类型图标
const getFileIcon = (type) => {
  const iconMap = {
    folder: Folder,
    vue: Code,
    javascript: Code,
    html: FileText,
    css: FileText,
    json: FileText,
    markdown: FileText,
    image: Image,
    audio: Music,
    video: Video,
    archive: Archive,
    default: File
  }
  return iconMap[type] || iconMap.default
}

// 获取文件类型颜色
const getFileColor = (type) => {
  const colorMap = {
    folder: 'text-blue-600',
    vue: 'text-green-600',
    javascript: 'text-yellow-600',
    html: 'text-orange-600',
    css: 'text-purple-600',
    json: 'text-gray-600',
    markdown: 'text-blue-500',
    image: 'text-pink-600',
    audio: 'text-indigo-600',
    video: 'text-red-600',
    archive: 'text-brown-600',
    default: 'text-gray-500'
  }
  return colorMap[type] || colorMap.default
}

// 切换节点展开/收起
const toggleNode = (nodeId) => {
  const toggleNodeRecursive = (nodes) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        node.expanded = !node.expanded
        return true
      }
      if (node.children && toggleNodeRecursive(node.children)) {
        return true
      }
    }
    return false
  }
  toggleNodeRecursive(treeData.value)
}

// 选择节点
const selectNode = (node) => {
  selectedNode.value = node
}

// 拖拽开始
const handleDragStart = (node) => {
  draggedNode.value = node
}

// 拖拽悬停
const handleDragOver = (event) => {
  event.preventDefault()
}

// 拖拽放置
const handleDrop = (targetNode) => {
  if (!draggedNode.value || draggedNode.value.id === targetNode.id) {
    return
  }

  console.log('移动节点:', draggedNode.value.name, '到', targetNode.name)
  draggedNode.value = null
}

// 显示下拉菜单
const showDropdownMenu = (event, node) => {
  event.stopPropagation()
  dropdownMenu.show = true
  
  // 计算菜单位置
  const rect = event.target.getBoundingClientRect()
  dropdownMenu.x = rect.left - 160 // 菜单宽度约160px，向左偏移
  dropdownMenu.y = rect.bottom + 4
  dropdownMenu.node = node
}

// 隐藏下拉菜单
const hideDropdownMenu = () => {
  dropdownMenu.show = false
  dropdownMenu.node = null
}

// 获取菜单选项（根据文件类型不同）
const getMenuActions = (node) => {
  if (node?.type === 'folder') {
    // 文件夹菜单
    return [
      { label: '新建文件', icon: Plus, action: 'new-file' },
      { label: '新建文件夹', icon: FolderPlus, action: 'new-folder' },
      { label: '重命名', icon: Edit, action: 'rename' },
      { label: '复制', icon: Copy, action: 'copy' },
      { label: '剪切', icon: Cut, action: 'cut' },
      { label: '删除', icon: Trash2, action: 'delete' }
    ]
  } else {
    // 文件菜单（根据文件类型有所不同）
    const commonActions = [
      { label: '重命名', icon: Edit, action: 'rename' },
      { label: '复制', icon: Copy, action: 'copy' },
      { label: '剪切', icon: Cut, action: 'cut' },
      { label: '删除', icon: Trash2, action: 'delete' },
      { label: '下载', icon: Download, action: 'download' }
    ]

    // 根据文件类型添加特定操作
    if (node.type === 'image') {
      return [
        { label: '预览', icon: Eye, action: 'preview' },
        ...commonActions
      ]
    } else if (node.type === 'video' || node.type === 'audio') {
      return [
        { label: '播放', icon: Play, action: 'play' },
        ...commonActions
      ]
    } else if (['vue', 'javascript', 'html', 'css', 'json', 'markdown'].includes(node.type)) {
      return [
        { label: '编辑', icon: FileCode, action: 'edit' },
        { label: '预览', icon: Eye, action: 'preview' },
        ...commonActions
      ]
    }

    return commonActions
  }
}

// 处理菜单操作
const handleMenuAction = (action, node) => {
  console.log('执行操作:', action.action, '节点:', node.name)
  
  switch (action.action) {
    case 'new-file':
      console.log('在文件夹中新建文件')
      break
    case 'new-folder':
      console.log('在文件夹中新建文件夹')
      break
    case 'edit':
      console.log('编辑文件')
      break
    case 'preview':
      console.log('预览文件')
      break
    case 'play':
      console.log('播放媒体文件')
      break
    case 'rename':
      console.log('重命名')
      break
    case 'copy':
      console.log('复制')
      break
    case 'cut':
      console.log('剪切')
      break
    case 'delete':
      console.log('删除')
      break
    case 'download':
      console.log('下载')
      break
  }
  
  hideDropdownMenu()
}

// 树节点组件
const TreeNode = {
  name: 'TreeNode',
  props: {
    node: Object,
    level: Number
  },
  emits: ['toggle', 'select', 'drag-start', 'drag-over', 'drop', 'show-menu'],
  setup(props, { emit }) {
    const isSelected = computed(() => selectedNode.value?.id === props.node.id)
    const isHovered = ref(false)
    
    return {
      isSelected,
      isHovered,
      getFileIcon,
      getFileColor,
      ChevronRight,
      ChevronDown,
      MoreHorizontal
    }
  },
  template: `
    <div>
      <div
        :class="[
          'flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-100 transition-colors group',
          { 'bg-blue-100 border-l-2 border-blue-500': isSelected }
        ]"
        :style="{ paddingLeft: (level * 20 + 8) + 'px' }"
        draggable="true"
        @click="$emit('select', node)"
        @dblclick="node.type === 'folder' && $emit('toggle', node.id)"
        @dragstart="$emit('drag-start', node)"
        @dragover="$emit('drag-over', $event)"
        @drop="$emit('drop', node)"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <!-- 展开/收起图标 -->
        <div class="w-4 h-4 flex items-center justify-center">
          <ChevronDown
            v-if="node.type === 'folder' && node.expanded"
            class="w-3 h-3 text-gray-500"
          />
          <ChevronRight
            v-else-if="node.type === 'folder'"
            class="w-3 h-3 text-gray-500"
          />
        </div>
        
        <!-- 文件/文件夹图标 -->
        <component
          :is="getFileIcon(node.type)"
          :class="['w-4 h-4', getFileColor(node.type)]"
        />
        
        <!-- 名称 -->
        <span class="text-sm text-gray-800 flex-1 truncate">{{ node.name }}</span>
        
        <!-- 文件大小 -->
        <span v-if="node.size" class="text-xs text-gray-500 mr-2">{{ node.size }}</span>
        
        <!-- 更多操作按钮 -->
        <button
          :class="[
            'w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors',
            { 'opacity-100': isHovered || isSelected, 'opacity-0': !isHovered && !isSelected }
          ]"
          @click="$emit('show-menu', $event, node)"
        >
          <MoreHorizontal class="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
      <!-- 子节点 -->
      <template v-if="node.children && node.expanded">
        <TreeNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :level="level + 1"
          @toggle="$emit('toggle', $arguments[0])"
          @select="$emit('select', $arguments[0])"
          @drag-start="$emit('drag-start', $arguments[0])"
          @drag-over="$emit('drag-over', $arguments[0])"
          @drop="$emit('drop', $arguments[0])"
          @show-menu="$emit('show-menu', $arguments[0], $arguments[1])"
        />
      </template>
    </div>
  `
}
</script>

<style scoped>
.directory-tree {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 拖拽时的样式 */
[draggable="true"]:hover {
  opacity: 0.8;
}

/* 滚动条样式 */
.overflow-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 更多按钮的过渡效果 */
.group:not(:hover) button {
  transition: opacity 0.2s ease-in-out;
}
</style>
