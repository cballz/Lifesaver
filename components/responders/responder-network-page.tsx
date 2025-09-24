

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, Shield, Phone, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function ResponderNetworkPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Responder Network</h1>
          <p className="text-gray-600 mt-2">Manage your emergency response network and Narcan-trained responders</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              My Responders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              These are the people who will be notified in case of an emergency.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    JS
                  </div>
                  <div>
                    <div className="font-medium">John Smith</div>
                    <div className="text-sm text-gray-500">Sponsor • 0.5 miles away</div>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Narcan Trained
                </Badge>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline" onClick={() => alert('Add Responder functionality coming soon!')}>
              <Users className="h-4 w-4 mr-2" />
              Add Responder
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Community Responders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Trained volunteers in your area ready to respond to emergencies.
            </p>
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">
                Looking for responders within 10 miles of your location
              </p>
              <Button className="mt-4" onClick={() => alert('Responder registration will open soon!')}>
                <Phone className="h-4 w-4 mr-2" />
                Join as Responder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
