'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Quote } from 'lucide-react'

interface Testimonial {
  quote: string
  author: string
  role: string
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <Card key={index} className="relative">
          <CardContent className="pt-6">
            <Quote className="absolute top-4 left-4 h-8 w-8 text-slate-200 dark:text-slate-800" />
            <p className="text-slate-700 dark:text-slate-300 mb-4 relative z-10">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {testimonial.author[0]}
              </div>
              <div>
                <p className="font-semibold text-sm">{testimonial.author}</p>
                <p className="text-xs text-slate-500">{testimonial.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
