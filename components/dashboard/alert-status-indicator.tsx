
'use client'

import { motion } from 'framer-motion'
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertStatusIndicatorProps {
  level: 'GREEN' | 'YELLOW' | 'RED'
  size?: 'sm' | 'md' | 'lg'
  showTree?: boolean
}

export function AlertStatusIndicator({ level, size = 'md', showTree = false }: AlertStatusIndicatorProps) {
  const config = {
    GREEN: {
      icon: Shield,
      text: 'All Clear',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    YELLOW: {
      icon: AlertTriangle,
      text: 'Check-In',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    RED: {
      icon: AlertCircle,
      text: 'Emergency',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      borderColor: 'border-red-200'
    }
  }

  const current = config[level]
  const Icon = current.icon

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        className={cn(
          'inline-flex items-center rounded-full border font-medium',
          current.bgColor,
          current.textColor,
          current.borderColor,
          sizeClasses[size]
        )}
        animate={level === 'RED' ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 1, repeat: level === 'RED' ? Infinity : 0 }}
      >
        <Icon className={cn('mr-1', current.iconColor, iconSizes[size])} />
        {current.text}
      </motion.div>
      
      {showTree && (
        <motion.div
          className={cn(
            'relative rounded-full overflow-hidden border-2',
            level === 'RED' ? 'border-red-500' : 
            level === 'YELLOW' ? 'border-yellow-500' : 'border-green-500',
            size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6'
          )}
          animate={level === 'RED' ? { 
            rotate: [0, -2, 2, 0],
            scale: [1, 1.1, 1] 
          } : {}}
          transition={{ duration: 2, repeat: level === 'RED' ? Infinity : 0 }}
        >
          <img
            src={level === 'RED' ? '/treedying.png' : '/tree.jpg'}
            alt={`Tree Status - ${current.text}`}
            className={cn(
              'w-full h-full object-cover',
              level === 'RED' ? 'filter brightness-75 contrast-125' : ''
            )}
          />
          {level === 'RED' && (
            <motion.div
              className="absolute inset-0 bg-red-500/20"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      )}
    </div>
  )
}
