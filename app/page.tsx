"use client"

import { useState } from "react"
import DirectoryTree from "@/components/DirectoryTree"
import DeviceViewer from "@/components/DeviceViewer"
import ZoneViewer from "@/components/ZoneViewer"

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<any>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleNodeSelect = (node: any) => {
    setSelectedNode(node)
  }

  const handleNodeAction = (action: string, node: any) => {
    console.log(`执行操作: ${action} on ${node.label}`)

    switch (action) {
      case "configure":
      case "view-monitor":
      case "remote-connect":
      case "view-logs":
        setSelectedNode(node)
        break
      case "delete":
        if (confirm(`确定要删除 ${node.label} 吗？`)) {
          console.log(`删除节点: ${node.label}`)
        }
        break
      case "rename":
        const newName = prompt("请输入新名称:", node.label)
        if (newName && newName !== node.label) {
          console.log(`重命名 ${node.label} 为 ${newName}`)
        }
        break
      case "add-zone":
        const zoneName = prompt("请输入区域名称:")
        if (zoneName) {
          console.log(`在 ${node.label} 中添加区域: ${zoneName}`)
        }
        break
      case "add-device":
        const deviceName = prompt("请输入设备名称:")
        if (deviceName) {
          console.log(`在 ${node.label} 中添加设备: ${deviceName}`)
        }
        break
      default:
        console.log(`操作 ${action} 暂未实现`)
    }
  }

  const handleGlobalDragStart = () => setIsDragging(true)
  const handleGlobalDragEnd = () => setIsDragging(false)

  return (
    <div
      className="h-screen bg-gray-100 flex flex-col"
      onDragStart={handleGlobalDragStart}
      onDragEnd={handleGlobalDragEnd}
    >
      {/* 拖拽提示 */}
      {isDragging && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            拖拽设备到目标区域
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧目录树 */}
        <div className="w-80 bg-white border-r">
          <DirectoryTree onNodeSelect={handleNodeSelect} onNodeAction={handleNodeAction} />
        </div>

        {/* 右侧内容区域 */}
        <main className="flex-1 flex flex-col">
          {selectedNode ? (
            selectedNode.category === "DEVICE" ? (
              <DeviceViewer node={selectedNode} />
            ) : (
              <ZoneViewer node={selectedNode} />
            )
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 text-gray-400 mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-600 mb-2">请选择一个节点</h2>
                <p className="text-gray-500 mb-4">从左侧目录树中选择一个区域或设备查看详情</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 底部状态栏 */}
      <footer className="bg-white border-t px-4 py-2 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span>系统就绪</span>
          {selectedNode && (
            <>
              <span>
                当前选中: {selectedNode.label} ({selectedNode.category === "ZONE" ? "区域" : "设备"})
              </span>
              {selectedNode.category === "DEVICE" && selectedNode.status && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${selectedNode.status.online ? "bg-green-500" : "bg-gray-400"}`}
                    ></div>
                    <span>{selectedNode.status.online ? "在线" : "离线"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${selectedNode.status.alert ? "bg-red-500" : "bg-gray-400"}`}
                    ></div>
                    <span>{selectedNode.status.alert ? "告警" : "正常"}</span>
                  </div>
                </div>
              )}
            </>
          )}
          {isDragging && <span className="text-blue-600">拖拽模式</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>最后更新: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  )
}
