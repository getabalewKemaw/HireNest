import React from 'react';
import { Github, Linkedin, Twitter, Sparkles } from 'lucide-react';

const developers = [
    {
        name: "Getabalew Kemaw",
        role: "Fullstack Architect",
        description: "Leading the technical vision and end-to-end architecture of HireNest, crafting scalable solutions for modern recruitment.",
        image: "/devs1FullStack.png",
        skills: ["React", "Spring Boot", "AWS", "System Design"],
        social: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
        name: "Leta Kasahun",
        role: "Backend Engineer",
        description: "Architecting high-performance database infrastructures and secure backend services that power our data-driven engine.",
        image: "/databaseAndFullStackDeveloper.png",
        skills: ["PostgreSQL", "Java", "Redis", "Security"],
        social: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
        name: "Abel Alelign",
        role: "Product Strategist",
        description: "Bridging the gap between design and functionality, ensuring every user interaction is purposeful and elegantly executed.",
        image: "/kuzuProjectManger.png",
        skills: ["UI/UX", "React", "Management", "Agile"],
        social: { github: "#", linkedin: "#", twitter: "#" }
    },
    {
        name: "Kura Lema",
        role: "Frontend Specialist",
        description: "Transforming complex ideas into pixel-perfect, interactive digital experiences that push the boundaries of the web.",
        image: "/kura.png",
        skills: ["Animation", "Javascript", "CSS Art", "Performance"],
        social: { github: "#", linkedin: "#", twitter: "#" }
    }
];

const DeveloperSection = () => {
    return (
        <section className="py-32 px-4 bg-transparent transition-colors duration-700 relative overflow-hidden">
            {/* Premium Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none opacity-30" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-24 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10">
                        <Sparkles size={14} className="text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">The Powerhouse</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif font-black text-gray-900 dark:text-white leading-tight">
                        Meet the <span className="text-secondary inline-block relative">
                            Visionaries
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-secondary/20 rounded-full" />
                        </span>
                    </h2>

                    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl font-sans font-medium leading-relaxed">
                        A collective of innovative minds crafting the next generation of professional networking and career development.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {developers.map((dev, index) => (
                        <div
                            key={dev.name}
                            className="group relative flex flex-col items-center"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Card Body */}
                            <div className="w-full bg-white dark:bg-[#152739] rounded-[3rem] p-8 pt-24 border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.02)] dark:shadow-none transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-secondary/10 group-hover:-translate-y-2 relative">

                                {/* Floating Profile Image */}
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-secondary to-accent opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-xl scale-125" />
                                    <div className="relative w-full h-full rounded-full p-1 bg-white dark:bg-[#152739] shadow-xl overflow-hidden border border-gray-100 dark:border-white/10">
                                        <div className="w-full h-full rounded-full overflow-hidden">
                                            <img
                                                src={dev.image}
                                                alt={dev.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        {/* Social Overlay */}
                                        <div className="absolute inset-0 bg-secondary/90 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <a href={dev.social.github} className="p-1.5 hover:scale-110 transition-transform text-white">
                                                <Github size={18} />
                                            </a>
                                            <a href={dev.social.linkedin} className="p-1.5 hover:scale-110 transition-transform text-white">
                                                <Linkedin size={18} />
                                            </a>
                                            <a href={dev.social.twitter} className="p-1.5 hover:scale-110 transition-transform text-white">
                                                <Twitter size={18} />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center space-y-4">
                                    <h3 className="text-2xl font-serif font-black text-gray-900 dark:text-white group-hover:text-secondary transition-colors">
                                        {dev.name}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/80">
                                        {dev.role}
                                    </p>
                                    <div className="h-px w-8 bg-gray-200 dark:bg-white/10 mx-auto" />
                                    <p className="text-sm font-sans text-gray-500 dark:text-gray-400 leading-relaxed italic">
                                        "{dev.description}"
                                    </p>

                                    <div className="pt-4 flex flex-wrap justify-center gap-1.5">
                                        {dev.skills.map(skill => (
                                            <span key={skill} className="px-2.5 py-1 bg-gray-50 dark:bg-white/5 text-[9px] font-bold text-gray-400 dark:text-gray-500 rounded-full border border-gray-200 dark:border-white/10 uppercase tracking-tighter hover:border-secondary/40 hover:text-secondary transition-all">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DeveloperSection;
