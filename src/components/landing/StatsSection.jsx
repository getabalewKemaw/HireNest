import { TrendingUp, Globe, Users2, Building2 } from 'lucide-react';

const stats = [
    {
        label: 'Global Placements',
        value: '124k+',
        icon: Globe,
        detail: 'Across 160 countries',
        color: 'text-secondary',
        bg: 'bg-secondary/10'
    },
    {
        label: 'Partner Companies',
        value: '2.5k+',
        icon: Building2,
        detail: 'Tech giants & startups',
        color: 'text-primary dark:text-white',
        bg: 'bg-primary/10 dark:bg-white/10'
    },
    {
        label: 'Candidate Growth',
        value: '8.4M',
        icon: Users2,
        detail: 'Verified professionals',
        color: 'text-accent',
        bg: 'bg-accent/10'
    },
    {
        label: 'Avg. Retention Rate',
        value: '94%',
        icon: TrendingUp,
        detail: 'Best in the industry',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10'
    },
];

const StatsSection = () => {
    return (
        <section className="py-24 bg-white dark:bg-[#0B1C2D] relative overflow-hidden transition-colors duration-500">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center lg:items-start text-center lg:text-left group animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                            <div className={`${stat.bg} ${stat.color} p-5 rounded-3xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-black/[0.02]`}>
                                <stat.icon size={32} strokeWidth={2.5} />
                            </div>
                            <div className={`text-5xl lg:text-6xl font-serif font-black mb-4 tracking-tighter italic ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-primary dark:text-white font-accent font-black text-xs uppercase tracking-[0.2em] mb-2 leading-none">
                                {stat.label}
                            </div>
                            <div className="text-gray-400 dark:text-gray-500 font-accent font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                                {stat.detail}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
