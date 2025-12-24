const AboutSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-[#0B1C2D] relative overflow-hidden transition-colors duration-500">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-50/50 dark:from-white/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="lg:grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative mb-12 lg:mb-0">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="absolute inset-0 bg-secondary/10 dark:bg-secondary/20 mix-blend-overlay" />
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Team working"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#0F2439] p-8 rounded-xl shadow-xl max-w-xs border border-gray-100 dark:border-white/5">
                            <p className="text-4xl font-serif font-black text-primary dark:text-white mb-2 italic">10k+</p>
                            <p className="text-xs font-serif text-gray-400 uppercase tracking-widest leading-relaxed">Successful matches made this year alone.</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-secondary dark:text-secondary-light font-accent font-black text-xs mb-4 tracking-[0.2em] uppercase">About Us</h2>
                        <h3 className="text-4xl md:text-5xl font-serif font-black text-primary dark:text-white mb-6 leading-tight">
                            We're more than just a <br /><span className="text-secondary italic">job board.</span>
                        </h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed font-serif">
                            Etworks was built on the belief that finding a job in Ethiopia should be an exciting journey. We leverage AI-powered solutions to streamline recruitment and talent acquisition, helping companies find the right fit more effectively.
                        </p>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 leading-relaxed font-serif">
                            Our primary goal is to enhance the entire hiring process for businesses and seekers alike, providing data-driven insights and a smoother experience across the nation.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="group">
                                <h4 className="text-xl font-serif font-black text-primary dark:text-white mb-2 group-hover:text-secondary transition-colors italic">Global Reach</h4>
                                <p className="text-sm font-serif text-gray-400">Connecting talent across 50+ countries.</p>
                            </div>
                            <div className="group">
                                <h4 className="text-xl font-serif font-black text-primary dark:text-white mb-2 group-hover:text-secondary transition-colors italic">Smart Matching</h4>
                                <p className="text-sm font-serif text-gray-400">AI-driven algorithms for better relevance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
