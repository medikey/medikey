import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/use-scroll-animation'
import { Bitcoin, Database, Heart, Key, Shield, Smartphone, Users, Zap } from 'lucide-react'
import  { useRef } from 'react'
import { Card, CardContent } from './ui/card'

const SolutionSection = () => {
  const { isVisible: titleVisible } = useScrollAnimation()
  const { visibleItems } = useStaggeredAnimation(6, 120)
  const { isVisible: architectureVisible } = useScrollAnimation()
  const titleRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const architectureRef = useRef<HTMLDivElement>(null)

  return (
    <section id="solution" className="py-20">
      <div className="container mx-auto px-6">
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? "animate-slide-in-up" : "scroll-hidden"}`}
        >
          <h2 className="text-4xl font-bold mb-4">The MediKey Solution</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {
              "A decentralized, patient-owned health record system built on Nostr protocol with Bitcoin Lightning payments for Africa's unique needs."
            }
          </p>
        </div>

        <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Key,
              title: "Nostr Protocol Foundation",
              desc: "Built on Nostr's decentralized protocol - cryptographic keys ensure patient ownership and data portability across any system.",
              color: "accent",
            },
            {
              icon: Zap,
              title: "Lightning Payments",
              desc: "Instant, low-cost Bitcoin Lightning payments for consultations, lab results, and medical services - perfect for Africa's mobile-first economy.",
              color: "chart-3",
            },
            {
              icon: Bitcoin,
              title: "Bitcoin Native",
              desc: "Native Bitcoin integration enables direct peer-to-peer healthcare payments without traditional banking infrastructure.",
              color: "primary",
            },
            {
              icon: Shield,
              title: "Cryptographic Consent",
              desc: "Patients digitally sign consent with their private keys - mathematically provable authorization for data access.",
              color: "chart-2",
            },
            {
              icon: Heart,
              title: "FHIR Compliance",
              desc: "Full compatibility with international and Nigerian FHIR standards for seamless integration with existing systems.",
              color: "primary",
            },
            {
              icon: Smartphone,
              title: "Mobile-First Design",
              desc: "Lightweight PWA with offline support and USSD/SMS fallback - designed for Africa's mobile infrastructure.",
              color: "chart-4",
            },
          ].map((item, index) => (
            <Card
              key={index}
              className={`bg-card border-border hover:border-primary/50 transition-all duration-700 ${visibleItems[index] ? "animate-scale-in" : "scroll-hidden"}`}
            >
              <CardContent className="p-8">
                <div className={`w-12 h-12 bg-${item.color}/20 rounded-lg flex items-center justify-center mb-4`}>
                  <item.icon
                    className={`w-6 h-6 text-${item.color} ${item.icon === Zap ? "lightning-animation" : ""}`}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div
          ref={architectureRef}
          className={`bg-card/50 rounded-2xl p-8 border border-border transition-all duration-700 ${architectureVisible ? "animate-slide-in-up" : "scroll-hidden"}`}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Nostr + Bitcoin Architecture</h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6 items-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-chart-4" />
                </div>
                <h4 className="font-semibold mb-2">Patients & Clinics</h4>
                <p className="text-sm text-muted-foreground">Nostr keypairs & Lightning wallets</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-10 h-10 text-accent" />
                </div>
                <h4 className="font-semibold mb-2">Nostr Relays</h4>
                <p className="text-sm text-muted-foreground">Encrypted health events</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-chart-3/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-10 h-10 text-chart-3 lightning-animation" />
                </div>
                <h4 className="font-semibold mb-2">Lightning Network</h4>
                <p className="text-sm text-muted-foreground">Instant Bitcoin payments</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">Admin System</h4>
                <p className="text-sm text-muted-foreground">Clinic verification & governance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolutionSection