import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { ROUTES } from '../../config/constants';
import { ArrowRight, Zap } from 'lucide-react';

const BottomCTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative w-full min-h-[700px] flex items-center overflow-hidden bg-[#0B1C2D]">
            {/* Background Image - Optimized to show the full subject */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/buttomcta.png"
                    alt="CTA Background"
                    className="w-full h-full object-cover object-[center_20%] lg:object-[8%_20%] transition-transform duration-1000"
                />
                {/* Layered Overlays for Premium Depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2D]/30 via-[#0B1C2D]/60 to-[#0B1C2D] px-4" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D] via-transparent to-transparent opacity-60" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="flex justify-end">
                    <div className="max-w-xl text-right space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary/20 backdrop-blur-xl border border-white/10 rounded-full text-secondary-light font-bold text-xs uppercase tracking-[0.2em] font-sans shadow-lg shadow-black/20">
                            <Zap size={14} className="fill-secondary-light" />
                            Elevate Your Journey
                        </div>

                        <h2 className="text-5xl md:text-7xl font-serif font-black text-white leading-[1.05] tracking-tight">
                            Ready to <span className="text-secondary-light italic">Define</span> <br />
                            The Future?
                        </h2>

                        <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed font-sans max-w-lg ml-auto">
                            Join the elite network of developers and employers on HireNest. Your next milestone starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-end gap-5 pt-6">
                            <Button
                                variant="custom"
                                size="lg"
                                onClick={() => navigate(ROUTES.REGISTER)}
                                className="bg-white text-gray-900 hover:bg-secondary hover:text-white !px-12 !py-4 !rounded-full transition-all duration-500 font-extrabold shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 group font-sans text-lg"
                            >
                                Start Your Adventure
                                <ArrowRight className="ml-2 inline-block group-hover:translate-x-2 transition-transform duration-300" size={22} />
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => navigate(ROUTES.LOGIN)}
                                className="!px-12 !py-4 !rounded-full border-white/40 text-white hover:bg-white/10 backdrop-blur-md font-bold transition-all duration-300 text-lg font-sans"
                            >
                                Explore Roles
                            </Button>
                        </div>

                        <div className="pt-10 flex items-center justify-end gap-8 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] font-sans">
                            <span className="hover:text-secondary-light transition-colors cursor-default">Global Network</span>
                            <span className="w-1.5 h-1.5 bg-secondary/40 rounded-full" />
                            <span className="hover:text-secondary-light transition-colors cursor-default">Verified Talents</span>
                            <span className="w-1.5 h-1.5 bg-secondary/40 rounded-full" />
                            <span className="hover:text-secondary-light transition-colors cursor-default">Instant Hire</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Artistic Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
        </section>
    );
};

export default BottomCTASection;
