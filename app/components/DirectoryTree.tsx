"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  FolderOpen,
  Folder,
  Building2,
  Cpu,
  Monitor,
  Server,
  Router,
  Camera,
  Smartphone,
  Printer,
  HardDrive,
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
                  label: "服务器-01",
                  category: "DEVICE",
                  product: "SERVER",
                  disabled: false,
                  status: { online: true, alert: false },
                },
                {
                  id: 202,
                  label: "工作站-01",
                  category: "DEVICE",
                  product: "WORKSTATION",
                  disabled: false,
                  status: { online: true, alert: true },
                },
                {
                  id: 203,
                  label: "网络摄像头-01",
                  category: "DEVICE",
                  product: "CAMERA",
                  disabled: false,
                  status: { online: false, alert: false },
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
            {
              id: 105,
              label: "测试部门",
              category: "ZONE",
              product: null,
              disabled: false,
              children: [
                {
                  id: 206,
                  label: "测试服务器-01",
                  category: "DEVICE",
                  product: "SERVER",
                  disabled: false,
                  status: { online: true, alert: false },
                },
                {
                  id: 207,
                  label: "移动设备-01",
                  category: "DEVICE",
                  product: "MOBILE",
                  disabled: false,
                  status: { online: false, alert: true },
                },
              ],
            },
            {
              id: 106,
              label: "财务部门",
              category: "ZONE",
              product: null,
              disabled: false,
              children: [
                {
                  id: 208,
                  label: "存储设备-01",
                  category: "DEVICE",
                  product: "STORAGE",
                  disabled: false,
                  status: { online: true, alert: false },
                },
              ],
            },
            {
              id: 107,
              label: "运维部门",
              category: "ZONE",
              product: null,
              disabled: false,
              children: [
                {
                  id: 209,
                  label: "监控服务器-01",
                  category: "DEVICE",
                  product: "SERVER",
                  disabled: false,
                  status: { online: true, alert: false },
                },
                {
                  id: 210,
                  label: "网络交换机-01",
                  category: "DEVICE",
                  product: "SWITCH",
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
            {
              id: 109,
              label: "财务部门",
              category: "ZONE",
              product: null,
              disabled: false,
              children: [
                {
                  id: 212,
                  label: "财务服务器-01",
                  category: "DEVICE",
                  product: "SERVER",
                  disabled: false,
                  status: { online: false, alert: true },
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

  // 根据设备类型获取图标
  const getDeviceIcon = (product: string | null) => {
    if (!product) return Folder

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
    return iconMap[product] || iconMap.default
  }

  // 根据类型获取颜色
  const getNodeColor = (category: string, product: string | null) => {
    if (category === "ZONE") {
      return "text-blue-600"
    }

    // 设备类型颜色
    const colorMap: Record<string, string> = {
      SERVER: "text-green-600",
      WORKSTATION: "text-purple-600",
      ROUTER: "text-orange-600",
      SWITCH: "text-orange-500",
      CAMERA: "text-pink-600",
      PRINTER: "text-gray-600",
      MOBILE: "text-indigo-600",
      STORAGE: "text-yellow-600",
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

  // 状态指示器组件
  const StatusIndicator = ({ status }: { status: { online: boolean; alert: boolean } }) => {
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

  // 树节点组件
  const TreeNodeComponent = ({ node, level }: { node: TreeNode; level: number }) => {
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
              <TreeNodeComponent key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          组织架构与设备
        </h2>

        {/* 状态说明 */}
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
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

      <div className="flex-1 p-2 overflow-auto">
        {treeData.map((item) => (
          <TreeNodeComponent key={item.id} node={item} level={0} />
        ))}
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
