<template>
  <div class="node-viewer">
    <!-- 节点信息头部 -->
    <div class="viewer-header">
      <div class="header-content">
        <component :is="getNodeIcon()" class="header-icon" />
        <div class="header-info">
          <h1 class="node-title">{{ node.label }}</h1>
          <p class="node-subtitle">
            {{ getNodeTypeLabel() }} • ID: {{ node.id }}
          </p>
        </div>
        <div v-if="node.category === 'DEVICE' && node.status" class="status-badges">
          <div class="status-badge" :class="{ 'online': node.status.online }">
            <div class="status-dot" :class="{ 'online': node.status.online }"></div>
            <span>{{ node.status.online ? '在线' : '离线' }}</span>
          </div>
          <div class="status-badge" :class="{ 'alert': node.status.alert }">
            <div class="status-dot" :class="{ 'alert': node.status.alert }"></div>
            <span>{{ node.status.alert ? '告警' : '正常' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 节点详细信息 -->
    <div class="viewer-content">
      <!-- 区域信息 -->
      <div v-if="node.category === 'ZONE'" class="info-sections">
        <div class="info-card zone-card">
          <h2 class="card-title">
            <BuildingIcon />
            区域信息
          </h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">区域名称:</span>
              <span class="info-value">{{ node.label }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">区域ID:</span>
              <span class="info-value">{{ node.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">子区域数量:</span>
              <span class="info-value">{{ getChildZoneCount() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">设备数量:</span>
              <span class="info-value">{{ getDeviceCount() }}</span>
            </div>
          </div>
        </div>

        <!-- 子项目列表 -->
        <div v-if="node.children && node.children.length > 0" class="children-section">
          <h3 class="section-title">子项目</h3>
          <div class="children-list">
            <div
              v-for="child in node.children"
              :key="child.id"
              class="child-item"
            >
              <component
                :is="child.category === 'ZONE' ? 'BuildingIcon' : getDeviceIcon(child.product)"
                class="child-icon"
                :class="child.category === 'ZONE' ? 'zone-color' : 'device-color'"
              />
              <span class="child-name">{{ child.label }}</span>
              <span class="child-type">
                ({{ child.category === 'ZONE' ? '区域' : getDeviceTypeLabel(child.product) }})
              </span>
              <div v-if="child.status" class="child-status">
                <div class="status-dot" :class="{ 'online': child.status.online }"></div>
                <div class="status-dot" :class="{ 'alert': child.status.alert }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 设备信息 -->
      <div v-else class="info-sections">
        <div class="info-card device-card">
          <h2 class="card-title">
            <component :is="getNodeIcon()" />
            设备信息
          </h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">设备名称:</span>
              <span class="info-value">{{ node.label }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">设备ID:</span>
              <span class="info-value">{{ node.id }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">设备类型:</span>
              <span class="info-value">{{ getNodeTypeLabel() }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">产品型号:</span>
              <span class="info-value">{{ node.product || '未知' }}</span>
            </div>
          </div>
        </div>

        <!-- 设备状态 -->
        <div v-if="node.status" class="info-card status-card">
          <h3 class="card-title">
            <ActivityIcon />
            设备状态
          </h3>
          <div class="status-grid">
            <div class="status-item" :class="{ 'online': node.status.online }">
              <div class="status-header">
                <WifiIcon />
                <span>连接状态</span>
              </div>
              <p class="status-text">
                {{ node.status.online ? '设备在线' : '设备离线' }}
              </p>
            </div>
            <div class="status-item" :class="{ 'alert': node.status.alert }">
              <div class="status-header">
                <AlertTriangleIcon />
                <span>告警状态</span>
              </div>
              <p class="status-text">
                {{ node.status.alert ? '设备告警' : '运行正常' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 操作面板 -->
        <div class="info-card actions-card">
          <h3 class="card-title">
            <SettingsIcon />
            操作面板
          </h3>
          <div class="actions-grid">
            <button class="action-button">
              <div class="action-title">设备配置</div>
              <div class="action-desc">修改设备参数</div>
            </button>
            <button class="action-button">
              <div class="action-title">状态监控</div>
              <div class="action-desc">查看实时状态</div>
            </button>
            <button class="action-button">
              <div class="action-title">日志查看</div>
              <div class="action-desc">查看操作日志</div>
            </button>
            <button class="action-button">
              <div class="action-title">远程控制</div>
              <div class="action-desc">远程操作设备</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 图标组件
const BuildingIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12h4"/><path d="M6 16h4"/><path d="M16 12h2"/><path d="M16 16h2"/><path d="M14 22v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4"/></svg>'
}

const ActivityIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
}

const WifiIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/></svg>'
}

const AlertTriangleIcon = {
  template: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
}

const SettingsIcon = {
  template: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>'
}

// 设备图标组件
const ServerIcon = {
  template: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>'
}

const MonitorIcon = {
  template: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>'
}

const RouterIcon = {
  template: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="8" x="3" y="3" rx="2"/><path d="M12 8v13"/><path d="M8 21h8"/></svg>'
}

const CameraIcon = {
  template: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>'
}

const PrinterIcon = {
  template: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 6,2 18,2 18,9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>'
}

const SmartphoneIcon = {
  template: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>'
}

const HardDriveIcon = {
  template: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>'
}

const CpuIcon = {
  template: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>'
}

export default {
  name: 'NodeViewer',
  components: {
    BuildingIcon,
    ActivityIcon,
    WifiIcon,
    AlertTriangleIcon,
    SettingsIcon,
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
    node: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const getNodeIcon = () => {
      if (props.node.category === 'ZONE') {
        return 'BuildingIcon'
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

    const getNodeTypeLabel = () => {
      if (props.node.category === 'ZONE') {
        return '组织区域'
      }

      const typeMap = {
        SERVER: '服务器',
        WORKSTATION: '工作站',
        ROUTER: '路由器',
        SWITCH: '交换机',
        CAMERA: '网络摄像头',
        PRINTER: '打印机',
        MOBILE: '移动设备',
        STORAGE: '存储设备',
        default: '未知设备'
      }
      return typeMap[props.node.product] || typeMap.default
    }

    const getDeviceTypeLabel = (product) => {
      const typeMap = {
        SERVER: '服务器',
        WORKSTATION: '工作站',
        ROUTER: '路由器',
        SWITCH: '交换机',
        CAMERA: '网络摄像头',
        PRINTER: '打印机',
        MOBILE: '移动设备',
        STORAGE: '存储设备',
        default: '未知设备'
      }
      return typeMap[product] || typeMap.default
    }

    const getDeviceIcon = (product) => {
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
      return iconMap[product] || iconMap.default
    }

    const getChildZoneCount = () => {
      return props.node.children?.filter(child => child.category === 'ZONE').length || 0
    }

    const getDeviceCount = () => {
      return props.node.children?.filter(child => child.category === 'DEVICE').length || 0
    }

    return {
      getNodeIcon,
      getNodeTypeLabel,
      getDeviceTypeLabel,
      getDeviceIcon,
      getChildZoneCount,
      getDeviceCount
    }
  }
}
</script>

<style scoped>
.node-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
}

.viewer-header {
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  padding: 24px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  color: #3b82f6;
}

.header-info {
  flex: 1;
}

.node-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.node-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.status-badges {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.online {
  color: #059669;
}

.status-badge.alert {
  color: #dc2626;
}

.status-badge:not(.online):not(.alert) {
  color: #6b7280;
}

.viewer-content {
  flex: 1;
  overflow: auto;
  padding: 24px;
}

.info-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  border-radius: 8px;
  padding: 16px;
}

.zone-card {
  background-color: #dbeafe;
}

.device-card {
  background-color: #dcfce7;
}

.status-card {
  background-color: #f3f4f6;
}

.actions-card {
  background-color: #dbeafe;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  font-size: 14px;
}

.info-label {
  color: #6b7280;
}

.info-value {
  margin-left: 8px;
  font-weight: 500;
  color: #1f2937;
}

.children-section {
  margin-top: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.child-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 8px;
}

.child-icon {
  width: 20px;
  height: 20px;
}

.zone-color {
  color: #3b82f6;
}

.device-color {
  color: #6b7280;
}

.child-name {
  font-weight: 500;
  color: #1f2937;
}

.child-type {
  font-size: 14px;
  color: #6b7280;
}

.child-status {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
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

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.status-item {
  padding: 12px;
  border-radius: 8px;
  background-color: #f9fafb;
}

.status-item.online {
  background-color: #ecfdf5;
}

.status-item.alert {
  background-color: #fef2f2;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1f2937;
}

.status-text {
  font-size: 14px;
  margin: 0;
}

.status-item.online .status-text {
  color: #059669;
}

.status-item.alert .status-text {
  color: #dc2626;
}

.status-item:not(.online):not(.alert) .status-text {
  color: #6b7280;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-button {
  padding: 12px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: #f9fafb;
}

.action-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 14px;
  color: #6b7280;
}
</style>
