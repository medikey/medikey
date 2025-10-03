"use client"

import { Bitcoin, Heart, Key, Zap } from "lucide-react"

export default function ScrollingTicker() {
  const items = [
    { icon: Heart, text: "MEDIKEY", color: "text-primary" },
    { icon: Bitcoin, text: "BITCOIN", color: "text-primary" },
    { icon: Key, text: "NOSTR", color: "text-accent" },
    { icon: Zap, text: "LIGHTNING", color: "text-chart-3" },
    { icon: Heart, text: "AFRICA", color: "text-destructive" },
  ]

  return (
    <div className="relative overflow-hidden bg-card/30 border-y border-border py-4">
      <div className="flex animate-scroll-left">
        {/* First set */}
        {Array.from({ length: 8 }).map((_, setIndex) => (
          <div key={setIndex} className="flex items-center space-x-8 mr-8">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className={`font-bold text-sm ${item.color}`}>{item.text}</span>
                <div className="w-2 h-2 bg-muted rounded-full"></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
