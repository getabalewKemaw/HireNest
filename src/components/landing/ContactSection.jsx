import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import Button from '../Button';

const ContactSection = () => {
    return (
        <section id="contact" className="py-32 bg-transparent relative z-10 transition-colors duration-500 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/10 text-secondary text-[10px] font-accent font-black uppercase tracking-[0.2em]">
                        <MessageSquare size={14} /> Get in Touch
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif font-black text-primary dark:text-white leading-[0.95] tracking-tight lowercase">
                        Reach <span className="text-secondary italic">out.</span>
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xl font-serif leading-relaxed max-w-xl mx-auto">
                        Have questions? Our team is here to help you navigate the future of hiring.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
                    {/* Left Side: Map */}
                    <div className="relative group p-1 bg-gradient-to-br from-secondary/20 via-transparent to-accent/20 rounded-[3rem] shadow-2xl">
                        <div className="relative bg-white dark:bg-[#0F2439] rounded-[2.9rem] overflow-hidden h-[500px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62929.82031113907!2d39.48812307109249!3d9.671319571511194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1649bd98a70be815%3A0xf607fe72734ef36d!2sDebre%20Birhan!5e0!3m2!1sen!2set!4v1766946583102!5m2!1sen!2set"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Office Location"
                                className="grayscale hover:grayscale-0 transition-all duration-700"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right Side: Company Info & CTA */}
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all hover:shadow-lg">
                                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-3">
                                    <MapPin size={20} />
                                </div>
                                <h4 className="text-[10px] font-accent font-black text-gray-400 uppercase tracking-widest mb-1">Location</h4>
                                <p className="text-base font-serif font-black text-primary dark:text-white italic leading-tight">Debre Birhan, Ethiopia</p>
                            </div>

                            <div className="group p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all hover:shadow-lg">
                                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-3">
                                    <Mail size={20} />
                                </div>
                                <h4 className="text-[10px] font-accent font-black text-gray-400 uppercase tracking-widest mb-1">Email</h4>
                                <p className="text-base font-serif font-black text-primary dark:text-white italic leading-tight break-all">etworkssupport@gmail.com</p>
                            </div>

                            <div className="group p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all hover:shadow-lg">
                                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-3">
                                    <Phone size={20} />
                                </div>
                                <h4 className="text-[10px] font-accent font-black text-gray-400 uppercase tracking-widest mb-1">Phone</h4>
                                <p className="text-base font-serif font-black text-primary dark:text-white italic leading-tight">+251 900 000 000</p>
                            </div>

                            <div className="group p-5 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all hover:shadow-lg">
                                <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-3">
                                    <Clock size={20} />
                                </div>
                                <h4 className="text-[10px] font-accent font-black text-gray-400 uppercase tracking-widest mb-1">Hours</h4>
                                <p className="text-base font-serif font-black text-primary dark:text-white italic leading-tight">Mon-Fri: 9AM-6PM</p>
                            </div>
                        </div>

                        {/* Section CTA - True Brand Colors & Optimized Size */}
                        <div className="relative p-7 rounded-[2.5rem] bg-[#0B1C2D] border border-white/5 bg-gradient-to-br from-[#0B1C2D] to-[#152e46] overflow-hidden group shadow-2xl">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                            <div className="relative z-10 flex flex-col justify-center gap-4">
                                <div className="text-left">
                                    <h3 className="text-2xl font-serif font-black text-white italic mb-1 uppercase tracking-tight">Want to work together?</h3>
                                    <p className="text-gray-400 font-serif text-sm">Join our network of elite talent and world-class companies.</p>
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="!rounded-xl shadow-xl shadow-secondary/20 !px-10 !py-3 font-accent uppercase text-[10px] font-black tracking-widest hover:scale-105"
                                    >
                                        Get Started
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
