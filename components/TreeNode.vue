<template>
  <div>
    <div
      class="tree-node"
      :class="{
        'selected': isSelected,
        'drag-over': isDragOver,
        'disabled': node.disabled
      }"
      :style="{ paddingLeft: (level * 20 + 8) + 'px' }"
      :draggable="!node.disabled"
      @click="!node.disabled && $emit('select', node)"
      @dblclick="!node.disabled && hasChildren && $emit('toggle', node.id)"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <!-- 展开/收起图标 -->
      <div class="expand-icon">
        <ChevronDownIcon v-if="hasChildren && isExpanded" />
        <ChevronRightIcon v-else-if="hasChildren" />
      </div>

      <!-- 节点图标 -->
      <component :is="getNodeIcon()" class="node-icon" :class="getNodeColor()" />

      <!-- 节点名称 -->
      <span class="node-label">{{ node.label }}</span>

      <!-- 设备状态指示器 -->
      <StatusIndicator
        v-if="node.category === 'DEVICE' && node.status"
        :status="node.status"
      />

      <!-- 操作菜单按钮 -->
      <button
        v-if="!node.disabled"
        class="menu-button"
        :class="{ 'visible': isHovered || isSelected }"
        @click="$emit('show-menu', $event, node)"
      >
        <MoreHorizontalIcon />
      </button>
    </div>

    <!-- 子节点 -->
    <template v-if="hasChildren && isExpanded">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :selected-node="selectedNode"
        :expanded-nodes="expandedNodes"
        @toggle="$emit('toggle', $arguments[0])"
        @select="$emit('select', $arguments[0])"
        @show-menu="$emit('show-menu', $arguments[0], $arguments[1])"
        @drag-start="$emit('drag-start', $arguments[0])"
        @drag-end="$emit('drag-end', $arguments[0])"
        @drag-over="$emit('drag-over', $arguments[0], $arguments[1])"
        @drag-leave="$emit('drag-leave', $arguments[0], $arguments[1])"
        @drop="$emit('drop', $arguments[0], $arguments[1], $arguments[2])"
      />
    </template>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import StatusIndicator from './StatusIndicator.vue'

// 图标组件
const ChevronRightIcon = {
  template: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>'
}

const ChevronDownIcon = {
  template: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>'
}

const MoreHorizontalIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>'
}

const FolderIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>'
}

const FolderOpenIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>'
}

const ServerIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>'
}

const MonitorIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>'
}

const RouterIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="8" x="3" y="3" rx="2"/><path d="M12 8v13"/><path d="M8 21h8"/></svg>'
}

const CameraIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>'
}

const PrinterIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>'
}

const SmartphoneIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>'
}

const HardDriveIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>'
}

const CpuIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>'
}

export default {
  name: 'TreeNode',
  components: {
    StatusIndicator,
    ChevronRightIcon,
    ChevronDownIcon,
    MoreHorizontalIcon,
    FolderIcon,
    FolderOpenIcon,
    ServerIcon,
    MonitorIcon,
    RouterIcon,
    CameraIcon,
    PrinterIcon,
    SmartphoneIcon,
    HardDriveIcon,
    CpuIcon
  },
  props: {
    node: Object,
    level: Number,
    selectedNode: Object,
    expandedNodes: Set
  },
  emits: [
    'toggle',
    'select',
    'show-menu',
    'drag-start',
    'drag-end',
    'drag-over',
    'drag-leave',
    'drop'
  ],
  setup(props, { emit }) {
    const isHovered = ref(false)
    const isDragOver = ref(false)

    const isSelected = computed(() => props.selectedNode?.id === props.node.id)
    const isExpanded = computed(() => props.expandedNodes.has(props.node.id))
    const hasChildren = computed(() => props.node.children && props.node.children.length > 0)

    // 根据设备类型获取图标
    const getNodeIcon = () => {
      if (props.node.category === 'ZONE') {
        return hasChildren.value && isExpanded.value ? 'FolderOpenIcon' : 'FolderIcon'
      }

      const iconMap = {
        SERVER: 'ServerIcon',
        WORKSTATION: 'MonitorIcon',
        ROUTER: 'RouterIcon',
        SWITCH: 'RouterIcon',
        CAMERA: 'CameraIcon',
        PRINTER: 'PrinterIcon',
        MOBILE: 'SmartphoneIcon',
        STORAGE: 'HardDriveIcon',
        default: 'CpuIcon'
      }
      return iconMap[props.node.product] || iconMap.default
    }

    // 根据类型获取颜色
    const getNodeColor = () => {
      if (props.node.category === 'ZONE') {
        return 'zone-color'
      }

      const colorMap = {
        SERVER: 'server-color',
        WORKSTATION: 'workstation-color',
        ROUTER: 'router-color',
        SWITCH: 'switch-color',
        CAMERA: 'camera-color',
        PRINTER: 'printer-color',
        MOBILE: 'mobile-color',
        STORAGE: 'storage-color',
        default: 'default-color'
      }
      return colorMap[props.node.product] || colorMap.default
    }

    // 拖拽处理
    const handleDragStart = (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(props.node))
      e.dataTransfer.effectAllowed = 'move'
      setTimeout(() => {
        e.target.style.opacity = '0.5'
      }, 0)
      emit('drag-start', props.node)
    }

    const handleDragEnd = (e) => {
      e.target.style.opacity = '1'
      emit('drag-end', props.node)
    }

    const handleDragOver = (e) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'

      if (props.node.category === 'ZONE') {
        isDragOver.value = true
      }
      emit('drag-over', e, props.node)
    }

    const handleDragLeave = (e) => {
      isDragOver.value = false
      emit('drag-leave', e, props.node)
    }

    const handleDrop = (e) => {
      e.preventDefault()
      isDragOver.value = false

      if (props.node.category !== 'ZONE') return

      try {
        const draggedNodeData = JSON.parse(e.dataTransfer.getData('text/plain'))
        if (draggedNodeData.id === props.node.id) return

        emit('drop', e, props.node, draggedNodeData)
      } catch (error) {
        console.error('拖拽处理失败:', error)
      }
    }

    return {
      isHovered,
      isDragOver,
      isSelected,
      isExpanded,
      hasChildren,
      getNodeIcon,
      getNodeColor,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDragLeave,
      handleDrop
    }
  }
}
</script>

<style scoped>
.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.tree-node:hover {
  background-color: #f3f4f6;
}

.tree-node.selected {
  background-color: #dbeafe;
  border-left: 2px solid #3b82f6;
}

.tree-node.drag-over {
  background-color: #dcfce7;
  border: 2px dashed #22c55e;
}

.tree-node.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.expand-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.node-icon {
  width: 16px;
  height: 16px;
}

.zone-color { color: #3b82f6; }
.server-color { color: #10b981; }
.workstation-color { color: #8b5cf6; }
.router-color { color: #f59e0b; }
.switch-color { color: #f97316; }
.camera-color { color: #ec4899; }
.printer-color { color: #6b7280; }
.mobile-color { color: #6366f1; }
.storage-color { color: #eab308; }
.default-color { color: #6b7280; }

.node-label {
  font-size: 14px;
  color: #1f2937;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
}

.menu-button:hover {
  background-color: #e5e7eb;
}

.menu-button.visible {
  opacity: 1;
}

[draggable="true"] {
  cursor: grab;
}

[draggable="true"]:active {
  cursor: grabbing;
}
</style>
