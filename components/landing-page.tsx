
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Heart, 
  Users, 
  Brain, 
  Phone, 
  MapPin, 
  Activity,
  Star,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function LandingPage() {
  const features = [
    {
      icon: Brain,
      title: 'AI Guardian Angels',
      description: 'Personal AI agents that monitor your wellbeing 24/7 and provide supportive conversations'
    },
    {
      icon: Activity,
      title: 'Biometric Monitoring',
      description: 'Real-time health tracking with smart alerts when something seems off'
    },
    {
      icon: Users,
      title: 'Response Network',
      description: 'Connect with trained friends, family, and volunteers who can help in emergencies'
    },
    {
      icon: MapPin,
      title: 'Smart Coordination',
      description: 'GPS-enabled emergency response with real-time location sharing and routing'
    },
    {
      icon: Heart,
      title: 'Recovery Support',
      description: 'Social network and Tree of Life visualization to track your journey'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is protected with consent-based sharing and emergency-only access'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Recovery Champion',
      content: 'The AI companion helped me through my darkest moments. Having 24/7 support made all the difference.',
      days: 180
    },
    {
      name: 'Mike C.',
      role: 'Emergency Responder',
      content: 'As a responder, this system gives me the tools and information I need to help effectively.',
      verified: true
    },
    {
      name: 'Jennifer L.',
      role: 'Family Member',
      content: 'Finally, peace of mind knowing my daughter has a safety net that actually works.',
      relationship: 'Mother'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LifeSaver ERN</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                How It Works
              </Link>
              <Link href="#community" className="text-gray-600 hover:text-blue-600 transition-colors">
                Community
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                  Get Protected
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center bg-blue-50 rounded-full px-4 py-2 mb-6">
                <Zap className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-blue-700 text-sm font-medium">AI-Powered Emergency Response</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Your Life Has
                <span className="text-blue-600 block">Guardian Angels</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Advanced AI monitoring, instant emergency response, and a network of trained responders 
                who care about your recovery journey. Never face a crisis alone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                    Start Your Protection <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/emergency/go-button">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Emergency Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center mt-8 space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">AI Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">&lt;2min</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Guardian Angel AI</div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Online & Monitoring</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">AI Message</div>
                    <div className="text-gray-900">Hey! I noticed your heart rate elevated. Everything okay? 💙</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 ml-8">
                    <div className="text-sm text-blue-600 mb-1">You</div>
                    <div className="text-gray-900">Just finished a workout, feeling great!</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">AI Response</div>
                    <div className="text-gray-900">Awesome! Keep up the healthy habits. I'm here if you need me.</div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <Link href="/emergency/go-button">
                    <Button className="bg-red-500 hover:bg-red-600 text-white px-6">
                      🚨 Emergency GO Button
                    </Button>
                  </Link>
                  <div className="text-xs text-gray-500">
                    Response Network: 3 people nearby
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-green-100 rounded-full p-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-5 w-5 text-green-600" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 bg-blue-100 rounded-full p-3"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Users className="h-5 w-5 text-blue-600" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Protection System
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed to keep you safe, support your recovery, and connect you with help when needed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three-Tier Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Smart escalation system that provides the right level of support at the right time
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mb-4">
                GREEN - Normal
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Continuous Monitoring</h3>
              <p className="text-gray-600">
                Your AI guardian tracks biometrics and provides supportive conversations. 
                Regular check-ins ensure you're doing well.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-yellow-600">2</span>
              </div>
              <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mb-4">
                YELLOW - Check-In
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Intervention</h3>
              <p className="text-gray-600">
                When patterns change or thresholds are crossed, your AI reaches out for 
                immediate support and coping strategies.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <div className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mb-4">
                RED - Emergency
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Human Response</h3>
              <p className="text-gray-600">
                When human help is needed, trained responders are instantly notified 
                with your location and vital information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section id="community" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Stories of Hope & Recovery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real people sharing their journey with the LifeSaver community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                      {testimonial.days && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{testimonial.days}</div>
                          <div className="text-xs text-gray-500">days clean</div>
                        </div>
                      )}
                      {testimonial.verified && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Verified Responder
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-sky-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Never Face Crisis Alone?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands who have transformed their recovery with AI protection and human connection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                  Start Free Protection <Shield className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
                  <Globe className="mr-2 h-5 w-5" />
                  View Live Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm mt-4 opacity-75">
              Free to start • No credit card required • HIPAA compliant
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">LifeSaver ERN</span>
              </div>
              <p className="text-gray-400 text-sm">
                Saving lives through AI-powered emergency response and recovery support.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Emergency</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>24/7 Crisis Line</div>
                <div>Emergency Response</div>
                <div>Medical Support</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Recovery Community</div>
                <div>Training Resources</div>
                <div>Family Support</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Safety</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>Privacy Protection</div>
                <div>Data Security</div>
                <div>Emergency Protocols</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 LifeSaver ERN. Dedicated to saving lives and supporting recovery.
          </div>
        </div>
      </footer>
    </div>
  )
}
