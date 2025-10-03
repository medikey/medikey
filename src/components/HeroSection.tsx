import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Key, Zap, Bitcoin, ArrowRight } from 'lucide-react';
import {
  MediKeyLogo,
} from '@/components/icons/BitcoinIcons';

const HeroSection = () => {

  return (
      <section className="relative pt-32 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20">
        </div>
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"></div>
                <div className="relative p-4 bg-primary rounded-2xl">
                  <MediKeyLogo size={40} className="text-primary-foreground" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-bold text-gradient mb-1">MediKey</h1>
                <p className="text-sm font-medium text-muted-foreground tracking-wide">
                  HEALTHCARE PROTOCOL
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          {/* <Badge className="mb-6 bg-primary/20 text-black border-orange/30">
            ⚡ Powered by Nostr + Bitcoin Lightning
          </Badge> */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Decentralized Healthcare
            <span className="text-primary"> for Africa</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            {
              "Patient-owned health records built on Nostr protocol with Bitcoin Lightning payments. Empowering healthcare across Africa with cryptographic sovereignty."
            }
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
              <Key className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Nostr Protocol</span>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-chart-3 lightning-animation" />
              <span className="text-sm font-medium">Lightning Payments</span>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
              <Bitcoin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Bitcoin Native</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 pulse-glow">
              Get Early Access
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              View Demo
            </Button>
          </div>

          <HeroStats />
        </div>
      </section>
  )
}



function HeroStats() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(4).fill(false))
  return (
    <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
      <div
        className={`text-center transition-all duration-700 ${visibleItems[0] ? "animate-counter-up" : "scroll-hidden"}`}
      >
        <div className="text-3xl font-bold text-primary">200M+</div>
        <div className="text-muted-foreground">Patients Without Records</div>
      </div>
      <div
        className={`text-center transition-all duration-700 ${visibleItems[1] ? "animate-counter-up" : "scroll-hidden"}`}
      >
        <div className="text-3xl font-bold text-primary">70%</div>
        <div className="text-muted-foreground">Fragmented Systems</div>
      </div>
      <div
        className={`text-center transition-all duration-700 ${visibleItems[2] ? "animate-counter-up" : "scroll-hidden"}`}
      >
        <div className="text-3xl font-bold text-primary">$2B</div>
        <div className="text-muted-foreground">Wasted on Duplicate Tests</div>
      </div>
      <div
        className={`text-center transition-all duration-700 ${visibleItems[3] ? "animate-counter-up" : "scroll-hidden"}`}
      >
        <div className="text-3xl font-bold text-primary">54</div>
        <div className="text-muted-foreground">African Countries</div>
      </div>
    </div>
  )
}

export default HeroSection

