import { ArrowRight, UserPlus, Search, Rocket, CheckCircle2 } from 'lucide-react';
import Button from '../Button';

const steps = [
    {
        num: "01",
        title: "Build Your Digital Persona",
        desc: "Go beyond the resume. Create a data-driven profile that highlights your true impact and potential.",
        icon: UserPlus,
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        num: "02",
        title: "Intelligent Match Engine",
        desc: "Our AI curates opportunities based on 50+ unique career data points, ensuring every match is high-value.",
        icon: Search,
        color: "text-secondary",
        bg: "bg-secondary/10"
    },
    {
        num: "03",
        title: "Direct Pipeline Hiring",
        desc: "Skip the noise. Enter direct pipelines for elite companies and secure your next role with confidence.",
        icon: Rocket,
        color: "text-secondary",
        bg: "bg-secondary/10"
    }
];

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="py-32 bg-transparent relative z-10 transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Centered Heading Section */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/10 text-secondary text-[10px] font-accent font-black uppercase tracking-[0.2em]">
                        <Rocket size={14} /> Streamlined Velocity
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif font-black text-primary dark:text-white leading-[0.95] tracking-tight">
                        How it <span className="text-secondary italic">works.</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xl font-serif leading-relaxed max-w-xl mx-auto">
                        We've re-engineered the job search from the ground up. No more endless forms. No more ghosting. Just progress.
                    </p>
                </div>

                <div className="lg:grid lg:grid-cols-2 gap-24 items-center">
                    {/* Left: Interactive List */}
                    <div className="mb-16 lg:mb-0 space-y-12">
                        <div className="space-y-4">
                            {steps.map((step, idx) => (
                                <div key={idx} className="group p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-transparent hover:border-gray-100 dark:hover:border-white/10 transition-all hover:shadow-xl hover:shadow-primary/5 cursor-pointer relative">
                                    <div className="flex items-start gap-6">
                                        <div className={`w-14 h-14 ${step.bg} ${step.color} rounded-2xl flex items-center justify-center font-accent font-black text-xl group-hover:scale-110 transition-transform duration-500`}>
                                            <step.icon size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-accent font-black text-gray-300 uppercase tracking-widest leading-none">Step {step.num}</span>
                                                <ArrowRight size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                            </div>
                                            <h4 className="text-2xl font-serif font-black text-primary dark:text-white mb-2 italic group-hover:text-secondary transition-colors leading-none">
                                                {step.title}
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400 font-serif leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-8">
                            <Button variant="secondary" size="md" className="!rounded-[1.25rem] shadow-xl shadow-secondary/20 group !px-10">
                                Start Your Process <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                    {/* Right: Visual Showcase */}
                    <div className="relative">
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-4 border-white dark:border-[#0B1C2D] lg:scale-110">
                            <img
                                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                                alt="Innovation Hub"
                                className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

                            {/* Floating UI Elements */}
                            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden shadow-xl">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 40}`} alt="Hiring" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-accent font-black text-white italic">Hiring Team Active</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></div>
                                            <div className="text-[10px] font-accent font-bold text-gray-300 uppercase tracking-widest">Verifying Candidates</div>
                                        </div>
                                    </div>
                                    <CheckCircle2 className="text-secondary" />
                                </div>
                            </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute -z-10 -bottom-20 -right-20 w-full h-full bg-secondary/10 rounded-full blur-[100px] animate-blob"></div>
                        <div className="absolute -z-10 -top-20 -left-20 w-3/4 h-3/4 bg-accent/5 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
