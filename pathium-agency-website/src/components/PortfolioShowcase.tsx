'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, DollarSign } from 'lucide-react'

interface Project {
  title: string
  client: string
  result: string
  description: string
  tech: string[]
}

export function PortfolioShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <Card key={index} className="group hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">{project.client}</Badge>
            </div>
            <CardTitle className="text-xl">{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
              <TrendingUp className="h-4 w-4" />
              {project.result}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
