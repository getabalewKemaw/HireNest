import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { ROUTES } from '../../config/constants';

const CTASection = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 px-4 bg-transparent relative z-10 transition-colors duration-300">
            <div className="max-w-6xl mx-auto text-center bg-primary dark:bg-white/5 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden shadow-2xl shadow-primary/20 dark:shadow-black/50 border border-white/5">
                {/* Background blobs */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-secondary/30 rounded-full mix-blend-overlay filter blur-[100px] opacity-40 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/30 rounded-full mix-blend-overlay filter blur-[100px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif font-black text-white mb-8 leading-tight">
                        Ready to jumpstart <br /> your <span className="text-secondary-light italic">career?</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100/60 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                        Join thousands of professionals finding their dream jobs on HireNest today.
                        Your next big opportunity is just a click away.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => navigate(ROUTES.REGISTER)}
                            className="!px-12 !rounded-2xl transition-all shadow-xl shadow-secondary/20"
                        >
                            Create Free Account
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate(ROUTES.LOGIN)}
                            className="!px-12 !rounded-2xl backdrop-blur-sm"
                        >
                            Log In
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-accent-light">✓</span> No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-accent-light">✓</span> Cancel anytime
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
