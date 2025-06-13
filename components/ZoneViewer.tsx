"use client"

import {
  Building2,
  Server,
  Monitor,
  Router,
  Camera,
  Printer,
  HardDrive,
  Cpu,
  BarChart3,
  PieChart,
  TrendingUp,
} from "lucide-react"

interface ZoneViewerProps {
  node: {
    id: number
    label: string
    category: string
    children?: Array<{
      id: number
      label: string
      category: string
      product: string | null
      status?: {
        online: boolean
        alert: boolean
      }
    }>
  }
}

export default function ZoneViewer({ node }: ZoneViewerProps) {
  // 根据设备类型获取图标
  const getDeviceIcon = (product: string | null) => {
    const iconMap: Record<string, any> = {
      WEATHER_STATION: Camera, // 气象站
      SOIL_STATION: HardDrive, // 墒情站
      IRRIGATION_STATION: Router, // 灌溉站
      RUNOFF_STATION: Monitor, // 径流监测站
      HYDRO_STATION: Server, // 水雨情监测站
      SEDIMENT_STATION: Printer, // 泥沙检测站
      GREENHOUSE: HardDrive, // 温室大棚
      RUNOFF_DETECTION: Monitor, // 径流检测站
      default: Cpu,
    }
    return iconMap[product || "default"] || iconMap.default
  }

  // 根据设备类型获取名称
  const getDeviceTypeLabel = (product: string | null) => {
    const typeMap: Record<string, string> = {
      WEATHER_STATION: "气象站",
      SOIL_STATION: "墒情站",
      IRRIGATION_STATION: "灌溉站",
      RUNOFF_STATION: "径流监测站",
      HYDRO_STATION: "水雨情监测站",
      SEDIMENT_STATION: "泥沙检测站",
      GREENHOUSE: "温室大棚",
      RUNOFF_DETECTION: "径流检测站",
      default: "未知设备",
    }
    return typeMap[product || "default"] || typeMap.default
  }

  // 统计信息
  const getChildZoneCount = () => {
    return node.children?.filter((child) => child.category === "ZONE").length || 0
  }

  const getDeviceCount = () => {
    return node.children?.filter((child) => child.category === "DEVICE").length || 0
  }

  const getOnlineDeviceCount = () => {
    return node.children?.filter((child) => child.category === "DEVICE" && child.status?.online).length || 0
  }

  const getOfflineDeviceCount = () => {
    return node.children?.filter((child) => child.category === "DEVICE" && !child.status?.online).length || 0
  }

  const getAlertDeviceCount = () => {
    return node.children?.filter((child) => child.category === "DEVICE" && child.status?.alert).length || 0
  }

  // 生成近七日告警数据
  const getWeeklyAlertData = () => {
    const data = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // 模拟告警数据，基于设备数量和随机因子
      const deviceCount = getDeviceCount()
      const baseAlerts = Math.floor(deviceCount * 0.1) // 基础告警率10%
      const randomFactor = Math.random() * 0.3 - 0.15 // ±15%的随机波动
      const alerts = Math.max(0, Math.floor(baseAlerts * (1 + randomFactor) + Math.random() * 3))

      data.push({
        date: date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
        alerts: alerts,
        fullDate: date.toLocaleDateString("zh-CN"),
      })
    }

    return data
  }

  const weeklyAlertData = getWeeklyAlertData()

  // 渲染饼图
  const renderPieChart = () => {
    const onlineCount = getOnlineDeviceCount()
    const offlineCount = getOfflineDeviceCount()
    const total = onlineCount + offlineCount

    if (total === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无设备数据</p>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500">
            <p className="text-sm">暂无图例数据</p>
          </div>
        </div>
      )
    }

    const onlinePercentage = (onlineCount / total) * 100
    const offlinePercentage = (offlineCount / total) * 100

    return (
      <div className="flex flex-col h-full">
        {/* 图表区域 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
              {/* 离线部分 */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
              {/* 在线部分 */}
              {onlineCount > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="20"
                  strokeDasharray={`${(onlinePercentage / 100) * 2 * Math.PI * 80} ${2 * Math.PI * 80}`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000 ease-in-out"
                />
              )}
            </svg>

            {/* 中心文字 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{total}</div>
                <div className="text-sm text-gray-500">总设备</div>
              </div>
            </div>
          </div>
        </div>

        {/* 图例区域 */}
        <div className="mt-4 flex justify-center">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div className="text-center">
                <div className="text-sm text-gray-700">在线设备</div>
                <div className="text-sm font-medium text-green-600">
                  {onlineCount} ({onlinePercentage.toFixed(1)}%)
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <div className="text-center">
                <div className="text-sm text-gray-700">离线设备</div>
                <div className="text-sm font-medium text-gray-600">
                  {offlineCount} ({offlinePercentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染柱状图
  const renderBarChart = () => {
    const maxAlerts = Math.max(...weeklyAlertData.map((d) => d.alerts), 1)

    return (
      <div className="flex flex-col h-full">
        {/* 图表区域 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="flex items-end justify-between h-40 px-4">
              {weeklyAlertData.map((data, index) => {
                const height = (data.alerts / maxAlerts) * 100
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div className="relative group">
                      <div
                        className="bg-red-500 rounded-t transition-all duration-500 ease-in-out hover:bg-red-600 cursor-pointer min-h-[4px]"
                        style={{
                          height: `${Math.max(height, 8)}%`,
                          width: "24px",
                        }}
                        title={`${data.fullDate}: ${data.alerts}次告警`}
                      />
                      {/* 数值标签 */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.alerts}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">{data.date}</div>
                  </div>
                )
              })}
            </div>

            {/* Y轴标签 */}
            <div className="flex justify-between text-xs text-gray-500 px-4 mt-2">
              <span>0</span>
              <span className="text-center">告警次数</span>
              <span>{maxAlerts}</span>
            </div>
          </div>
        </div>

        {/* 统计信息区域 - 修复溢出问题 */}
        <div className="mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-base font-bold text-red-600">
                  {weeklyAlertData.reduce((sum, data) => sum + data.alerts, 0)}
                </div>
                <div className="text-xs text-gray-500">七日总计</div>
              </div>
              <div>
                <div className="text-base font-bold text-orange-600">
                  {Math.round((weeklyAlertData.reduce((sum, data) => sum + data.alerts, 0) / 7) * 10) / 10}
                </div>
                <div className="text-xs text-gray-500">日均告警</div>
              </div>
              <div>
                <div className="text-base font-bold text-blue-600">
                  {Math.max(...weeklyAlertData.map((d) => d.alerts))}
                </div>
                <div className="text-xs text-gray-500">单日最高</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染设备类型饼图
  const renderDeviceTypeChart = () => {
    // 统计设备类型数量
    const deviceTypes: Record<string, number> = {}

    node.children?.forEach((child) => {
      if (child.category === "DEVICE" && child.product) {
        deviceTypes[child.product] = (deviceTypes[child.product] || 0) + 1
      }
    })

    // 如果没有设备，显示空状态
    if (Object.keys(deviceTypes).length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>暂无设备数据</p>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500">
            <p className="text-sm">暂无图例数据</p>
          </div>
        </div>
      )
    }

    // 设备类型颜色映射
    const colorMap: Record<string, string> = {
      WEATHER_STATION: "#3b82f6", // 蓝色
      SOIL_STATION: "#10b981", // 绿色
      IRRIGATION_STATION: "#f59e0b", // 黄色
      RUNOFF_STATION: "#8b5cf6", // 紫色
      HYDRO_STATION: "#06b6d4", // 青色
      SEDIMENT_STATION: "#f97316", // 橙色
      GREENHOUSE: "#22c55e", // 翠绿色
      RUNOFF_DETECTION: "#6366f1", // 靛蓝色
      default: "#9ca3af", // 灰色
    }

    // 准备饼图数据
    const typeEntries = Object.entries(deviceTypes)
    const total = typeEntries.reduce((sum, [_, count]) => sum + count, 0)

    // 计算每种类型的角度
    let startAngle = 0
    const typeData = typeEntries.map(([type, count]) => {
      const percentage = (count / total) * 100
      const angle = (percentage / 100) * 360
      const data = {
        type,
        count,
        percentage,
        startAngle,
        endAngle: startAngle + angle,
        color: colorMap[type] || colorMap.default,
        label: getDeviceTypeLabel(type),
      }
      startAngle += angle
      return data
    })

    return (
      <div className="flex flex-col h-full">
        {/* 图表区域 */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {typeData.map((data, index) => {
                // 计算SVG路径
                const startRad = ((data.startAngle - 90) * Math.PI) / 180
                const endRad = ((data.endAngle - 90) * Math.PI) / 180

                const x1 = 100 + 80 * Math.cos(startRad)
                const y1 = 100 + 80 * Math.sin(startRad)
                const x2 = 100 + 80 * Math.cos(endRad)
                const y2 = 100 + 80 * Math.sin(endRad)

                const largeArcFlag = data.endAngle - data.startAngle > 180 ? 1 : 0

                const pathData = [`M 100 100`, `L ${x1} ${y1}`, `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(
                  " ",
                )

                return <path key={index} d={pathData} fill={data.color} stroke="white" strokeWidth="1" />
              })}
              {/* 中心圆 */}
              <circle cx="100" cy="100" r="40" fill="white" />
            </svg>

            {/* 中心文字 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{total}</div>
                <div className="text-sm text-gray-500">总设备</div>
              </div>
            </div>
          </div>
        </div>

        {/* 图例区域 */}
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {typeData.map((data, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
                <div className="text-xs">
                  <span className="text-gray-700">{data.label}</span>
                  <span className="text-gray-500 ml-1">
                    {data.count}个 ({data.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 区域详细信息 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* 区域标题和基本信息 */}
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-800">{node.label}</h1>
              <p className="text-sm text-gray-600">组织区域 • ID: {node.id}</p>
            </div>
          </div>

          {/* 区域基本信息 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              区域信息
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">区域名称:</span>
                <span className="ml-2 font-medium">{node.label}</span>
              </div>
              <div>
                <span className="text-gray-600">区域ID:</span>
                <span className="ml-2 font-medium">{node.id}</span>
              </div>
              <div>
                <span className="text-gray-600">区域类型:</span>
                <span className="ml-2 font-medium">组织架构</span>
              </div>
              <div>
                <span className="text-gray-600">管理员:</span>
                <span className="ml-2 font-medium">系统管理员</span>
              </div>
              <div>
                <span className="text-gray-600">创建时间:</span>
                <span className="ml-2 font-medium">
                  2023-{(node.id % 12) + 1}-{(node.id % 28) + 1}
                </span>
              </div>
              <div>
                <span className="text-gray-600">最后更新:</span>
                <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 统计面板 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              统计面板
            </h3>

            {/* 统计卡片 - 移到统计面板内 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{getChildZoneCount()}</div>
                    <div className="text-sm text-gray-600">子区域</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{getDeviceCount()}</div>
                    <div className="text-sm text-gray-600">总设备</div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">{getOnlineDeviceCount()}</div>
                    <div className="text-sm text-gray-600">在线设备</div>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{getAlertDeviceCount()}</div>
                    <div className="text-sm text-gray-600">告警设备</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 设备类型种类饼图 - 替换原来的设备在线状态分布 */}
              <div className="bg-white rounded-lg p-4 border h-80">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-800">设备类型种类</h4>
                </div>
                <div className="h-64">{renderDeviceTypeChart()}</div>
              </div>

              {/* 近七日告警数量柱状图 - 修复溢出问题 */}
              <div className="bg-white rounded-lg p-4 border h-80">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-gray-800">近七日告警趋势</h4>
                </div>
                <div className="h-64">{renderBarChart()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
