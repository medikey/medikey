"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote:
      "MediKey has revolutionized how we manage patient records in our clinic. The Nostr protocol ensures our patients truly own their health data, and Lightning payments make consultations seamless.",
    author: "Dr. Amina Kone",
    role: "Chief Medical Officer",
    company: "Lagos General Hospital",
    avatar: "/african-female-doctor.jpg",
    companyColor: "text-primary",
  },
  {
    quote:
      "As a rural healthcare provider, MediKey's offline-first approach and Bitcoin Lightning payments have enabled us to serve communities that traditional banking couldn't reach. It's truly transformative.",
    author: "Dr. Kwame Asante",
    role: "Founder",
    company: "Rural Health Network Ghana",
    avatar: "/african-male-doctor.jpg",
    companyColor: "text-chart-3",
  },
  {
    quote:
      "The cryptographic consent system gives our patients unprecedented control over their health data. They can share records instantly with specialists across borders while maintaining complete privacy.",
    author: "Dr. Fatima Al-Rashid",
    role: "Head of Digital Health",
    company: "Cairo Medical Center",
    avatar: "/middle-eastern-female-doctor.jpg",
    companyColor: "text-accent",
  },
  {
    quote:
      "MediKey's FHIR compliance made integration with our existing systems effortless. Now our patients can access their complete medical history from anywhere in Africa using just their Nostr keys.",
    author: "Dr. Joseph Mbeki",
    role: "CTO",
    company: "HealthTech South Africa",
    avatar: "/african-male-tech-executive.jpg",
    companyColor: "text-chart-4",
  },
  {
    quote:
      "The Lightning Network integration has reduced our payment processing costs by 90%. Patients can pay for lab results instantly, and we receive funds immediately without intermediaries.",
    author: "Dr. Aisha Okafor",
    role: "Laboratory Director",
    company: "West Africa Diagnostics",
    avatar: "/african-female-lab-director.jpg",
    companyColor: "text-chart-5",
  },
  {
    quote:
      "MediKey has enabled true healthcare interoperability across our hospital network. Patient records flow seamlessly between facilities while maintaining the highest security standards.",
    author: "Dr. Emmanuel Nkomo",
    role: "VP of Operations",
    company: "East African Health Alliance",
    avatar: "/african-male-hospital-executive.jpg",
    companyColor: "text-chart-2",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">What Healthcare Leaders Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Healthcare professionals across Africa are transforming patient care with MediKey's Nostr + Bitcoin
            solution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-background border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg testimonial-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-muted-foreground/30" />
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className={`text-sm font-medium ${testimonial.companyColor}`}>{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
