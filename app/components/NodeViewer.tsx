"use client"

import {
  Building2,
  Server,
  Monitor,
  Router,
  Camera,
  Printer,
  Smartphone,
  HardDrive,
  Cpu,
  Settings,
  Activity,
  Wifi,
  AlertTriangle,
} from "lucide-react"

interface TreeNode {
  id: number
  label: string
  category: string
  product: string | null
  disabled: boolean
  children?: TreeNode[]
  status?: {
    online: boolean
    alert: boolean
  }
}

interface NodeViewerProps {
  node: TreeNode
}

export default function NodeViewer({ node }: NodeViewerProps) {
  const getNodeIcon = () => {
    if (node.category === "ZONE") {
      return Building2
    }

    const iconMap: Record<string, any> = {
      SERVER: Server,
      WORKSTATION: Monitor,
      ROUTER: Router,
      SWITCH: Router,
      CAMERA: Camera,
      PRINTER: Printer,
      MOBILE: Smartphone,
      STORAGE: HardDrive,
      default: Cpu,
    }
    return iconMap[node.product || "default"] || iconMap.default
  }

  const getNodeTypeLabel = () => {
    if (node.category === "ZONE") {
      return "组织区域"
    }

    const typeMap: Record<string, string> = {
      SERVER: "服务器",
      WORKSTATION: "工作站",
      ROUTER: "路由器",
      SWITCH: "交换机",
      CAMERA: "网络摄像头",
      PRINTER: "打印机",
      MOBILE: "移动设备",
      STORAGE: "存储设备",
      default: "未知设备",
    }
    return typeMap[node.product || "default"] || typeMap.default
  }

  const IconComponent = getNodeIcon()

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 节点信息头部 */}
      <div className="border-b bg-gray-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <IconComponent className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{node.label}</h1>
            <p className="text-sm text-gray-600">
              {getNodeTypeLabel()} • ID: {node.id}
            </p>
          </div>
          {node.category === "DEVICE" && node.status && (
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

      {/* 节点详细信息 */}
      <div className="flex-1 overflow-auto p-6">
        {node.category === "ZONE" ? (
          // 区域信息
          <div className="space-y-6">
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
                  <span className="text-gray-600">子区域数量:</span>
                  <span className="ml-2 font-medium">
                    {node.children?.filter((child) => child.category === "ZONE").length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">设备数量:</span>
                  <span className="ml-2 font-medium">
                    {node.children?.filter((child) => child.category === "DEVICE").length || 0}
                  </span>
                </div>
              </div>
            </div>

            {node.children && node.children.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">子项目</h3>
                <div className="space-y-2">
                  {node.children.map((child) => (
                    <div key={child.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {child.category === "ZONE" ? (
                        <Building2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        (() => {
                          const ChildIcon = getNodeIcon()
                          return <ChildIcon className="w-5 h-5 text-gray-600" />
                        })()
                      )}
                      <span className="font-medium">{child.label}</span>
                      <span className="text-sm text-gray-500">
                        ({child.category === "ZONE" ? "区域" : getNodeTypeLabel()})
                      </span>
                      {child.status && (
                        <div className="ml-auto flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${child.status.online ? "bg-green-500" : "bg-gray-400"}`}
                          ></div>
                          <div
                            className={`w-2 h-2 rounded-full ${child.status.alert ? "bg-red-500" : "bg-gray-400"}`}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // 设备信息
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
                  <span className="ml-2 font-medium">{getNodeTypeLabel()}</span>
                </div>
                <div>
                  <span className="text-gray-600">产品型号:</span>
                  <span className="ml-2 font-medium">{node.product || "未知"}</span>
                </div>
              </div>
            </div>

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
                  </div>
                  <div className={`p-3 rounded-lg ${node.status.alert ? "bg-red-100" : "bg-gray-100"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className={`w-4 h-4 ${node.status.alert ? "text-red-600" : "text-gray-500"}`} />
                      <span className="font-medium">告警状态</span>
                    </div>
                    <p className={`text-sm ${node.status.alert ? "text-red-600" : "text-gray-500"}`}>
                      {node.status.alert ? "设备告警" : "运行正常"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                操作面板
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-800">设备配置</div>
                  <div className="text-sm text-gray-600">修改设备参数</div>
                </button>
                <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-800">状态监控</div>
                  <div className="text-sm text-gray-600">查看实时状态</div>
                </button>
                <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-800">日志查看</div>
                  <div className="text-sm text-gray-600">查看操作日志</div>
                </button>
                <button className="p-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors text-left">
                  <div className="font-medium text-gray-800">远程控制</div>
                  <div className="text-sm text-gray-600">远程操作设备</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
