"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Circle, Zap, Database, Globe, Heart } from "lucide-react"

interface RoadmapPhase {
  id: string
  title: string
  period: string
  status: "completed" | "current" | "upcoming"
  icon: React.ReactNode
  description: string
  deliverables: string[]
  position: { x: number; y: number }
}

const roadmapPhases: RoadmapPhase[] = [
  {
    id: "foundation",
    title: "Foundation Phase",
    period: "Days 1-7",
    status: "current",
    icon: <Database className="w-6 h-6" />,
    description: "Core patient ↔ clinician record flow working",
    deliverables: [
      "Nostr relay setup with Docker",
      "Patient & clinician mobile apps",
      "Encrypted record storage (NIP-44)",
      "Consent management system",
      "Record sharing functionality",
    ],
    position: { x: 10, y: 20 },
  },
  {
    id: "build",
    title: "Build Phase",
    period: "Days 8-14",
    status: "upcoming",
    icon: <Zap className="w-6 h-6" />,
    description: "Lightning payments + analytics dashboard",
    deliverables: [
      "Lightning payments integration",
      "Analytics dashboard",
      "Full system integration testing",
      "Demo preparation & pitch deck",
      "UI polish & bug fixes",
    ],
    position: { x: 40, y: 60 },
  },
  {
    id: "scale",
    title: "Scale Phase",
    period: "Q2 2025",
    status: "upcoming",
    icon: <Globe className="w-6 h-6" />,
    description: "Multi-country deployment across Africa",
    deliverables: [
      "Multi-country deployment",
      "FHIR bridge implementation",
      "Integration with OpenMRS & DHIS2",
      "Government partnerships",
      "NGO collaboration network",
    ],
    position: { x: 70, y: 30 },
  },
  {
    id: "ecosystem",
    title: "Ecosystem Phase",
    period: "2025-2026",
    status: "upcoming",
    icon: <Heart className="w-6 h-6" />,
    description: "Pan-African health network",
    deliverables: [
      "Pan-African health network",
      "AI-powered health insights",
      "Telemedicine integration",
      "Health insurance protocols",
      "Population health analytics",
    ],
    position: { x: 90, y: 70 },
  },
]

export default function InteractiveRoadmap() {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "current":
        return "text-primary"
      case "upcoming":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "current":
        return "bg-primary"
      case "upcoming":
        return "bg-muted"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Road SVG */}
      <div className="relative w-full h-96 mb-8">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Road Path */}
          <defs>
            <pattern id="roadPattern" patternUnits="userSpaceOnUse" width="2" height="1">
              <rect width="2" height="1" fill="#374151" />
              <rect width="1" height="0.2" y="0.4" fill="#6B7280" />
            </pattern>
          </defs>

          {/* Main road curve */}
          <path
            d="M 5 25 Q 25 10, 45 65 Q 65 85, 95 75"
            stroke="url(#roadPattern)"
            strokeWidth="8"
            fill="none"
            className="drop-shadow-lg"
          />

          {/* Road center line */}
          <path
            d="M 5 25 Q 25 10, 45 65 Q 65 85, 95 75"
            stroke="#FCD34D"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="2,2"
            className="opacity-80"
          />

          {/* Milestone markers */}
          {roadmapPhases.map((phase, index) => (
            <g key={phase.id}>
              {/* Milestone circle */}
              <circle
                cx={phase.position.x}
                cy={phase.position.y}
                r="4"
                className={`${getStatusBg(phase.status)} cursor-pointer transition-all duration-300 hover:scale-110`}
                onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
              />

              {/* Status indicator */}
              <circle
                cx={phase.position.x}
                cy={phase.position.y}
                r="2"
                fill={phase.status === "completed" ? "#10B981" : phase.status === "current" ? "#F59E0B" : "#6B7280"}
              />

              {/* Phase label */}
              <text
                x={phase.position.x}
                y={phase.position.y - 8}
                textAnchor="middle"
                className="text-xs font-semibold fill-foreground"
              >
                {phase.title.split(" ")[0]}
              </text>
            </g>
          ))}

          {/* Road decorations - trees and landmarks */}
          <g className="opacity-60">
            {/* Trees */}
            <circle cx="15" cy="5" r="2" fill="#10B981" />
            <rect x="14.5" y="7" width="1" height="3" fill="#92400E" />

            <circle cx="80" cy="15" r="2" fill="#10B981" />
            <rect x="79.5" y="17" width="1" height="3" fill="#92400E" />

            <circle cx="30" cy="85" r="2" fill="#10B981" />
            <rect x="29.5" y="87" width="1" height="3" fill="#92400E" />
          </g>
        </svg>

        {/* Interactive phase cards */}
        {selectedPhase && (
          <div className="absolute top-4 right-4 w-80 z-10">
            {roadmapPhases
              .filter((phase) => phase.id === selectedPhase)
              .map((phase) => (
                <Card key={phase.id} className="bg-card/95 backdrop-blur-sm border-2 border-primary/50 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusBg(phase.status)}`}
                      >
                        <div className={getStatusColor(phase.status)}>{phase.icon}</div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{phase.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {phase.period}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 text-sm">{phase.description}</p>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Key Deliverables:</h4>
                      <ul className="space-y-1">
                        {phase.deliverables.map((deliverable, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Phase overview cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roadmapPhases.map((phase, index) => (
          <Card
            key={phase.id}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              selectedPhase === phase.id ? "ring-2 ring-primary border-primary" : "border-border"
            } ${phase.status === "current" ? "bg-primary/5" : ""}`}
            onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusBg(phase.status)}`}>
                  <div className={getStatusColor(phase.status)}>
                    {phase.status === "completed" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : phase.status === "current" ? (
                      <Circle className="w-4 h-4 fill-current" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{phase.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {phase.period}
                  </Badge>
                </div>
              </div>

              <p className="text-muted-foreground text-xs mb-2">{phase.description}</p>

              <div className="text-xs text-muted-foreground">{phase.deliverables.length} deliverables</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-8 bg-card/50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-bold text-primary">25%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: "25%" }}></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Foundation phase in progress • Lightning payments coming next
        </p>
      </div>
    </div>
  )
}
