"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import regionsData from '@/data/regions.json'
import { RegionSelector } from "./region-selector"
import { InstanceTable } from "./instance-table"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Region {
  region: string;
  zone: string;
}

export interface LinodeInstance {
  id: number;
  label: string;
  region: string;
  image: string;
  status: string;
}

export function LinodeVpnSetup() {
  const [linodeRegions] = useState<Region[]>(regionsData)
  const [linodeInstances, setLinodeInstances] = useState<LinodeInstance[]>([])
  const [selectedRegion, setSelectedRegion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pollingInstances, setPollingInstances] = useState<Set<number>>(new Set())

  const router = useRouter()
  const [supabase] = useState(() => createClientComponentClient())

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const fetchLinodeInstances = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/instances`)
      const instances: LinodeInstance[] = response.data
      setLinodeInstances(instances)

      instances.forEach((instance) => {
        if (instance.status !== 'running' && !pollingInstances.has(instance.id)) {
          setPollingInstances((prev) => new Set(prev).add(instance.id))
        } else if (instance.status === 'running' && pollingInstances.has(instance.id)) {
          setPollingInstances((prev) => {
            const newSet = new Set(prev)
            newSet.delete(instance.id)
            return newSet
          })
        }
      })
    } catch (error) {
      console.error('Error fetching Linode instances:', error)
      toast({
        title: "Error",
        description: "Failed to fetch Linode instances",
        variant: "destructive",
      })
    }
  }, [pollingInstances])

  useEffect(() => {
    fetchLinodeInstances()
    const intervalId = setInterval(() => {
      if (pollingInstances.size > 0) {
        fetchLinodeInstances()
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(intervalId)
  }, [fetchLinodeInstances, pollingInstances])

  const handleSetupVPN = async () => {
    if (selectedRegion) {
      setIsLoading(true)
      try {
        const response = await axios.post(`${API_URL}/instances`, { region: selectedRegion })
        toast({
          title: "VPN Setup Initiated",
          description: `New instance created in ${selectedRegion}`,
        })
        setPollingInstances((prev) => new Set(prev).add(response.data.id))
        fetchLinodeInstances()
      } catch (error) {
        console.error('Error setting up VPN:', error)
        toast({
          title: "Error",
          description: "Failed to set up VPN",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: "Error",
        description: "Please select a region first",
        variant: "destructive",
      })
    }
  }

  const handleDeleteInstance = async (instanceId: number) => {
    try {
      await axios.delete(`${API_URL}/instances/${instanceId}`)
      toast({
        title: "Instance Deleted",
        description: "The Linode instance has been successfully deleted.",
      })
      setPollingInstances((prev) => {
        const newSet = new Set(prev)
        newSet.delete(instanceId)
        return newSet
      })
      fetchLinodeInstances()
    } catch (error) {
      console.error('Error deleting Linode instance:', error)
      toast({
        title: "Error",
        description: "Failed to delete the Linode instance",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Linode VPN Setup</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <RegionSelector
          regions={linodeRegions}
          selectedRegion={selectedRegion}
          onRegionSelect={setSelectedRegion}
        />
        <Button onClick={handleSetupVPN} disabled={isLoading}>
          {isLoading ? "Setting up..." : "Setup VPN"}
        </Button>
      </div>

      <InstanceTable
        instances={linodeInstances}
        onDeleteInstance={handleDeleteInstance}
      />
    </div>
  )
}