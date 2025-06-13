"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { DeviceDetail } from "@/components/device-detail"

export default function IoTDashboard() {
  const [selectedView, setSelectedView] = useState<"overview" | "device">("overview")
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDevice(deviceId)
    setSelectedView("device")
  }

  const handleBackToOverview = () => {
    setSelectedView("overview")
    setSelectedDevice(null)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        onDeviceSelect={handleDeviceSelect}
        selectedDevice={selectedDevice}
        onOverviewSelect={handleBackToOverview}
      />
      <main className="flex-1 overflow-auto">
        {selectedView === "overview" ? (
          <DashboardOverview onDeviceSelect={handleDeviceSelect} />
        ) : (
          <DeviceDetail deviceId={selectedDevice!} onBack={handleBackToOverview} />
        )}
      </main>
    </div>
  )
}
