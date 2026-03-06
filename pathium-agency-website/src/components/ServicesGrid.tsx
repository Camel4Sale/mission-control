'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface Service {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

export function ServicesGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {services.map((service, index) => {
        const Icon = service.icon
        return (
          <Card key={index} className="group hover:shadow-lg transition-all hover:-translate-y-1">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">{service.title}</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="#contact" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
