import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-['Inter']">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      
      <footer className="py-8 border-t border-border">
        <div className="container px-4 text-center text-muted-foreground">
          <p>© 2025 Your Name. Built with passion and code.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
