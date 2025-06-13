<template>
  <div class="directory-tree">
    <div class="tree-header">
      <h2 class="tree-title">
        <BuildingIcon />
        组织架构与设备
      </h2>
      
      <!-- 状态说明 -->
      <div class="status-legend">
        <div class="status-item">
          <div class="status-dot online"></div>
          <span>在线</span>
        </div>
        <div class="status-item">
          <div class="status-dot offline"></div>
          <span>离线</span>
        </div>
        <div class="status-item">
          <div class="status-dot alert"></div>
          <span>告警</span>
        </div>
        <div class="status-item">
          <div class="status-dot normal"></div>
          <span>正常</span>
        </div>
      </div>
    </div>

    <div class="tree-content">
      <TreeNode
        v-for="item in treeData"
        :key="item.id"
        :node="item"
        :level="0"
        :selected-node="selectedNode"
        :expanded-nodes="expandedNodes"
        @toggle="toggleNode"
        @select="selectNode"
        @show-menu="showDropdownMenu"
        @drag-start="handleDragStart"
        @drag-end="handleDragEnd"
        @drag-over="handleDragOver"
        @drag-leave="handleDragLeave"
        @drop="handleDrop"
      />
    </div>

    <!-- 下拉菜单 -->
    <div
      v-if="dropdownMenu.show"
      class="dropdown-menu"
      :style="{ top: dropdownMenu.y + 'px', left: dropdownMenu.x + 'px' }"
      @click.stop
    >
      <div
        v-for="action in getMenuActions(dropdownMenu.node)"
        :key="action.label"
        class="menu-item"
        @click="handleMenuAction(action, dropdownMenu.node)"
      >
        <component :is="action.icon" />
        {{ action.label }}
      </div>
    </div>

    <!-- 遮罩层 -->
    <div
      v-if="dropdownMenu.show"
      class="menu-overlay"
      @click="hideDropdownMenu"
    ></div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import TreeNode from './TreeNode.vue'

// 图标组件
const BuildingIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h4"/><path d="M6 16h4"/><path d="M16 12h2"/><path d="M16 16h2"/><path d="M14 22v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4"/></svg>'
}

const FolderPlusIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><line x1="12" x2="12" y1="10" y2="16"/><line x1="9" x2="15" y1="13" y2="13"/></svg>'
}

const PlusIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>'
}

const EditIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'
}

const CopyIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
}

const TrashIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>'
}

const SettingsIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>'
}

const EyeIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
}

const MonitorIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>'
}

export default {
  name: 'DirectoryTree',
  components: {
    TreeNode,
    BuildingIcon,
    FolderPlusIcon,
    PlusIcon,
    EditIcon,
    CopyIcon,
    TrashIcon,
    SettingsIcon,
    EyeIcon,
    MonitorIcon
  },
  props: {
    onNodeSelect: Function,
    onNodeAction: Function
  },
  setup(props) {
    // 树形数据
    const treeData = ref([
      {
        id: 100,
        label: "南京万宏",
        category: "ZONE",
        product: null,
        disabled: false,
        children: [
          {
            id: 101,
            label: "深圳总公司",
            category: "ZONE",
            product: null,
            disabled: false,
            children: [
              {
                id: 103,
                label: "研发部门",
                category: "ZONE",
                product: null,
                disabled: false,
                children: [
                  {
                    id: 201,
                    label: "服务器-01",
                    category: "DEVICE",
                    product: "SERVER",
                    disabled: false,
                    status: { online: true, alert: false }
                  },
                  {
                    id: 202,
                    label: "工作站-01",
                    category: "DEVICE",
                    product: "WORKSTATION",
                    disabled: false,
                    status: { online: true, alert: true }
                  },
                  {
                    id: 203,
                    label: "网络摄像头-01",
                    category: "DEVICE",
                    product: "CAMERA",
                    disabled: false,
                    status: { online: false, alert: false }
                  }
                ]
              },
              {
                id: 104,
                label: "市场部门",
                category: "ZONE",
                product: null,
                disabled: false,
                children: [
                  {
                    id: 204,
                    label: "打印机-01",
                    category: "DEVICE",
                    product: "PRINTER",
                    disabled: false,
                    status: { online: true, alert: false }
                  },
                  {
                    id: 205,
                    label: "路由器-01",
                    category: "DEVICE",
                    product: "ROUTER",
                    disabled: false,
                    status: { online: true, alert: true }
                  }
                ]
              }
            ]
          },
          {
            id: 102,
            label: "长沙分公司",
            category: "ZONE",
            product: null,
            disabled: false,
            children: [
              {
                id: 108,
                label: "市场部门",
                category: "ZONE",
                product: null,
                disabled: false,
                children: [
                  {
                    id: 211,
                    label: "办公电脑-01",
                    category: "DEVICE",
                    product: "WORKSTATION",
                    disabled: false,
                    status: { online: true, alert: false }
                  }
                ]
              }
            ]
          }
        ]
      }
    ])

    // 状态管理
    const selectedNode = ref(null)
    const expandedNodes = ref(new Set([100, 101]))
    const dropdownMenu = reactive({
      show: false,
      x: 0,
      y: 0,
      node: null
    })

    // 状态更新定时器
    let statusInterval = null

    // 模拟设备状态变化
    const updateDeviceStatus = () => {
      const updateNodeStatus = (nodes) => {
        nodes.forEach(node => {
          if (node.category === 'DEVICE' && node.status && Math.random() < 0.15) {
            if (Math.random() < 0.3) {
              node.status.online = !node.status.online
            }
            if (Math.random() < 0.2) {
              node.status.alert = !node.status.alert
            }
          }
          if (node.children) {
            updateNodeStatus(node.children)
          }
        })
      }
      updateNodeStatus(treeData.value)
    }

    // 切换节点展开/收起
    const toggleNode = (nodeId) => {
      if (expandedNodes.value.has(nodeId)) {
        expandedNodes.value.delete(nodeId)
      } else {
        expandedNodes.value.add(nodeId)
      }
    }

    // 选择节点
    const selectNode = (node) => {
      selectedNode.value = node
      props.onNodeSelect?.(node)
    }

    // 显示下拉菜单
    const showDropdownMenu = (event, node) => {
      event.stopPropagation()
      const rect = event.target.getBoundingClientRect()
      dropdownMenu.show = true
      dropdownMenu.x = rect.left - 160
      dropdownMenu.y = rect.bottom + 4
      dropdownMenu.node = node
    }

    // 隐藏下拉菜单
    const hideDropdownMenu = () => {
      dropdownMenu.show = false
      dropdownMenu.node = null
    }

    // 获取菜单选项
    const getMenuActions = (node) => {
      if (!node) return []

      if (node.category === 'ZONE') {
        return [
          { label: '添加子区域', icon: 'FolderPlusIcon', action: 'add-zone' },
          { label: '添加设备', icon: 'PlusIcon', action: 'add-device' },
          { label: '重命名', icon: 'EditIcon', action: 'rename' },
          { label: '复制', icon: 'CopyIcon', action: 'copy' },
          { label: '删除', icon: 'TrashIcon', action: 'delete' }
        ]
      } else {
        const commonActions = [
          { label: '设备配置', icon: 'SettingsIcon', action: 'configure' },
          { label: '重命名', icon: 'EditIcon', action: 'rename' },
          { label: '复制', icon: 'CopyIcon', action: 'copy' },
          { label: '删除', icon: 'TrashIcon', action: 'delete' }
        ]

        if (node.product === 'CAMERA') {
          return [
            { label: '查看监控', icon: 'EyeIcon', action: 'view-monitor' },
            ...commonActions
          ]
        } else if (node.product === 'SERVER') {
          return [
            { label: '远程连接', icon: 'MonitorIcon', action: 'remote-connect' },
            { label: '查看日志', icon: 'EyeIcon', action: 'view-logs' },
            ...commonActions
          ]
        }

        return commonActions
      }
    }

    // 处理菜单操作
    const handleMenuAction = (action, node) => {
      props.onNodeAction?.(action.action, node)
      hideDropdownMenu()
    }

    // 拖拽处理
    const handleDragStart = (node) => {
      console.log('拖拽开始:', node.label)
    }

    const handleDragEnd = (node) => {
      console.log('拖拽结束:', node.label)
    }

    const handleDragOver = (event, node) => {
      event.preventDefault()
    }

    const handleDragLeave = (event, node) => {
      // 处理拖拽离开
    }

    const handleDrop = (event, targetNode, draggedNode) => {
      event.preventDefault()
      
      if (targetNode.category !== 'ZONE') return
      if (draggedNode.id === targetNode.id) return

      console.log(`移动 ${draggedNode.label} 到 ${targetNode.label}`)
    }

    // 生命周期
    onMounted(() => {
      statusInterval = setInterval(updateDeviceStatus, 4000)
    })

    onUnmounted(() => {
      if (statusInterval) {
        clearInterval(statusInterval)
      }
    })

    return {
      treeData,
      selectedNode,
      expandedNodes,
      dropdownMenu,
      toggleNode,
      selectNode,
      showDropdownMenu,
      hideDropdownMenu,
      getMenuActions,
      handleMenuAction,
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
.directory-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.tree-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px 0;
}

.status-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background-color: #10b981;
  animation: pulse 2s infinite;
}

.status-dot.offline {
  background-color: #9ca3af;
}

.status-dot.alert {
  background-color: #ef4444;
  animation: pulse 2s infinite;
}

.status-dot.normal {
  background-color: #9ca3af;
}

.tree-content {
  flex: 1;
  padding: 8px;
  overflow: auto;
}

.dropdown-menu {
  position: fixed;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  z-index: 50;
  min-width: 160px;
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.menu-item:hover {
  background-color: #f3f4f6;
}

.menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
}

/* 滚动条样式 */
.tree-content::-webkit-scrollbar {
  width: 6px;
}

.tree-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.tree-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.tree-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
