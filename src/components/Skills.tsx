import { Badge } from "@/components/ui/badge";

const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js", "HTML5", "CSS3"],
    },
    {
      title: "Backend",
      skills: ["Node.js", "Express", "Python", "MongoDB", "PostgreSQL", "REST APIs"],
    },
    {
      title: "Tools & Others",
      skills: ["Git", "Docker", "AWS", "Firebase", "Figma", "Agile"],
    },
  ];

  return (
    <section id="skills" className="py-20 bg-card/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center font-['Space_Grotesk']">
            Technical <span className="bg-gradient-primary bg-clip-text text-transparent">Skills</span>
          </h2>
          
          <p className="text-lg text-muted-foreground text-center mb-12">
            Technologies and tools I work with
          </p>
          
          <div className="space-y-8">
            {skillCategories.map((category, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge 
                      key={skillIndex}
                      variant="secondary"
                      className="px-4 py-2 text-sm bg-card border-border hover:border-primary hover:shadow-glow transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
