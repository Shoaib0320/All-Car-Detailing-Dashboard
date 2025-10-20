"use client";
import { useEffect, useState } from "react";
import { ExternalLink, Github } from "lucide-react";

export default function PortfolioSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("portfolio");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with payment integration, inventory management, and analytics dashboard.",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Healthcare Management System",
      description:
        "Comprehensive healthcare platform for patient management, appointment scheduling, and medical records.",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Financial Dashboard",
      description:
        "Real-time financial analytics dashboard with data visualization and automated reporting features.",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Social Media Analytics",
      description:
        "Advanced social media monitoring and analytics platform with AI-powered insights.",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "IoT Monitoring System",
      description:
        "Real-time IoT device monitoring and control system with predictive maintenance capabilities.",
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Learning Management System",
      description:
        "Complete LMS with course creation, student progress tracking, and interactive assessments.",
      liveUrl: "#",
      githubUrl: "#",
    },
  ];

  return (
    <section
      id="portfolio"
      className="py-20 bg-gradient-to-b from-sky-50 to-white dark:from-slate-900 dark:to-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">
                Portfolio
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              Explore our successful projects and see how we've helped
              businesses transform their digital presence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-sky-100 dark:border-slate-600 hover:shadow-xl transition-all duration-500 hover:transform hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-slate-600 dark:to-slate-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-sky-200 dark:bg-slate-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div> */}

                <div className="flex gap-3">
                  <a
                    href={project.liveUrl}
                    className="flex items-center gap-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
