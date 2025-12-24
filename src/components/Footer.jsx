import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary dark:bg-[#0B1C2D] text-white pt-24 pb-12 transition-colors duration-500 relative overflow-hidden border-t border-white/5">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to={ROUTES.HOME} className="flex items-center space-x-3 mb-8 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary   group-hover:opacity-60 transition-opacity" />
                <img src="/image.png" alt="HireNest" className="h-10 w-auto invert brightness-0 relative z-10" />
              </div>
              <span className="text-3xl font-heading font-black tracking-tight text-white group-hover:text-secondary transition-colors">EtWorks</span>
            </Link>
            <p className="text-gray-400 dark:text-gray-400 mb-8 leading-relaxed text-lg font-serif max-w-sm">
              Connecting elite talent with world-class opportunities. The future of hiring is here, and it's powered by intelligence.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, name: 'Twitter' },
                { icon: Linkedin, name: 'LinkedIn' },
                { icon: Instagram, name: 'Instagram' }
              ].map((social, idx) => (
                <a key={idx} href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-secondary hover:border-secondary transition-all duration-300 hover:-translate-y-1 shadow-lg group">
                  <social.icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-2" />

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-8 tracking-wide">Product</h4>
            <ul className="space-y-4">
              {['Features', 'Pricing', 'Enterprise', 'Success Stories'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-secondary transition-colors font-serif">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-8 tracking-wide">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-secondary transition-colors font-serif flex items-center gap-2">
                    {item}
                    {item === 'Careers' && (
                      <span className="px-2 py-0.5 bg-accent/20 text-accent text-[10px] font-bold uppercase rounded-full tracking-wider">Hiring</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-white text-lg mb-8 tracking-wide">Legal</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-secondary transition-colors font-serif">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm font-serif">
            &copy; {currentYear} HireNest Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-serif">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
