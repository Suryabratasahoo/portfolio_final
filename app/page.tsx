import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Experience from "@/components/experience"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Resume from "@/components/resume"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import StatsCounter from "@/components/stats-counter"
import Skills from "@/components/skills"
import VisitorCounter from "@/components/visitor-counter"
import NowSection from "@/components/now-section"
import TimelineGoals from "@/components/timeline-goals"

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <StatsCounter />
        <Projects />
        <NowSection />
        <TimelineGoals />
        <Experience />
        <Skills />
        <Resume />
        <VisitorCounter />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

