"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Folder,
  FolderOpen,
  Server,
  Monitor,
  Router,
  Camera,
  Printer,
  HardDrive,
  Cpu,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Plus,
  FolderPlus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Settings,
  Search,
  X,
} from "lucide-react"
import StatusIndicator from "./StatusIndicator"

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

interface DirectoryTreeProps {
  onNodeSelect?: (node: TreeNode) => void
  onNodeAction?: (action: string, node: TreeNode) => void
}

export default function DirectoryTree({ onNodeSelect, onNodeAction }: DirectoryTreeProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>([
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
                  label: "气象站-01",
                  category: "DEVICE",
                  product: "WEATHER_STATION",
                  disabled: false,
                  status: { online: true, alert: false },
                },
                {
                  id: 202,
                  label: "墒情站-01",
                  category: "DEVICE",
                  product: "SOIL_STATION",
                  disabled: false,
                  status: { online: true, alert: true },
                },
                {
                  id: 203,
                  label: "灌溉站-01",
                  category: "DEVICE",
                  product: "IRRIGATION_STATION",
                  disabled: false,
                  status: { online: false, alert: false },
                },
                {
                  id: 206,
                  label: "温室大棚-01",
                  category: "DEVICE",
                  product: "GREENHOUSE",
                  disabled: false,
                  status: { online: true, alert: false },
                },
                {
                  id: 207,
                  label: "径流检测站-02",
                  category: "DEVICE",
                  product: "RUNOFF_DETECTION",
                  disabled: false,
                  status: { online: false, alert: true },
                },
              ],
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
                  status: { online: true, alert: false },
                },
                {
                  id: 205,
                  label: "路由器-01",
                  category: "DEVICE",
                  product: "ROUTER",
                  disabled: false,
                  status: { online: true, alert: true },
                },
              ],
            },
          ],
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
                  status: { online: true, alert: false },
                },
              ],
            },
          ],
        },
      ],
    },
  ])

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set([100, 101]))
  const [dropdownMenu, setDropdownMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    node: null as TreeNode | null,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<TreeNode[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 模拟设备状态变化
  useEffect(() => {
    const interval = setInterval(() => {
      setTreeData((prevData) => {
        const newData = JSON.parse(JSON.stringify(prevData))

        const updateDeviceStatus = (nodes: TreeNode[]) => {
          nodes.forEach((node) => {
            if (node.category === "DEVICE" && node.status && Math.random() < 0.15) {
              // 15% 概率改变设备状态
              if (Math.random() < 0.3) {
                node.status.online = !node.status.online
              }
              if (Math.random() < 0.2) {
                node.status.alert = !node.status.alert
              }
            }
            if (node.children) {
              updateDeviceStatus(node.children)
            }
          })
        }

        updateDeviceStatus(newData)
        return newData
      })
    }, 4000) // 每4秒随机更新设备状态

    return () => clearInterval(interval)
  }, [])

  // 搜索功能
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results: TreeNode[] = []

    const searchNodes = (nodes: TreeNode[], term: string) => {
      nodes.forEach((node) => {
        if (node.label.toLowerCase().includes(term.toLowerCase())) {
          results.push(node)
        }
        if (node.children) {
          searchNodes(node.children, term)
        }
      })
    }

    searchNodes(treeData, searchTerm)
    setSearchResults(results)
  }, [searchTerm, treeData])

  // 根据设备类型获取图标
  const getDeviceIcon = (product: string | null) => {
    if (!product) return Folder

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
    return iconMap[product] || iconMap.default
  }

  // 根据类型获取颜色
  const getNodeColor = (category: string, product: string | null) => {
    if (category === "ZONE") {
      return "text-blue-600"
    }

    // 设备类型颜色
    const colorMap: Record<string, string> = {
      WEATHER_STATION: "text-blue-600",
      SOIL_STATION: "text-green-600",
      IRRIGATION_STATION: "text-orange-600",
      RUNOFF_STATION: "text-purple-600",
      HYDRO_STATION: "text-cyan-600",
      SEDIMENT_STATION: "text-yellow-600",
      GREENHOUSE: "text-emerald-600",
      RUNOFF_DETECTION: "text-indigo-600",
      default: "text-gray-500",
    }
    return colorMap[product || "default"] || colorMap.default
  }

  // 切换节点展开/收起
  const toggleNode = (nodeId: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  // 选择节点
  const selectNode = (node: TreeNode) => {
    setSelectedNode(node)
    onNodeSelect?.(node)
  }

  // 显示下拉菜单
  const showDropdownMenu = (event: React.MouseEvent, node: TreeNode) => {
    event.stopPropagation()
    const rect = event.currentTarget.getBoundingClientRect()
    setDropdownMenu({
      show: true,
      x: rect.left - 160,
      y: rect.bottom + 4,
      node,
    })
  }

  // 隐藏下拉菜单
  const hideDropdownMenu = () => {
    setDropdownMenu({ show: false, x: 0, y: 0, node: null })
  }

  // 获取菜单选项
  const getMenuActions = (node: TreeNode) => {
    if (node.category === "ZONE") {
      // 区域/项目菜单
      return [
        { label: "添加子区域", icon: FolderPlus, action: "add-zone" },
        { label: "添加设备", icon: Plus, action: "add-device" },
        { label: "重命名", icon: Edit, action: "rename" },
        { label: "复制", icon: Copy, action: "copy" },
        { label: "删除", icon: Trash2, action: "delete" },
      ]
    } else {
      // 设备菜单
      const commonActions = [
        { label: "设备配置", icon: Settings, action: "configure" },
        { label: "重命名", icon: Edit, action: "rename" },
        { label: "复制", icon: Copy, action: "copy" },
        { label: "删除", icon: Trash2, action: "delete" },
      ]

      // 根据设备类型添加特定操作
      if (node.product === "CAMERA") {
        return [{ label: "查看监控", icon: Eye, action: "view-monitor" }, ...commonActions]
      } else if (node.product === "SERVER") {
        return [
          { label: "远程连接", icon: Monitor, action: "remote-connect" },
          { label: "查看日志", icon: Eye, action: "view-logs" },
          ...commonActions,
        ]
      } else if (["ROUTER", "SWITCH"].includes(node.product || "")) {
        return [{ label: "网络配置", icon: Settings, action: "network-config" }, ...commonActions]
      }

      return commonActions
    }
  }

  // 处理菜单操作
  const handleMenuAction = (action: any, node: TreeNode) => {
    onNodeAction?.(action.action, node)
    hideDropdownMenu()
  }

  // 树节点组件
  const TreeNode = ({ node, level }: { node: TreeNode; level: number }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)
    const isSelected = selectedNode?.id === node.id
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const IconComponent =
      node.category === "ZONE" ? (hasChildren && isExpanded ? FolderOpen : Folder) : getDeviceIcon(node.product)

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData("text/plain", JSON.stringify(node))
      e.dataTransfer.effectAllowed = "move"
      setTimeout(() => {
        const dragElement = e.target as HTMLElement
        dragElement.style.opacity = "0.5"
      }, 0)
    }

    const handleDragEnd = (e: React.DragEvent) => {
      const dragElement = e.target as HTMLElement
      dragElement.style.opacity = "1"
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"

      // 只有区域可以作为拖拽目标
      if (node.category === "ZONE") {
        setIsDragOver(true)
      }
    }

    const handleDragLeave = (e: React.DragEvent) => {
      setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      if (node.category !== "ZONE") return

      try {
        const draggedNodeData = JSON.parse(e.dataTransfer.getData("text/plain"))

        if (draggedNodeData.id === node.id) return

        console.log(`移动 ${draggedNodeData.label} 到 ${node.label}`)
        // 这里可以实现实际的移动逻辑
      } catch (error) {
        console.error("拖拽处理失败:", error)
      }
    }

    return (
      <div>
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors group ${
            isSelected ? "bg-blue-100 border-l-2 border-blue-500" : ""
          } ${isDragOver ? "bg-green-100 border-2 border-green-400 border-dashed" : "hover:bg-gray-100"} ${
            node.disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          draggable={!node.disabled}
          onClick={() => !node.disabled && selectNode(node)}
          onDoubleClick={() => !node.disabled && hasChildren && toggleNode(node.id)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* 展开/收起图标 */}
          <div className="w-4 h-4 flex items-center justify-center">
            {hasChildren && isExpanded && <ChevronDown className="w-3 h-3 text-gray-500" />}
            {hasChildren && !isExpanded && <ChevronRight className="w-3 h-3 text-gray-500" />}
          </div>

          {/* 节点图标 */}
          <IconComponent className={`w-4 h-4 ${getNodeColor(node.category, node.product)}`} />

          {/* 节点名称 */}
          <span className="text-sm text-gray-800 flex-1 truncate">{node.label}</span>

          {/* 设备状态指示器 */}
          {node.category === "DEVICE" && node.status && <StatusIndicator status={node.status} />}

          {/* 操作菜单按钮 */}
          {!node.disabled && (
            <button
              className={`w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-all ${
                isHovered || isSelected ? "opacity-100" : "opacity-0"
              }`}
              onClick={(e) => showDropdownMenu(e, node)}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // 搜索结果组件
  const SearchResultItem = ({ node }: { node: TreeNode }) => {
    const IconComponent = node.category === "ZONE" ? Folder : getDeviceIcon(node.product)

    return (
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          selectNode(node)
          setSearchTerm("")
        }}
      >
        <IconComponent className={`w-4 h-4 ${getNodeColor(node.category, node.product)}`} />
        <span className="text-sm flex-1 truncate">{node.label}</span>
        <span className="text-xs text-gray-500">{node.category === "ZONE" ? "区域" : "设备"}</span>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* 搜索框 */}
      <div className="p-3 border-b">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索节点..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchTerm && (
            <button
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchTerm("")}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 搜索结果或树形内容 */}
      <div className="flex-1 overflow-auto">
        {isSearching && searchResults.length > 0 ? (
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">找到 {searchResults.length} 个结果</div>
            <div className="border rounded-md overflow-hidden">
              {searchResults.map((node) => (
                <SearchResultItem key={node.id} node={node} />
              ))}
            </div>
          </div>
        ) : isSearching && searchResults.length === 0 ? (
          <div className="p-4 text-center text-gray-500">未找到匹配的结果</div>
        ) : (
          <div className="p-2">
            {treeData.map((item) => (
              <TreeNode key={item.id} node={item} level={0} />
            ))}
          </div>
        )}
      </div>

      {/* 状态说明 */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500">
        <div className="flex items-center justify-around">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>在线</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>离线</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>告警</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>正常</span>
          </div>
        </div>
      </div>

      {/* 下拉菜单 */}
      {dropdownMenu.show && dropdownMenu.node && (
        <>
          <div
            className="fixed bg-white border rounded-lg shadow-lg py-1 z-50 min-w-40"
            style={{ top: `${dropdownMenu.y}px`, left: `${dropdownMenu.x}px` }}
            onClick={(e) => e.stopPropagation()}
          >
            {getMenuActions(dropdownMenu.node).map((action) => {
              const IconComponent = action.icon
              return (
                <div
                  key={action.label}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm text-gray-700"
                  onClick={() => handleMenuAction(action, dropdownMenu.node!)}
                >
                  <IconComponent className="w-4 h-4" />
                  {action.label}
                </div>
              )
            })}
          </div>
          <div className="fixed inset-0 z-40" onClick={hideDropdownMenu} />
        </>
      )}
    </div>
  )
}
