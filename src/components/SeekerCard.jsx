import React from 'react';
import { MapPin, Briefcase, ChevronRight, User, Star } from 'lucide-react';
import Button from './Button';

const SeekerCard = ({ seeker, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group bg-white dark:bg-gray-800 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-700 hover:border-secondary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all cursor-pointer relative overflow-hidden"
        >
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-all"></div>

            <div className="flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-2xl font-black text-secondary border border-secondary/20 overflow-hidden shadow-sm shadow-secondary/10 group-hover:scale-105 transition-transform">
                        {seeker.profileImageUrl ? (
                            <img src={seeker.profileImageUrl} alt={seeker.firstName} className="w-full h-full object-cover" />
                        ) : (
                            seeker.firstName.charAt(0)
                        )}
                    </div>
                    {seeker.completion === "100%" && (
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            <Star size={10} className="fill-emerald-500" /> Top Talent
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-bold text-primary dark:text-white mb-1 group-hover:text-secondary transition-colors">
                        {seeker.firstName} {seeker.lastName}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        <Briefcase size={14} className="text-secondary" />
                        {seeker.title}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    {seeker.skills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-700 group-hover:border-secondary/20 transition-all">
                            {skill}
                        </span>
                    ))}
                    {seeker.skills?.length > 3 && (
                        <span className="px-3 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100 dark:border-gray-700">
                            +{seeker.skills.length - 3}
                        </span>
                    )}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary dark:text-gray-400 font-bold">
                        <MapPin size={14} className="text-gray-400" />
                        {seeker.city ? `${seeker.city}, ${seeker.country}` : 'Remote'}
                    </div>
                    <div className="text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeekerCard;
