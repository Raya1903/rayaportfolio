import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import project1 from "@/assets/project1.jpg";
import project2 from "@/assets/project2.jpg";
import project3 from "@/assets/project3.jpg";

const Projects = () => {
  const projects = [
    {
      title: "Cybersecurity Encryption System",
      description: "Comprehensive cybersecurity project focused on encryption and secure application design using Java Swing. Completed during 4-month internship at Athreya Technologies, Hubli under the guidance of industry experts.",
      image: project1,
      tags: ["Java", "Java Swing", "Encryption", "Security Design"],
      github: "https://github.com/Raya1903/cybersecurity-encryption-system",
      demo: "/cybersecurity-demo",
    },
    {
      title: "Calculator Application",
      description: "Feature-rich calculator application built with Python packages, demonstrating strong programming fundamentals and clean code architecture with a user-friendly interface.",
      image: project2,
      tags: ["Python", "Package Development", "GUI"],
      github: "https://github.com/Raya1903/calculator-application",
      demo: "/calculator-demo",
    },
    {
      title: "IPL Web Application",
      description: "Interactive web application for Indian Premier League statistics and information. Built with modern web technologies featuring responsive design and dynamic content.",
      image: project3,
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      github: "https://github.com/Raya1903/ipl-web-application",
      demo: "/ipl-demo",
    },
  ];

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center font-['Space_Grotesk']">
            Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
          </h2>
          
          <p className="text-lg text-muted-foreground text-center mb-12">
            Some of my recent work
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className="overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-card group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex}
                        className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    {project.github && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="flex-1"
                        asChild
                      >
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.demo && (
                      <Button 
                        size="sm"
                        className="flex-1 bg-gradient-primary hover:shadow-glow"
                        asChild
                      >
                        <a href={project.demo}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
