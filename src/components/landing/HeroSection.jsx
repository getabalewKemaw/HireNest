import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Zap, Star } from 'lucide-react';
import Button from '../../components/Button';
import { ROUTES } from '../../config/constants';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center pt-32 lg:pt-40 pb-20 overflow-hidden bg-white dark:bg-[#0B1C2D] transition-colors duration-500">
            {/* Background - Extends to the very top for Navbar Glassmorphism */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-[position:35%_center] lg:bg-right bg-no-repeat transition-opacity duration-1000"
                style={{ backgroundImage: "url('/herobg.png')" }}
            >
                {/* Responsive overlay that fades out to the right where the person is */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0B1C2D] dark:via-[#0B1C2D]/80 dark:to-transparent"></div>

                {/* Secondary bottom fade to blend with next section */}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0B1C2D] via-transparent to-transparent opacity-50"></div>

                {/* Elite Blobs for atmosphere */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[120px] animate-blob pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="max-w-4xl">
                    {/* Content Section */}
                    <div className="space-y-10 animate-fade-in mt-12 md:mt-20">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-secondary/10 dark:bg-white/5 border border-secondary/10 dark:border-white/5 text-secondary dark:text-secondary-light font-accent font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                            <Zap size={14} className="animate-pulse" /> The Next-Gen Career Ecosystem
                        </div>

                        <h1 className="text-6xl md:text-[5.5rem] font-serif font-black text-primary dark:text-white leading-[1.1] tracking-tighter min-h-[160px] md:min-h-[220px]">
                            <div>Hire the <span className="text-secondary italic">Future.</span></div>
                            <div className="mt-2">Be the <span className="text-secondary">Future.</span></div>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-serif leading-relaxed max-w-2xl">
                            The world's most advanced job platform connecting elite talent with industry pioneers.
                            Built for speed, transparency, and results.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={() => navigate(ROUTES.REGISTER)}
                                className="w-full sm:w-auto font-accent translate-y-0 hover:-translate-y-2 transition-all duration-500 !px-10 shadow-xl shadow-secondary/20"
                            >
                                Get Started Now <ArrowRight size={20} className="ml-2" />
                            </Button>

                            <button className="flex items-center gap-4 group px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-all duration-300">
                                <div className="w-12 h-12 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full flex items-center justify-center text-primary dark:text-white shadow-xl group-hover:scale-110 transition-all">
                                    <Play size={18} fill="currentColor" />
                                </div>
                                <span className="font-accent font-black text-xs uppercase tracking-[0.15em] text-primary dark:text-white">Watch Demo</span>
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="pt-10 flex flex-wrap items-center gap-8">
                            <div className="flex -space-x-4">
                                {[11, 22, 33, 44].map((id, i) => (
                                    <div key={i} className="w-14 h-14 rounded-2xl border-4 border-white dark:border-[#0B1C2D] overflow-hidden shadow-2xl relative group-hover:scale-110 transition-transform cursor-pointer">
                                        <img src={`https://i.pravatar.cc/150?u=${id}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-14 h-14 rounded-2xl border-4 border-white dark:border-[#0B1C2D] bg-gray-50 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white font-accent font-black text-xs">
                                    +12k
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={14} fill="currentColor" className="text-secondary" />)}
                                </div>
                                <p className="text-sm font-bold text-gray-400">4.9/5 from verified professionals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
