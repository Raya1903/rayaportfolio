import { Card } from "@/components/ui/card";
import { Briefcase, GraduationCap } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      type: "work",
      title: "Full Stack Developer Intern",
      organization: "Tech Company XYZ",
      period: "Jun 2024 - Present",
      description: "Developed and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver features.",
      achievements: [
        "Improved application performance by 40%",
        "Implemented new features serving 10,000+ users",
      ],
    },
    {
      type: "work",
      title: "Frontend Developer",
      organization: "Startup ABC",
      period: "Jan 2024 - May 2024",
      description: "Built responsive user interfaces and integrated APIs. Worked closely with designers to implement pixel-perfect designs.",
      achievements: [
        "Reduced page load time by 30%",
        "Created reusable component library",
      ],
    },
  ];

  const education = [
    {
      degree: "Bachelor of Technology in Computer Science",
      institution: "University Name",
      period: "2021 - 2025",
      gpa: "8.5/10",
    },
  ];

  return (
    <section id="experience" className="py-20 bg-card/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center font-['Space_Grotesk']">
            Experience & <span className="bg-gradient-primary bg-clip-text text-transparent">Education</span>
          </h2>
          
          <div className="space-y-8 mt-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Work Experience
              </h3>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <Card key={index} className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                      <div>
                        <h4 className="text-xl font-semibold text-primary">{exp.title}</h4>
                        <p className="text-muted-foreground">{exp.organization}</p>
                      </div>
                      <span className="text-sm text-muted-foreground mt-2 md:mt-0">{exp.period}</span>
                    </div>
                    <p className="text-muted-foreground mb-3">{exp.description}</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Education
              </h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={index} className="p-6 bg-card border-border hover:border-primary transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h4 className="text-xl font-semibold text-primary">{edu.degree}</h4>
                        <p className="text-muted-foreground">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground mt-1">GPA: {edu.gpa}</p>
                      </div>
                      <span className="text-sm text-muted-foreground mt-2 md:mt-0">{edu.period}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
