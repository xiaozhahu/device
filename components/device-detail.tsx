"use client"

import { ArrowLeft, Wifi, AlertTriangle, Settings, BarChart3, Shield, Wrench, Database, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DeviceDetailProps {
  deviceId: string
  onBack: () => void
}

export function DeviceDetail({ deviceId, onBack }: DeviceDetailProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-3">
          <Wifi className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">气象站-01</h1>
            <p className="text-sm text-gray-500">气象站 • ID: 201</p>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <Badge variant="secondary">离线</Badge>
          <Badge variant="secondary">正常</Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="basic" className="flex items-center space-x-1">
            <Settings className="w-4 h-4" />
            <span>基础信息</span>
          </TabsTrigger>
          <TabsTrigger value="realtime" className="flex items-center space-x-1">
            <BarChart3 className="w-4 h-4" />
            <span>实时数据</span>
          </TabsTrigger>
          <TabsTrigger value="alarms" className="flex items-center space-x-1">
            <AlertTriangle className="w-4 h-4" />
            <span>告警配置</span>
          </TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center space-x-1">
            <Wrench className="w-4 h-4" />
            <span>自动配置</span>
          </TabsTrigger>
          <TabsTrigger value="remote" className="flex items-center space-x-1">
            <Shield className="w-4 h-4" />
            <span>远程控制</span>
          </TabsTrigger>
          <TabsTrigger value="params" className="flex items-center space-x-1">
            <Database className="w-4 h-4" />
            <span>参数配置</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>参数配置</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          {/* Device Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>设备信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">设备名称:</span>
                    <span className="font-medium">气象站-01</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">设备类型:</span>
                    <span className="font-medium">气象站</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IP地址:</span>
                    <span className="font-medium">192.168.1.11</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">固件版本:</span>
                    <span className="font-medium">v2.1.1</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">设备ID:</span>
                    <span className="font-medium">201</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">产品型号:</span>
                    <span className="font-medium">WEATHER_STATION</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">设备编号:</span>
                    <span className="font-medium">IOT-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">安装日期:</span>
                    <span className="font-medium">2023-10-6</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>设备状态</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="flex items-center space-x-2 text-lg font-medium mb-4">
                    <Wifi className="w-5 h-5" />
                    <span>连接状态</span>
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">设备离线</p>
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center space-x-2 text-lg font-medium mb-4">
                    <AlertTriangle className="w-5 h-5" />
                    <span>告警状态</span>
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">运行正常</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime">
          <Card>
            <CardHeader>
              <CardTitle>实时数据</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">实时数据监控面板</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alarms">
          <Card>
            <CardHeader>
              <CardTitle>告警配置</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">告警规则配置</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto">
          <Card>
            <CardHeader>
              <CardTitle>自动配置</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">自动化配置选项</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remote">
          <Card>
            <CardHeader>
              <CardTitle>远程控制</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">远程控制面板</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="params">
          <Card>
            <CardHeader>
              <CardTitle>参数配置</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">设备参数配置</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>用户配置</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">用户权限配置</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
