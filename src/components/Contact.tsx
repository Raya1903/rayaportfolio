import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, Github, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "your.email@example.com",
      href: "mailto:your.email@example.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 1234567890",
      href: "tel:+911234567890",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Your City, India",
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com",
    },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center font-['Space_Grotesk']">
            Get In <span className="bg-gradient-primary bg-clip-text text-transparent">Touch</span>
          </h2>
          
          <p className="text-lg text-muted-foreground text-center mb-12">
            I'm currently looking for new opportunities. Feel free to reach out!
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {contactInfo.map((info, index) => (
              <Card 
                key={index}
                className="p-6 bg-card border-border hover:border-primary transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-primary">
                    <info.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                    {info.href ? (
                      <a 
                        href={info.href}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <Card className="p-8 bg-gradient-hero border-border text-center">
            <h3 className="text-2xl font-semibold mb-4">Let's Work Together</h3>
            <p className="text-muted-foreground mb-6">
              Have a project in mind? Let's discuss how I can help bring your ideas to life.
            </p>
            <div className="flex gap-4 justify-center mb-6">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="lg"
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-5 h-5 mr-2" />
                    {social.label}
                  </a>
                </Button>
              ))}
            </div>
            <Button 
              size="lg"
              className="bg-gradient-primary hover:shadow-glow"
              asChild
            >
              <a href="mailto:your.email@example.com">
                Send me an email
              </a>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
