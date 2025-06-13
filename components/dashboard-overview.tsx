import { Building2, Monitor, Wifi, WifiOff, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardOverviewProps {
  onDeviceSelect: (deviceId: string) => void
}

export function DashboardOverview({ onDeviceSelect }: DashboardOverviewProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Building2 className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">南京万宏</h1>
          <p className="text-sm text-gray-500">组织区域 • ID: 100</p>
        </div>
      </div>

      {/* Region Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>区域信息</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">区域名称:</span>
                <span className="font-medium">南京万宏</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">区域类型:</span>
                <span className="font-medium">组织架构</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">创建时间:</span>
                <span className="font-medium">2023-5-17</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">区域ID:</span>
                <span className="font-medium">100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">管理员:</span>
                <span className="font-medium">系统管理员</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">最后更新:</span>
                <span className="font-medium">2025/6/13</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" />
            <span>统计面板</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">子区域</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Monitor className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">总设备</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Wifi className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">在线设备</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <WifiOff className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-red-600">0</div>
              <div className="text-sm text-gray-600">告警设备</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Device Type Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>设备类型分析</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-gray-400">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>暂无设备数据</p>
                <p className="text-sm">暂无图例数据</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alarms Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>近七日告警趋势</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Chart area */}
              <div className="h-32 flex items-end justify-between space-x-1">
                {["06/07", "06/08", "06/09", "06/10", "06/11", "06/12", "06/13"].map((date, index) => (
                  <div key={date} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-red-200 rounded-t" style={{ height: `${Math.random() * 60 + 10}px` }} />
                    <span className="text-xs text-gray-500 mt-1">{date}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center space-x-1 text-xs text-gray-500">
                <span>告警次数</span>
                <span className="ml-8">2</span>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">5</div>
                  <div className="text-xs text-gray-500">七日总计</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">0.7</div>
                  <div className="text-xs text-gray-500">日均告警</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">2</div>
                  <div className="text-xs text-gray-500">单日最高</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
