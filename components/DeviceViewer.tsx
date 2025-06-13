"use client"

import { useState } from "react"
import {
  Server,
  Monitor,
  Router,
  Camera,
  Printer,
  HardDrive,
  Cpu,
  Activity,
  Wifi,
  AlertTriangle,
  Settings,
  BarChart2,
  Bell,
  Sliders,
  SatelliteIcon as RemoteControl,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Waves,
  Timer,
  Zap,
  RotateCcw,
  Power,
  Wrench,
} from "lucide-react"

interface DeviceViewerProps {
  node: {
    id: number
    label: string
    category: string
    product: string | null
    status?: {
      online: boolean
      alert: boolean
    }
  }
}

export default function DeviceViewer({ node }: DeviceViewerProps) {
  const [activeTab, setActiveTab] = useState("basic")

  // 根据设备类型获取图标
  const getDeviceIcon = () => {
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
    return iconMap[node.product || "default"] || iconMap.default
  }

  // 根据设备类型获取名称
  const getDeviceTypeLabel = () => {
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
    return typeMap[node.product || "default"] || typeMap.default
  }

  // 根据设备类型获取采集点数据
  const getSensorData = () => {
    const sensorMap: Record<string, any[]> = {
      WEATHER_STATION: [
        {
          name: "温度",
          icon: Thermometer,
          value: 25.6,
          unit: "°C",
          color: "text-red-500",
          data: [24.2, 24.8, 25.1, 25.4, 25.6],
        },
        {
          name: "湿度",
          icon: Droplets,
          value: 68.2,
          unit: "%",
          color: "text-blue-500",
          data: [65.1, 66.8, 67.2, 67.9, 68.2],
        },
        { name: "风速", icon: Wind, value: 3.2, unit: "m/s", color: "text-green-500", data: [2.8, 3.1, 2.9, 3.4, 3.2] },
        { name: "风向", icon: Wind, value: 135, unit: "°", color: "text-purple-500", data: [120, 125, 130, 132, 135] },
        {
          name: "气压",
          icon: Gauge,
          value: 1013.2,
          unit: "hPa",
          color: "text-orange-500",
          data: [1012.8, 1013.0, 1013.1, 1013.0, 1013.2],
        },
        {
          name: "降雨量",
          icon: Droplets,
          value: 0.0,
          unit: "mm",
          color: "text-cyan-500",
          data: [0.0, 0.0, 0.0, 0.0, 0.0],
        },
      ],
      SOIL_STATION: [
        {
          name: "土壤温度",
          icon: Thermometer,
          value: 18.5,
          unit: "°C",
          color: "text-red-500",
          data: [18.1, 18.2, 18.3, 18.4, 18.5],
        },
        {
          name: "土壤湿度",
          icon: Droplets,
          value: 45.3,
          unit: "%",
          color: "text-blue-500",
          data: [44.8, 45.0, 45.1, 45.2, 45.3],
        },
        {
          name: "土壤EC",
          icon: Zap,
          value: 1.2,
          unit: "mS/cm",
          color: "text-yellow-500",
          data: [1.1, 1.15, 1.18, 1.19, 1.2],
        },
        {
          name: "土壤pH",
          icon: Gauge,
          value: 6.8,
          unit: "pH",
          color: "text-green-500",
          data: [6.7, 6.75, 6.77, 6.78, 6.8],
        },
      ],
      IRRIGATION_STATION: [
        {
          name: "流量",
          icon: Waves,
          value: 15.6,
          unit: "L/min",
          color: "text-blue-500",
          data: [15.2, 15.3, 15.4, 15.5, 15.6],
        },
        {
          name: "压力",
          icon: Gauge,
          value: 2.5,
          unit: "bar",
          color: "text-red-500",
          data: [2.4, 2.45, 2.47, 2.48, 2.5],
        },
        {
          name: "水温",
          icon: Thermometer,
          value: 22.1,
          unit: "°C",
          color: "text-orange-500",
          data: [21.8, 21.9, 22.0, 22.0, 22.1],
        },
      ],
      RUNOFF_STATION: [
        {
          name: "水位",
          icon: Waves,
          value: 1.25,
          unit: "m",
          color: "text-blue-500",
          data: [1.2, 1.22, 1.23, 1.24, 1.25],
        },
        {
          name: "流速",
          icon: Wind,
          value: 0.8,
          unit: "m/s",
          color: "text-green-500",
          data: [0.75, 0.77, 0.78, 0.79, 0.8],
        },
        {
          name: "流量",
          icon: Waves,
          value: 125.6,
          unit: "m³/h",
          color: "text-cyan-500",
          data: [120.2, 122.1, 123.5, 124.8, 125.6],
        },
      ],
      HYDRO_STATION: [
        {
          name: "水位",
          icon: Waves,
          value: 2.35,
          unit: "m",
          color: "text-blue-500",
          data: [2.3, 2.31, 2.32, 2.34, 2.35],
        },
        {
          name: "降雨量",
          icon: Droplets,
          value: 2.5,
          unit: "mm",
          color: "text-cyan-500",
          data: [0.0, 0.5, 1.2, 2.0, 2.5],
        },
        {
          name: "水温",
          icon: Thermometer,
          value: 16.8,
          unit: "°C",
          color: "text-red-500",
          data: [16.5, 16.6, 16.7, 16.7, 16.8],
        },
      ],
      SEDIMENT_STATION: [
        {
          name: "浊度",
          icon: Gauge,
          value: 15.2,
          unit: "NTU",
          color: "text-yellow-500",
          data: [14.8, 14.9, 15.0, 15.1, 15.2],
        },
        {
          name: "悬浮物",
          icon: Droplets,
          value: 25.6,
          unit: "mg/L",
          color: "text-orange-500",
          data: [24.2, 24.8, 25.1, 25.4, 25.6],
        },
        {
          name: "水位",
          icon: Waves,
          value: 1.85,
          unit: "m",
          color: "text-blue-500",
          data: [1.8, 1.82, 1.83, 1.84, 1.85],
        },
      ],
      GREENHOUSE: [
        {
          name: "棚内温度",
          icon: Thermometer,
          value: 28.5,
          unit: "°C",
          color: "text-red-500",
          data: [27.8, 28.1, 28.3, 28.4, 28.5],
        },
        {
          name: "棚内湿度",
          icon: Droplets,
          value: 72.3,
          unit: "%",
          color: "text-blue-500",
          data: [70.5, 71.2, 71.8, 72.1, 72.3],
        },
        {
          name: "光照强度",
          icon: Gauge,
          value: 45.6,
          unit: "klux",
          color: "text-yellow-500",
          data: [42.1, 43.5, 44.2, 45.0, 45.6],
        },
        {
          name: "CO2浓度",
          icon: Wind,
          value: 420,
          unit: "ppm",
          color: "text-green-500",
          data: [415, 417, 418, 419, 420],
        },
      ],
      RUNOFF_DETECTION: [
        {
          name: "径流量",
          icon: Waves,
          value: 85.2,
          unit: "m³/h",
          color: "text-blue-500",
          data: [82.1, 83.5, 84.2, 84.8, 85.2],
        },
        {
          name: "水位高度",
          icon: Gauge,
          value: 1.45,
          unit: "m",
          color: "text-cyan-500",
          data: [1.4, 1.42, 1.43, 1.44, 1.45],
        },
        {
          name: "流速",
          icon: Wind,
          value: 1.2,
          unit: "m/s",
          color: "text-green-500",
          data: [1.15, 1.17, 1.18, 1.19, 1.2],
        },
        {
          name: "浊度",
          icon: Droplets,
          value: 12.8,
          unit: "NTU",
          color: "text-orange-500",
          data: [12.2, 12.4, 12.6, 12.7, 12.8],
        },
      ],
      default: [{ name: "数据1", icon: Gauge, value: 0, unit: "", color: "text-gray-500", data: [0, 0, 0, 0, 0] }],
    }
    return sensorMap[node.product || "default"] || sensorMap.default
  }

  // 根据设备类型获取控制点
  const getControlPoints = () => {
    const controlMap: Record<string, any[]> = {
      WEATHER_STATION: [
        { name: "数据采集", type: "switch", status: true },
        { name: "加热器", type: "switch", status: false },
      ],
      SOIL_STATION: [
        { name: "数据采集", type: "switch", status: true },
        { name: "土壤加热", type: "switch", status: false },
      ],
      IRRIGATION_STATION: [
        { name: "主水泵", type: "switch", status: true },
        { name: "电磁阀1", type: "switch", status: false },
        { name: "电磁阀2", type: "switch", status: true },
        { name: "搅拌电机", type: "motor", status: "forward", speed: 75 },
        { name: "进水闸门", type: "valve", value: 75 },
        { name: "排水闸门", type: "valve", value: 25 },
      ],
      RUNOFF_STATION: [
        { name: "数据采集", type: "switch", status: true },
        { name: "清洁装置", type: "motor", status: "stop", speed: 50 },
      ],
      HYDRO_STATION: [
        { name: "数据采集", type: "switch", status: true },
        { name: "预警灯", type: "switch", status: false },
        { name: "排水闸门", type: "valve", value: 0 },
        { name: "提升泵", type: "motor", status: "stop", speed: 60 },
      ],
      SEDIMENT_STATION: [
        { name: "数据采集", type: "switch", status: true },
        { name: "清洗装置", type: "motor", status: "reverse", speed: 40 },
        { name: "取样器", type: "switch", status: false },
        { name: "过滤阀门", type: "valve", value: 50 },
      ],
      GREENHOUSE: [
        { name: "数据采集", type: "switch", status: true },
        { name: "通风系统", type: "switch", status: false },
        { name: "加热系统", type: "switch", status: true },
        { name: "卷帘电机", type: "motor", status: "stop", speed: 60 },
        { name: "喷淋系统", type: "switch", status: false },
      ],
      RUNOFF_DETECTION: [
        { name: "数据采集", type: "switch", status: true },
        { name: "清洁装置", type: "switch", status: false },
        { name: "闸门控制", type: "valve", value: 45 },
        { name: "预警灯", type: "switch", status: true },
      ],
      default: [],
    }
    return controlMap[node.product || "default"] || controlMap.default
  }

  const IconComponent = getDeviceIcon()
  const sensorData = getSensorData()
  const controlPoints = getControlPoints()

  const tabs = [
    { id: "basic", label: "基础信息", icon: <Settings className="w-4 h-4" /> },
    { id: "realtime", label: "实时数据", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "alert", label: "告警配置", icon: <Bell className="w-4 h-4" /> },
    { id: "auto", label: "自动配置", icon: <Sliders className="w-4 h-4" /> },
    { id: "remote", label: "远程控制", icon: <RemoteControl className="w-4 h-4" /> },
    { id: "params", label: "参数配置", icon: <Wrench className="w-4 h-4" /> },
  ]

  // 渲染小型图表
  const renderMiniChart = (data: number[]) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    return (
      <div className="flex items-end gap-1 h-8">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100
          return (
            <div
              key={index}
              className="bg-current opacity-60 w-1 rounded-t"
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 设备信息头部 */}
      <div className="border-b bg-gray-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <IconComponent className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{node.label}</h1>
            <p className="text-sm text-gray-600">
              {getDeviceTypeLabel()} • ID: {node.id}
            </p>
          </div>
          {node.status && (
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${node.status.online ? "bg-green-500" : "bg-gray-400"}`}></div>
                <span className={`text-sm font-medium ${node.status.online ? "text-green-600" : "text-gray-500"}`}>
                  {node.status.online ? "在线" : "离线"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${node.status.alert ? "bg-red-500" : "bg-gray-400"}`}></div>
                <span className={`text-sm font-medium ${node.status.alert ? "text-red-600" : "text-gray-500"}`}>
                  {node.status.alert ? "告警" : "正常"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 标签页内容 */}
      <div className="flex-1 overflow-auto p-6">
        {/* 基础信息 */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <IconComponent className="w-5 h-5" />
                设备信息
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">设备名称:</span>
                  <span className="ml-2 font-medium">{node.label}</span>
                </div>
                <div>
                  <span className="text-gray-600">设备ID:</span>
                  <span className="ml-2 font-medium">{node.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">设备类型:</span>
                  <span className="ml-2 font-medium">{getDeviceTypeLabel()}</span>
                </div>
                <div>
                  <span className="text-gray-600">产品型号:</span>
                  <span className="ml-2 font-medium">{node.product || "未知"}</span>
                </div>
                <div>
                  <span className="text-gray-600">IP地址:</span>
                  <span className="ml-2 font-medium">192.168.1.{(node.id % 100) + 10}</span>
                </div>
                <div>
                  <span className="text-gray-600">设备编号:</span>
                  <span className="ml-2 font-medium">IOT-{(node.id % 100).toString().padStart(3, "0")}</span>
                </div>
                <div>
                  <span className="text-gray-600">固件版本:</span>
                  <span className="ml-2 font-medium">v2.1.{node.id % 10}</span>
                </div>
                <div>
                  <span className="text-gray-600">安装日期:</span>
                  <span className="ml-2 font-medium">
                    2023-{(node.id % 12) + 1}-{(node.id % 28) + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* 设备状态 */}
            {node.status && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  设备状态
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${node.status.online ? "bg-green-100" : "bg-gray-100"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Wifi className={`w-4 h-4 ${node.status.online ? "text-green-600" : "text-gray-500"}`} />
                      <span className="font-medium">连接状态</span>
                    </div>
                    <p className={`text-sm ${node.status.online ? "text-green-600" : "text-gray-500"}`}>
                      {node.status.online ? "设备在线" : "设备离线"}
                    </p>
                    {node.status.online && (
                      <p className="text-xs text-gray-500 mt-1">最后心跳: {new Date().toLocaleTimeString()}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${node.status.alert ? "bg-red-100" : "bg-gray-100"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`w-4 h-4 ${node.status.alert ? "text-red-600" : "text-gray-500"}`} />
                      <span className="font-medium">告警状态</span>
                    </div>
                    <p className={`text-sm ${node.status.alert ? "text-red-600" : "text-gray-500"}`}>
                      {node.status.alert ? "设备告警" : "运行正常"}
                    </p>
                    {node.status.alert && (
                      <p className="text-xs text-red-500 mt-1">告警时间: {new Date().toLocaleTimeString()}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 实时数据 */}
        {activeTab === "realtime" && (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                实时数据监控
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensorData.map((sensor, index) => {
                  const IconComponent = sensor.icon
                  return (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-5 h-5 ${sensor.color}`} />
                          <span className="font-medium text-gray-800">{sensor.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(Date.now() - Math.random() * 300000).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-end justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold text-gray-800">{sensor.value}</div>
                          <div className="text-sm text-gray-500">{sensor.unit}</div>
                        </div>
                        <div className={`${sensor.color}`}>{renderMiniChart(sensor.data)}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        最近5次: {sensor.data.join(", ")} {sensor.unit}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">数据采集记录</h3>
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          设备
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          要素
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          数据
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          日期时间
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const records = []
                        const now = Date.now()

                        // 为每个传感器生成最近5条记录
                        sensorData.forEach((sensor, sensorIndex) => {
                          for (let i = 0; i < 5; i++) {
                            const timestamp = now - i * 60000 - sensorIndex * 10000 // 每分钟一条记录，传感器间隔10秒
                            const value = sensor.data[sensor.data.length - 1 - i] || sensor.value
                            records.push({
                              device: node.label,
                              parameter: sensor.name,
                              value: `${value} ${sensor.unit}`,
                              timestamp: new Date(timestamp).toLocaleString(),
                              color: sensor.color,
                            })
                          }
                        })

                        // 按时间排序，最新的在前
                        records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

                        return records.slice(0, 15).map((record, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-3 text-sm text-gray-900">{record.device}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`font-medium ${record.color}`}>{record.parameter}</span>
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-900">{record.value}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{record.timestamp}</td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-4 py-3 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>显示最近15条记录</span>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">查看更多记录</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 告警配置 */}
        {activeTab === "alert" && (
          <div className="space-y-6">
            <div className="bg-red-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                告警配置
              </h2>

              <div className="space-y-4">
                {sensorData.map((sensor, index) => {
                  const IconComponent = sensor.icon
                  return (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`w-4 h-4 ${sensor.color}`} />
                          <span className="font-medium">{sensor.name} 告警配置</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">下下限 (严重低)</label>
                          <input
                            type="number"
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            defaultValue={sensor.value * 0.7}
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">下限 (一般低)</label>
                          <input
                            type="number"
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            defaultValue={sensor.value * 0.85}
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">上限 (一般高)</label>
                          <input
                            type="number"
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            defaultValue={sensor.value * 1.15}
                            step="0.1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">上上限 (严重高)</label>
                          <input
                            type="number"
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            defaultValue={sensor.value * 1.3}
                            step="0.1"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">持续时间:</span>
                          <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                            <option>30秒</option>
                            <option>1分钟</option>
                            <option>5分钟</option>
                            <option>10分钟</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">单位:</span>
                          <span className="font-medium">{sensor.unit}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">通知设置</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="email-notify"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="email-notify" className="ml-2 text-sm font-medium text-gray-900">
                    邮件通知
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="sms-notify"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sms-notify" className="ml-2 text-sm font-medium text-gray-900">
                    短信通知
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="app-notify"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="app-notify" className="ml-2 text-sm font-medium text-gray-900">
                    App推送
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 自动配置 */}
        {activeTab === "auto" && (
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                自动配置
              </h2>

              {/* 定时配置 */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  定时配置
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">任务名称:</span>
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      placeholder="输入任务名称"
                      defaultValue="定时灌溉"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">执行时间:</span>
                    <input
                      type="time"
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                      defaultValue="06:00"
                    />
                    <span className="text-sm text-gray-600">每天</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">控制动作:</span>
                    <select className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>开启主水泵</option>
                      <option>关闭主水泵</option>
                      <option>开启电磁阀</option>
                      <option>关闭电磁阀</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">持续时间:</span>
                    <input
                      type="number"
                      className="px-3 py-1 border border-gray-300 rounded text-sm w-20"
                      defaultValue="30"
                    />
                    <span className="text-sm text-gray-600">分钟</span>
                  </div>
                </div>
              </div>

              {/* 定量配置 */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Gauge className="w-4 h-4" />
                  定量配置
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">任务名称:</span>
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      placeholder="输入任务名称"
                      defaultValue="定量灌溉"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">监测参数:</span>
                    <select className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>流量</option>
                      <option>水位</option>
                      <option>压力</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">目标数值:</span>
                    <input
                      type="number"
                      className="px-3 py-1 border border-gray-300 rounded text-sm w-32"
                      defaultValue="100"
                    />
                    <span className="text-sm text-gray-600">L</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">控制动作:</span>
                    <select className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>达到目标值后关闭</option>
                      <option>达到目标值后开启</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 自动配置 */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  条件触发配置
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">规则名称:</span>
                    <input
                      type="text"
                      className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                      placeholder="输入规则名称"
                      defaultValue="土壤湿度自动灌溉"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">触发条件:</span>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>土壤湿度</option>
                      <option>温度</option>
                      <option>水位</option>
                    </select>
                    <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>小于</option>
                      <option>大于</option>
                      <option>等于</option>
                    </select>
                    <input
                      type="number"
                      className="px-3 py-1 border border-gray-300 rounded text-sm w-20"
                      defaultValue="30"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">执行动作:</span>
                    <select className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm">
                      <option>开启主水泵</option>
                      <option>关闭主水泵</option>
                      <option>开启电磁阀1</option>
                      <option>设置闸门开度</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 w-24">延迟时间:</span>
                    <input
                      type="number"
                      className="px-3 py-1 border border-gray-300 rounded text-sm w-20"
                      defaultValue="0"
                    />
                    <span className="text-sm text-gray-600">秒</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 远程控制 */}
        {activeTab === "remote" && (
          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <RemoteControl className="w-5 h-5" />
                远程控制
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {controlPoints.map((control, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{control.name}</span>
                        {control.type === "switch" && <Power className="w-4 h-4 text-gray-500" />}
                        {control.type === "motor" && <RotateCcw className="w-4 h-4 text-gray-500" />}
                        {control.type === "valve" && <Gauge className="w-4 h-4 text-gray-500" />}
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {control.type === "switch" ? "开关类型" : control.type === "motor" ? "电机类型" : "开度类型"}
                      </span>
                    </div>

                    {/* 开关类型 */}
                    {control.type === "switch" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={control.status} />
                            <div className="w-16 h-9 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="text-center">
                          <span
                            className={`text-sm font-medium ${control.status ? "text-green-600" : "text-gray-500"}`}
                          >
                            {control.status ? "开启" : "关闭"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          状态: {control.status ? "运行中" : "已停止"}
                        </div>
                      </div>
                    )}

                    {/* 电机类型 */}
                    {control.type === "motor" && (
                      <div className="space-y-4">
                        {/* 当前状态显示 */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">当前状态:</span>
                            <span
                              className={`text-sm font-medium px-2 py-1 rounded ${
                                control.status === "forward"
                                  ? "bg-green-100 text-green-600"
                                  : control.status === "reverse"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {control.status === "forward" ? "正转" : control.status === "reverse" ? "反转" : "停止"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">运行时间:</span>
                            <span className="text-sm font-medium">00:05:23</span>
                          </div>
                        </div>

                        {/* 控制按钮 */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                              control.status === "forward"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
                            }`}
                          >
                            <RotateCcw className="w-4 h-4 mx-auto mb-1" />
                            正转
                          </button>
                          <button
                            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                              control.status === "stop"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700"
                            }`}
                          >
                            <Power className="w-4 h-4 mx-auto mb-1" />
                            停止
                          </button>
                          <button
                            className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                              control.status === "reverse"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                            }`}
                          >
                            <RotateCcw className="w-4 h-4 mx-auto mb-1 transform rotate-180" />
                            反转
                          </button>
                        </div>

                        {/* 速度控制 */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">运行速度:</span>
                            <span className="text-sm font-medium">{control.speed || 75}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            defaultValue={control.speed || 75}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            disabled={control.status === "stop"}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>低速</span>
                            <span>高速</span>
                          </div>
                        </div>

                        {/* 定时控制 */}
                        <div className="border-t pt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Timer className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">定时运行</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="时间"
                              min="1"
                              max="999"
                            />
                            <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                              <option>秒</option>
                              <option>分钟</option>
                              <option>小时</option>
                            </select>
                            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600">
                              启动
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 开度类型 */}
                    {control.type === "valve" && (
                      <div className="space-y-4">
                        {/* 当前开度显示 */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">当前开度:</span>
                            <span className="text-2xl font-bold text-blue-600">{control.value}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">状态:</span>
                            <span
                              className={`text-sm font-medium ${
                                control.value === 0
                                  ? "text-gray-600"
                                  : control.value === 100
                                    ? "text-green-600"
                                    : "text-blue-600"
                              }`}
                            >
                              {control.value === 0 ? "完全关闭" : control.value === 100 ? "完全开启" : "部分开启"}
                            </span>
                          </div>
                        </div>

                        {/* 开度滑块 */}
                        <div className="space-y-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue={control.value}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${control.value}%, #e5e7eb ${control.value}%, #e5e7eb 100%)`,
                            }}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>关闭 (0%)</span>
                            <span>全开 (100%)</span>
                          </div>
                        </div>

                        {/* 精确数值输入 */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">精确设置:</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            defaultValue={control.value}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                          />
                          <span className="text-sm text-gray-600">%</span>
                          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                            设置
                          </button>
                        </div>

                        {/* 快捷按钮 */}
                        <div className="grid grid-cols-4 gap-2">
                          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            0%
                          </button>
                          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            25%
                          </button>
                          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            50%
                          </button>
                          <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                            100%
                          </button>
                        </div>

                        {/* 开度限制设置 */}
                        <div className="border-t pt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Settings className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">开度限制</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">最小开度</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                defaultValue="0"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">最大开度</label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                defaultValue="100"
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 自动控制 */}
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">自动控制</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="text-xs text-gray-500">根据传感器数据自动调节开度</div>
                        </div>
                      </div>
                    )}

                    {/* 操作记录 */}
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-600">最近操作</span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>15:30:25 - 手动操作</div>
                        <div>15:28:10 - 自动控制</div>
                        <div>15:25:45 - 定时任务</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 批量控制 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                批量控制
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Power className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-gray-800">全部开启</span>
                  </div>
                  <div className="text-sm text-gray-600">开启所有可控设备</div>
                </button>
                <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Power className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-gray-800">全部关闭</span>
                  </div>
                  <div className="text-sm text-gray-600">关闭所有可控设备</div>
                </button>
                <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <RotateCcw className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-800">重置状态</span>
                  </div>
                  <div className="text-sm text-gray-600">重置所有控制点</div>
                </button>
              </div>
            </div>

            {/* 控制日志 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">控制日志</h3>
              <div className="bg-black text-green-400 p-3 rounded font-mono text-xs h-40 overflow-auto">
                <div>[{new Date().toLocaleTimeString()}] 远程控制连接建立</div>
                <div>[{new Date().toLocaleTimeString()}] 获取设备控制权限</div>
                <div>[{new Date().toLocaleTimeString()}] 主水泵状态: 开启</div>
                <div>[{new Date().toLocaleTimeString()}] 搅拌电机: 正转运行 - 速度75%</div>
                <div>
                  [{new Date().toLocaleTimeString()}] 闸门开度设置: 75% {"->"} 85%
                </div>
                <div>[{new Date().toLocaleTimeString()}] 电磁阀1状态: 关闭</div>
                <div>[{new Date().toLocaleTimeString()}] 定时任务启动: 搅拌电机运行30分钟</div>
                <div>[{new Date().toLocaleTimeString()}] 自动控制激活: 根据水位调节闸门开度</div>
                <div>[{new Date().toLocaleTimeString()}] 等待用户操作...</div>
              </div>
            </div>
          </div>
        )}

        {/* 参数配置 */}
        {activeTab === "params" && (
          <div className="space-y-6">
            <div className="bg-orange-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                参数配置
              </h2>

              {/* 通信参数 */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <h3 className="font-medium mb-3">通信参数</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">数据发送间隔</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        defaultValue="60"
                      />
                      <span className="text-sm text-gray-600">秒</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">心跳间隔</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        defaultValue="30"
                      />
                      <span className="text-sm text-gray-600">秒</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">超时时间</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        defaultValue="120"
                      />
                      <span className="text-sm text-gray-600">秒</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">重连次数</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded" defaultValue="3" />
                  </div>
                </div>
              </div>

              {/* 采集参数 */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <h3 className="font-medium mb-3">采集参数</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">采集周期</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        defaultValue="10"
                      />
                      <span className="text-sm text-gray-600">秒</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">存储周期</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        defaultValue="60"
                      />
                      <span className="text-sm text-gray-600">秒</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">数据保留天数</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      defaultValue="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">异常重试次数</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded" defaultValue="3" />
                  </div>
                </div>
              </div>

              {/* 设备参数 */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <h3 className="font-medium mb-3">设备参数</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">设备地址</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      defaultValue="192.168.1.100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">设备端口</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      defaultValue="502"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">从站地址</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded" defaultValue="1" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">波特率</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded">
                      <option>9600</option>
                      <option>19200</option>
                      <option>38400</option>
                      <option>57600</option>
                      <option>115200</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 校准参数 */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium mb-3">传感器校准参数</h3>
                <div className="space-y-3">
                  {sensorData.slice(0, 3).map((sensor, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium w-20">{sensor.name}:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">偏移量</span>
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          defaultValue="0"
                          step="0.1"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">系数</span>
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          defaultValue="1.0"
                          step="0.01"
                        />
                      </div>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">
                        校准
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">重置默认</button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">保存配置</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
