import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { ChevronLeft, Home } from 'lucide-react';

/**
 * Authentication Layout
 * Wraps auth pages with a consistent professional design.
 */
const AuthLayout = ({ children, title, subtitle, backButton = false }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative flex items-center justify-center overflow-hidden">
            {/* Global Background Grid & Decorative Elements */}
            <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />


            <div className="flex w-full min-h-screen h-screen bg-white dark:bg-gray-800 shadow-none overflow-hidden relative z-10 mx-auto border-none lg:border-l border-gray-100 dark:border-gray-700">
                {/* Left Side: Image/Info (Hidden on Mobile) */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative bg-primary overflow-hidden">
                    <img
                        src="/auth_side_image_v2.png"
                        alt="Authenticating"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[10000ms] hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />

                    <div className="relative z-20 mt-auto p-20 xl:p-24">

                        <h1 className="text-5xl xl:text-7xl font-serif font-black text-white mb-8 leading-[1.1] tracking-tight">
                            Unlock your <span className="text-secondary-light underline decoration-accent-light underline-offset-[12px] italic font-medium">potential</span> today.
                        </h1>
                        <p className="text-xl xl:text-2xl text-blue-100/70 font-light leading-relaxed max-w-xl font-heading">
                            Join our community of over 10,000 professionals finding their dream roles through AI-driven matching.
                        </p>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col p-8 lg:p-16 xl:p-24 overflow-y-auto no-scrollbar bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-16">
                        {backButton ? (
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2.5 rounded-xl text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group flex items-center gap-2"
                                aria-label="Go back"
                            >
                                <ChevronLeft size={22} className="transform group-hover:-translate-x-2 transition-transform duration-300" />
                                <span className="text-xs font-bold tracking-[0.2em] uppercase">Back</span>
                            </button>
                        ) : <div />}

                        <Link
                            to={ROUTES.HOME}
                            className="p-3 rounded-xl text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-blue-50/50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 group"
                            title="Go to Home"
                        >
                            <Home size={20} className="group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase">Home</span>
                        </Link>
                    </div>

                    <div className="max-w-md w-full mx-auto my-auto animate-fade-in-up">
                        <div className="flex justify-center mb-12">
                            <img src="/image.png" alt="EtWorks" className="h-20 w-auto dark:invert rounded-3xl" />
                        </div>

                        <div className="mb-14 text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary dark:text-white mb-5 tracking-tight">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-text-secondary dark:text-gray-400 text-lg lg:text-xl font-light leading-relaxed font-heading">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            {children}
                        </div>

                        <div className="mt-16 text-center text-sm text-gray-400 dark:text-gray-500 font-light tracking-widest uppercase">
                            &copy; {new Date().getFullYear()} EtWorks. AI-Powered Careers.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AuthLayout;
