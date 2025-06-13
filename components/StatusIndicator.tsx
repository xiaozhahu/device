interface StatusIndicatorProps {
  status: {
    online: boolean
    alert: boolean
  }
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-1 mr-2">
      {/* 在线状态指示器 */}
      <div
        className={`w-2 h-2 rounded-full transition-colors ${status.online ? "bg-green-500" : "bg-gray-400"} ${
          status.online ? "animate-pulse" : ""
        }`}
        title={status.online ? "设备在线" : "设备离线"}
      />

      {/* 告警状态指示器 */}
      <div
        className={`w-2 h-2 rounded-full transition-colors ${status.alert ? "bg-red-500" : "bg-gray-400"} ${
          status.alert ? "animate-pulse" : ""
        }`}
        title={status.alert ? "设备告警" : "设备正常"}
      />
    </div>
  )
}
