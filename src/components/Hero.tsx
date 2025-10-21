import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(26, 32, 53, 0.9), rgba(26, 32, 53, 0.95)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-card border border-border text-sm font-medium mb-4">
              Available for Opportunities
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Space_Grotesk']">
            Hi, I'm{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Your Name
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Full Stack Developer
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crafting elegant solutions to complex problems. Passionate about building 
            scalable applications with modern technologies.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => scrollToSection("projects")}
            >
              View My Work
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => scrollToSection("contact")}
            >
              Get In Touch
            </Button>
          </div>
          
          <div className="flex gap-4 justify-center">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-card hover:bg-primary transition-colors border border-border"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-card hover:bg-primary transition-colors border border-border"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="mailto:your.email@example.com"
              className="p-3 rounded-full bg-card hover:bg-primary transition-colors border border-border"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => scrollToSection("about")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer bg-transparent border-none"
      >
        <ArrowDown className="w-6 h-6 text-primary" />
      </button>
    </section>
  );
};

export default Hero;
