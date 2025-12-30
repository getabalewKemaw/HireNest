import { Zap, Target, ShieldCheck, Cpu, ArrowUpRight, BarChart3 } from 'lucide-react';

const features = [
    {
        title: " Precision Matching",
        description: "Our proprietary neural engine decodes your career DNA to find roles that don't just match your title, but your trajectory.",
        icon: Cpu,
        color: "text-secondary",
        bg: "bg-secondary/10",
        tag: "Advanced Tech"
    },
    {
        title: "Zero-Friction Applications",
        description: "Apply to world-class opportunities in milliseconds. We've eliminated the form-filling exhaustion so you can focus on the interview.",
        icon: Zap,
        color: "text-secondary",
        bg: "bg-secondary/10",
        tag: "Efficiency"
    },
    {
        title: "Verified Enterprise Network",
        description: "Direct access to vetted hiring managers at Fortune 500s and elite startups. No ghosting, no fake listings, total transparency.",
        icon: ShieldCheck,
        color: "text-secondary",
        bg: "bg-secondary/10",
        tag: "Security"
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-32 bg-white dark:bg-[#0B1C2D] relative z-10 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center mb-24 gap-6">
                    <div className="inline-flex items-center gap-2 text-secondary font-accent font-black text-[10px] uppercase tracking-[0.2em]">
                        <Target size={14} /> The HireNest Difference
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif font-black text-primary dark:text-white leading-[0.95] tracking-tight">
                        Engineered for <span className="text-secondary italic">Exceptional</span> Careers.
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-serif font-medium max-w-2xl leading-relaxed">
                        We're not just a job board. We're a career accelerator designed for the top 5% of global talent.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-10 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-transparent hover:border-secondary/20 dark:hover:border-white/10 transition-all duration-700 relative overflow-hidden flex flex-col h-full shadow-sm hover:shadow-2xl hover:shadow-primary/5"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                                <feature.icon size={80} />
                            </div>

                            <div className="flex justify-between items-start mb-10">
                                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                    <feature.icon size={28} />
                                </div>
                                <span className="text-[10px] font-accent font-black text-gray-400 uppercase tracking-widest bg-white dark:bg-black/20 px-2.5 py-1 rounded-md border border-gray-100 dark:border-white/5 shadow-sm">
                                    {feature.tag}
                                </span>
                            </div>

                            <h4 className="text-3xl font-serif font-black text-primary dark:text-white mb-6 group-hover:text-secondary transition-colors italic leading-tight">
                                {feature.title}
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-serif mb-10 flex-grow">
                                {feature.description}
                            </p>

                            <button className="flex items-center gap-3 text-xs font-accent font-black uppercase tracking-[0.2em] text-primary dark:text-white group-hover:text-secondary transition-all">
                                Learn More <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bottom Trust CTA */}
                <div className="mt-20 p-10 rounded-[3rem] bg-secondary dark:bg-secondary/20 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/20 shadow-lg shadow-black/20">
                            <BarChart3 size={28} />
                        </div>
                        <div>
                            <h5 className="text-2xl font-serif font-black text-white italic">Real-time market insights.</h5>
                            <p className="text-gray-400 font-medium">Get paid what you're actually worth.</p>
                        </div>
                    </div>

                    <button className="px-10 py-5 bg-white text-primary font-accent font-black rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs relative z-10">
                        Explore Salary Hub
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
