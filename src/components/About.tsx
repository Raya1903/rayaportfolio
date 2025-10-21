import { Card } from "@/components/ui/card";
import { Code2, Palette, Rocket } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code following best practices",
    },
    {
      icon: Palette,
      title: "Modern Design",
      description: "Creating beautiful, intuitive interfaces with attention to detail",
    },
    {
      icon: Rocket,
      title: "Fast Delivery",
      description: "Delivering high-quality solutions within deadlines",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center font-['Space_Grotesk']">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">Me</span>
          </h2>
          
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            I'm a passionate developer with expertise in building modern web applications. 
            I love turning ideas into reality through clean code and thoughtful design.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <Card 
                key={index}
                className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-card group"
              >
                <div className="mb-4 inline-block p-3 rounded-lg bg-gradient-primary group-hover:shadow-glow transition-all duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
