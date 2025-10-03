import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'

const VisionSection = () => {
  const { isVisible: titleVisible } = useScrollAnimation()
  const { isVisible: contentVisible } = useScrollAnimation()
  const { isVisible: goalsVisible } = useScrollAnimation()
  const { isVisible: ctaVisible } = useScrollAnimation()
  const titleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const goalsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  return (
    <section id="vision" className="py-20">
      <div className="container mx-auto px-6">
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-700 ${titleVisible ? "animate-slide-in-up" : "scroll-hidden"}`}
        >
          <h2 className="text-4xl font-bold mb-4">Long-Term Vision</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {"Transforming healthcare across Africa through Nostr protocol sovereignty and Bitcoin Lightning payments."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div
            ref={contentRef}
            className={`transition-all duration-700 ${contentVisible ? "animate-slide-in-left" : "scroll-hidden"}`}
          >
            <h3 className="text-3xl font-bold mb-6">Empowering 1 Billion Africans</h3>
            <div className="space-y-4">
              {[
                {
                  title: "Cryptographic Health Sovereignty",
                  desc: "Every African owns their complete health identity through Nostr keys - portable across borders and systems.",
                },
                {
                  title: "Lightning-Fast Healthcare Payments",
                  desc: "Instant, low-cost Bitcoin payments enable direct patient-to-provider transactions without intermediaries.",
                },
                {
                  title: "Decentralized Health Network",
                  desc: "Nostr relays create a censorship-resistant, always-available healthcare data network across Africa.",
                },
                {
                  title: "Financial Inclusion Through Bitcoin",
                  desc: "Bitcoin Lightning enables healthcare access for the unbanked majority across African communities.",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            ref={goalsRef}
            className={`bg-card/50 rounded-2xl p-8 border border-border transition-all duration-700 ${goalsVisible ? "animate-slide-in-right" : "scroll-hidden"}`}
          >
            <h4 className="text-xl font-bold mb-6">Impact Goals by 2030</h4>
            <div className="space-y-6">
              {[
                { label: "Nostr Health Identities", value: "100M+", progress: 75, color: "primary" },
                { label: "Lightning Payments Processed", value: "$1B+", progress: 60, color: "chart-3" },
                { label: "Countries Deployed", value: "25+", progress: 45, color: "chart-4" },
                { label: "Healthcare Cost Savings", value: "$10B+", progress: 80, color: "chart-5" },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className={`text-sm font-bold text-${item.color}`}>{item.value}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className={`bg-${item.color} h-2 rounded-full`} style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={ctaRef}
          className={`bg-card/50 rounded-2xl p-8 border border-border text-center transition-all duration-700 ${ctaVisible ? "animate-scale-in" : "scroll-hidden"}`}
        >
          <h3 className="text-2xl font-bold mb-4">Join the Healthcare Revolution</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            {
              "Be part of building the future of healthcare in Africa with Nostr protocol sovereignty and Bitcoin Lightning payments."
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="pulse-glow">
              Join Our Beta Program
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline">
              Partner With Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VisionSection