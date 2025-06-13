<template>
  <div class="status-indicator">
    <!-- 在线状态指示器 -->
    <div
      class="status-dot"
      :class="{ 'online': status.online, 'offline': !status.online }"
      :title="status.online ? '设备在线' : '设备离线'"
    />

    <!-- 告警状态指示器 -->
    <div
      class="status-dot"
      :class="{ 'alert': status.alert, 'normal': !status.alert }"
      :title="status.alert ? '设备告警' : '设备正常'"
    />
  </div>
</template>

<script>
export default {
  name: 'StatusIndicator',
  props: {
    status: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.status-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
