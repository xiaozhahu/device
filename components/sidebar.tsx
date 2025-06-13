"use client"

import { Search, ChevronDown, ChevronRight, Building2, Wifi, WifiOff, AlertTriangle, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface SidebarProps {
  onDeviceSelect: (deviceId: string) => void
  selectedDevice: string | null
  onOverviewSelect: () => void
}

export function Sidebar({ onDeviceSelect, selectedDevice, onOverviewSelect }: SidebarProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["nanjing", "shenzhen", "research"]))

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const getStatusIcon = (status: "online" | "offline" | "warning" | "normal") => {
    switch (status) {
      case "online":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "offline":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      case "warning":
        return <div className="w-2 h-2 bg-orange-500 rounded-full" />
      case "normal":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
    }
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="搜索节点..." className="pl-10" />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-1">
          {/* 南京万宏 */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
              onClick={() => {
                toggleNode("nanjing")
                onOverviewSelect()
              }}
            >
              {expandedNodes.has("nanjing") ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )}
              <Building2 className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm">南京万宏</span>
            </Button>

            {expandedNodes.has("nanjing") && (
              <div className="ml-4 space-y-1">
                {/* 深圳总公司 */}
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => toggleNode("shenzhen")}
                >
                  {expandedNodes.has("shenzhen") ? (
                    <ChevronDown className="w-4 h-4 mr-1" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-1" />
                  )}
                  <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">深圳总公司</span>
                </Button>

                {expandedNodes.has("shenzhen") && (
                  <div className="ml-4 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-2 h-auto"
                      onClick={() => toggleNode("research")}
                    >
                      {expandedNodes.has("research") ? (
                        <ChevronDown className="w-4 h-4 mr-1" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-1" />
                      )}
                      <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-sm">研发部门</span>
                    </Button>

                    {expandedNodes.has("research") && (
                      <div className="ml-4 space-y-1">
                        <Button
                          variant={selectedDevice === "weather-01" ? "secondary" : "ghost"}
                          className="w-full justify-start p-2 h-auto"
                          onClick={() => onDeviceSelect("weather-01")}
                        >
                          <div className="flex items-center mr-2">
                            <Wifi className="w-4 h-4 text-blue-500" />
                          </div>
                          <span className="text-sm">气象站-01</span>
                          <div className="ml-auto flex items-center space-x-1">
                            {getStatusIcon("normal")}
                            {getStatusIcon("normal")}
                          </div>
                        </Button>

                        <Button
                          variant={selectedDevice === "network-01" ? "secondary" : "ghost"}
                          className="w-full justify-start p-2 h-auto"
                          onClick={() => onDeviceSelect("network-01")}
                        >
                          <div className="flex items-center mr-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                          <span className="text-sm">网络站-01</span>
                          <div className="ml-auto flex items-center space-x-1">{getStatusIcon("online")}</div>
                        </Button>

                        <Button
                          variant={selectedDevice === "port-01" ? "secondary" : "ghost"}
                          className="w-full justify-start p-2 h-auto"
                          onClick={() => onDeviceSelect("port-01")}
                        >
                          <div className="flex items-center mr-2">
                            <WifiOff className="w-4 h-4 text-orange-500" />
                          </div>
                          <span className="text-sm">港联站-01</span>
                          <div className="ml-auto flex items-center space-x-1">{getStatusIcon("online")}</div>
                        </Button>

                        <Button
                          variant={selectedDevice === "monitoring-01" ? "secondary" : "ghost"}
                          className="w-full justify-start p-2 h-auto"
                          onClick={() => onDeviceSelect("monitoring-01")}
                        >
                          <div className="flex items-center mr-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="text-sm">监管大楼-01</span>
                          <div className="ml-auto flex items-center space-x-1">
                            {getStatusIcon("offline")}
                            {getStatusIcon("offline")}
                          </div>
                        </Button>

                        <Button
                          variant={selectedDevice === "logistics-02" ? "secondary" : "ghost"}
                          className="w-full justify-start p-2 h-auto"
                          onClick={() => onDeviceSelect("logistics-02")}
                        >
                          <div className="flex items-center mr-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          </div>
                          <span className="text-sm">运行物流站-02</span>
                          <div className="ml-auto flex items-center space-x-1">
                            {getStatusIcon("offline")}
                            {getStatusIcon("offline")}
                          </div>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* 市场部门 */}
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => toggleNode("market")}
                >
                  <ChevronRight className="w-4 h-4 mr-1" />
                  <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">市场部门</span>
                </Button>
              </div>
            )}
          </div>

          {/* 长沙分公司 */}
          <Button variant="ghost" className="w-full justify-start p-2 h-auto" onClick={() => toggleNode("changsha")}>
            <ChevronRight className="w-4 h-4 mr-1" />
            <Building2 className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">长沙分公司</span>
          </Button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>在线</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>离线</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>告警</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              <span>正常</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">系统页面 当前选中: 南京万宏 (区域) 最后更新: 17:39:02</div>
      </div>
    </div>
  )
}
