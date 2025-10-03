import { useRef } from 'react'
import { Card, CardContent } from './ui/card'
import { Database, Globe, Heart, Shield, Users, Zap } from 'lucide-react'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/use-scroll-animation'

const ProblemSection = () => {
  const { isVisible: titleVisible } = useScrollAnimation()
  const { visibleItems } = useStaggeredAnimation(6, 100)
  const titleRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="problem" className="py-20 bg-card/50">
      <div className="container mx-auto px-6">
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? "animate-slide-in-up" : "scroll-hidden"}`}
        >
          <h2 className="text-4xl font-bold mb-4 text-orange-600">The Healthcare Crisis in Africa</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {"Patients across Nigeria and Africa face a broken healthcare record system that puts lives at risk."}
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Database,
              title: "Fragmented Records",
              desc: "Patient records scattered across paper files, hospitals, and incompatible vendor systems.",
            },
            {
              icon: Shield,
              title: "No Patient Control",
              desc: "Patients cannot access, control, or share their own health data digitally.",
            },
            {
              icon: Globe,
              title: "Poor Interoperability",
              desc: "Hospitals and labs cannot easily share critical patient information.",
            },
            {
              icon: Zap,
              title: "System Fragility",
              desc: "Centralized systems vulnerable to power cuts, downtime, and data corruption.",
            },
            {
              icon: Heart,
              title: "Repeated Tests",
              desc: "Patients waste money on duplicate tests and lose critical medical histories.",
            },
            {
              icon: Users,
              title: "Poor Care Continuity",
              desc: "Clinicians lack complete patient information for optimal decision-making.",
            },
          ].map((item, index) => (
            <Card
              key={index}
              className={`bg-card border-orange-200 hover:border-orange-500 transition-all duration-700 ${visibleItems[index] ? "animate-slide-in-up" : "scroll-hidden"}`}
            >
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-amber" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProblemSection
