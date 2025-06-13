<template>
  <div class="app-container" @dragstart="handleGlobalDragStart" @dragend="handleGlobalDragEnd">
    <!-- 拖拽提示 -->
    <div v-if="isDragging" class="drag-hint">
      <div class="drag-hint-content">
        <div class="drag-pulse"></div>
        拖拽设备到目标区域
      </div>
    </div>

    <!-- 顶部工具栏 -->
    <header class="app-header">
      <div class="header-left">
        <button @click="sidebarCollapsed = !sidebarCollapsed" class="sidebar-toggle">
          <BuildingIcon />
        </button>
        <h1 class="app-title">设备管理系统</h1>
      </div>

      <!-- 状态统计 -->
      <div class="status-stats">
        <div class="stat-item online">
          <WifiIcon />
          <span>设备在线</span>
        </div>
        <div class="stat-item alert">
          <AlertTriangleIcon />
          <span>设备告警</span>
        </div>
      </div>

      <div class="header-actions">
        <button class="action-btn primary">刷新状态</button>
        <button class="action-btn secondary">导出报告</button>
      </div>
    </header>

    <div class="app-body">
      <!-- 侧边栏 - 组织架构树 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-content">
          <DirectoryTree
            v-if="!sidebarCollapsed"
            :on-node-select="handleNodeSelect"
            :on-node-action="handleNodeAction"
          />
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">
        <NodeViewer v-if="selectedNode" :node="selectedNode" />
        <div v-else class="welcome-screen">
          <div class="welcome-content">
            <MonitorIcon class="welcome-icon" />
            <h2 class="welcome-title">欢迎使用设备管理系统</h2>
            <p class="welcome-desc">从左侧组织架构中选择一个区域或设备查看详情</p>
            <div class="welcome-tips">
              <p>💡 提示：您可以拖拽设备到不同区域进行管理</p>
              <div class="status-examples">
                <div class="status-example">
                  <div class="status-dot online"></div>
                  <span>设备在线</span>
                </div>
                <div class="status-example">
                  <div class="status-dot alert"></div>
                  <span>设备告警</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- 底部状态栏 -->
    <footer class="app-footer">
      <div class="footer-left">
        <span>系统就绪</span>
        <span v-if="selectedNode">
          当前选中: {{ selectedNode.label }} ({{ selectedNode.category === 'ZONE' ? '区域' : '设备' }})
        </span>
        <div v-if="selectedNode && selectedNode.category === 'DEVICE' && selectedNode.status" class="footer-status">
          <div class="footer-status-item">
            <div class="status-dot" :class="{ online: selectedNode.status.online }"></div>
            <span>{{ selectedNode.status.online ? '在线' : '离线' }}</span>
          </div>
          <div class="footer-status-item">
            <div class="status-dot" :class="{ alert: selectedNode.status.alert }"></div>
            <span>{{ selectedNode.status.alert ? '告警' : '正常' }}</span>
          </div>
        </div>
        <span v-if="isDragging" class="drag-mode">拖拽模式</span>
      </div>
      <div class="footer-right">
        <span>最后更新: {{ currentTime }}</span>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import DirectoryTree from './components/DirectoryTree.vue'
import NodeViewer from './components/NodeViewer.vue'

// 图标组件
const BuildingIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h4"/><path d="M6 16h4"/><path d="M16 12h2"/><path d="M16 16h2"/><path d="M14 22v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4"/></svg>'
}

const MonitorIcon = {
  template: '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>'
}

const WifiIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/></svg>'
}

const AlertTriangleIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
}

export default {
  name: 'App',
  components: {
    DirectoryTree,
    NodeViewer,
    BuildingIcon,
    MonitorIcon,
    WifiIcon,
    AlertTriangleIcon
  },
  setup() {
    const selectedNode = ref(null)
    const sidebarCollapsed = ref(false)
    const isDragging = ref(false)
    const currentTime = ref('')

    let timeInterval = null

    const updateTime = () => {
      currentTime.value = new Date().toLocaleTimeString()
    }

    const handleNodeSelect = (node) => {
      selectedNode.value = node
    }

    const handleNodeAction = (action, node) => {
      console.log(`执行操作: ${action} on ${node.label}`)

      switch (action) {
        case 'configure':
        case 'view-monitor':
        case 'remote-connect':
        case 'view-logs':
          selectedNode.value = node
          break
        case 'delete':
          if (confirm(`确定要删除 ${node.label} 吗？`)) {
            console.log(`删除节点: ${node.label}`)
          }
          break
        case 'rename':
          const newName = prompt('请输入新名称:', node.label)
          if (newName && newName !== node.label) {
            console.log(`重命名 ${node.label} 为 ${newName}`)
          }
          break
        case 'add-zone':
          const zoneName = prompt('请输入区域名称:')
          if (zoneName) {
            console.log(`在 ${node.label} 中添加区域: ${zoneName}`)
          }
          break
        case 'add-device':
          const deviceName = prompt('请输入设备名称:')
          if (deviceName) {
            console.log(`在 ${node.label} 中添加设备: ${deviceName}`)
          }
          break
        default:
          console.log(`操作 ${action} 暂未实现`)
      }
    }

    const handleGlobalDragStart = () => {
      isDragging.value = true
    }

    const handleGlobalDragEnd = () => {
      isDragging.value = false
    }

    onMounted(() => {
      updateTime()
      timeInterval = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
    })

    return {
      selectedNode,
      sidebarCollapsed,
      isDragging,
      currentTime,
      handleNodeSelect,
      handleNodeAction,
      handleGlobalDragStart,
      handleGlobalDragEnd
    }
  }
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  color: #333;
  background-color: #f3f4f6;
}

.app-container {
  height: 100vh;
  background-color: #f3f4f6;
  display: flex;
  flex-direction: column;
}

.drag-hint {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.drag-hint-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-pulse {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.app-header {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar-toggle {
  padding: 8px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sidebar-toggle:hover {
  background-color: #f3f4f6;
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.status-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item.online {
  color: #059669;
}

.stat-item.alert {
  color: #dc2626;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn.primary {
  background-color: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background-color: #2563eb;
}

.action-btn.secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.action-btn.secondary:hover {
  background-color: #d1d5db;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  background-color: white;
  border-right: 1px solid #e5e7eb;
  width: 320px;
  transition: all 0.3s ease;
}

.sidebar.collapsed {
  width: 0;
}

.sidebar-content {
  height: 100%;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.welcome-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.welcome-content {
  text-align: center;
}

.welcome-icon {
  color: #9ca3af;
  margin: 0 auto 16px;
}

.welcome-title {
  font-size: 20px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.welcome-desc {
  color: #6b7280;
  margin: 0 0 16px 0;
}

.welcome-tips {
  font-size: 14px;
  color: #9ca3af;
}

.status-examples {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.status-example {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-footer {
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #6b7280;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.drag-mode {
  color: #3b82f6;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #9ca3af;
}

.status-dot.online {
  background-color: #10b981;
}

.status-dot.alert {
  background-color: #ef4444;
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
