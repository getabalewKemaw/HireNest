import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqData = [
    {
        question: "How do I start searching for jobs?",
        answer: "Simply create an account, complete your profile, and use our advanced search filters to find roles that match your skills and preferences. We'll also send you personalized recommendations."
    },
    {
        question: "Is Etworks free for job seekers?",
        answer: "Yes, searching for jobs and applying on Etworks is completely free for all seekers. We also offer premium features for those who want extra visibility."
    },
    {
        question: "How can I post a job as an employer?",
        answer: "Once you register as an Employer, you can navigate to the 'Post a Job' section in your dashboard. Fill in the job details, and your listing will be live instantly."
    },
    {
        question: "How does the matching algorithm work?",
        answer: "Our AI-powered algorithm analyzes your skills, experience, and preferences to match you with job descriptions that have the highest compatibility scores."
    },
    {
        question: "How do I contact support?",
        answer: "You can reach out to our dedicated support team 24/7 through the 'Help' section in your dashboard or by emailing getabalewkemaw@gmail.com."
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-white dark:bg-[#0B1C2D] transition-colors duration-500">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-secondary dark:text-secondary-light font-accent font-black text-xs mb-4 uppercase tracking-[0.2em]">Support</h2>
                    <h3 className="text-4xl md:text-5xl font-serif font-black text-primary dark:text-white mb-4">
                        Got <span className="text-secondary italic">Questions?</span>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto font-serif">
                        Everything you need to know about Etworks and how we help you find your next big opportunity.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`group border rounded-[2rem] transition-all duration-500 overflow-hidden ${openIndex === index
                                ? 'bg-gray-50 dark:bg-white/[0.03] border-secondary/20 shadow-2xl shadow-primary/5'
                                : 'border-gray-100 dark:border-white/5 bg-white/50 dark:bg-white/[0.01] hover:border-secondary/20'
                                }`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-8 py-8 flex items-center justify-between text-left focus:outline-none"
                            >
                                <span className={`text-xl font-serif font-black transition-colors duration-300 italic ${openIndex === index ? 'text-secondary' : 'text-primary dark:text-gray-200'
                                    }`}>
                                    {item.question}
                                </span>
                                <div className={`p-3 rounded-2xl transition-all duration-300 ${openIndex === index ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-110' : 'bg-secondary/5 text-secondary dark:bg-white/5'
                                    }`}>
                                    {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                                </div>
                            </button>

                            <div
                                className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 py-8 px-8 border-t border-gray-100 dark:border-white/5' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg font-serif">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
