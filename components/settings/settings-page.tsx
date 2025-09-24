

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Bell, Shield, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

export function SettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and emergency response preferences</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-500" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sms-alerts">SMS Emergency Alerts</Label>
                <p className="text-sm text-gray-600">Receive text message alerts for emergencies</p>
              </div>
              <Switch id="sms-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-alerts">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive email updates and reports</p>
              </div>
              <Switch id="email-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Emergency Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="emergency-contact">Primary Emergency Contact</Label>
              <Input id="emergency-contact" placeholder="Phone number" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medical-info">Medical Information</Label>
              <Input id="medical-info" placeholder="Allergies, medications, etc." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-purple-500" />
              Location & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location-sharing">Share Location During Emergencies</Label>
                <p className="text-sm text-gray-600">Allow responders to see your exact location</p>
              </div>
              <Switch id="location-sharing" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="data-consent">Emergency Data Consent</Label>
                <p className="text-sm text-gray-600">Consent to share health data during emergencies</p>
              </div>
              <Switch id="data-consent" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => alert('Settings saved successfully!')}>Save Settings</Button>
      </div>
    </div>
  )
}
