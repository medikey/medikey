import { Button } from '@/components/ui/button';
import { Heart} from 'lucide-react';
import {
  SecureIcon,
  ShareIcon,
  LightningIcon,
} from '@/components/icons/BitcoinIcons';
import ProblemSection from '@/components/ProblemSection';
import HeroSection from '@/components/HeroSection';
import Authentication from '@/components/Authentication';
import SolutionSection from '@/components/SolutionSection';
import InteractiveRoadmap from '@/components/InteractiveRoadmap';
import ScrollingTicker from '@/components/ScrollingTicker';
import TestimonialsSection from '@/components/TestimonialSection';
import VisionSection from '@/components/VisionSection';
import { LoginArea } from '@/components/auth/LoginArea';

export function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">MediKey</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#problem" className="text-muted-foreground hover:text-foreground transition-colors">
                Problem
              </a>
              <a href="#solution" className="text-muted-foreground hover:text-foreground transition-colors">
                Solution
              </a>
              <a href="#roadmap" className="text-muted-foreground hover:text-foreground transition-colors">
                Roadmap
              </a>
              <a href="#vision" className="text-muted-foreground hover:text-foreground transition-colors">
                Vision
              </a>
            </div>
             <div className="flex items-center space-x-4 mr-8">
              <LoginArea className="max-w-40" />
              </div>
          </div>
        </div>
      </nav>
      {/* hero section */}

      <HeroSection />

      <div className="container pt-32 mx-auto px-4 py-12">
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="crypto-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center">
                <SecureIcon className="h-8 w-8 text-white" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Cryptographic Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your medical records are secured with public-key cryptography, ensuring only you control access.
            </p>
          </div>

          <div className="crypto-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center">
                <ShareIcon className="h-8 w-8 text-white" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Role-Based Access</h3>
            <p className="text-muted-foreground leading-relaxed">
              Patients control their data while clinicians access only what they need with permission.
            </p>
          </div>

          <div className="crypto-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl"></div>
              <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <LightningIcon className="h-8 w-8 text-white" size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">Lightning Payments</h3>
            <p className="text-muted-foreground leading-relaxed">
              Instant micropayments for record verification and secure storage using Bitcoin Lightning.
            </p>
          </div>
        </div>

      {/* Problem Section */}
      <ProblemSection />

       {/* Solution Section */}
      <SolutionSection />

        {/* Roadmap Section */}
       <section id="roadmap" className="py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Development Roadmap</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {"Follow our journey on the winding road to revolutionizing African healthcare with Nostr + Bitcoin."}
            </p>
          </div>
          {/* Interactive Roadmap Component  */}
          <InteractiveRoadmap />
         </div>
      </section>

      {/* Scrolling Ticker */}
      <ScrollingTicker />

      {/* Testimonials Section */}
       <TestimonialsSection />

      {/* Vision Section */}
      
      <VisionSection /> 

      {/* Authentication */}
        <Authentication />

{/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">MediKey</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="text-center mt-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <SecureIcon className="h-4 w-4 text-muted-foreground" size={16} />
            <span className="text-sm text-muted-foreground">Built for healthcare privacy and security</span>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              © 2025 MediKey. All rights reserved. 
            </p>
          </div>
        </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
