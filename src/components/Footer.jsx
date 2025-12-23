import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary dark:bg-gray-950 text-white pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2 mb-8 group">
              <img src="/image.png" alt="HireNest" className="h-8 w-auto invert brightness-0" />
              <span className="text-3xl font-heading font-bold tracking-tight">HireNest</span>
            </Link>
            <p className="text-gray-400 dark:text-gray-500 mb-8 leading-relaxed text-lg font-light">
              Connecting talented professionals with amazing opportunities.
              Your next career move starts here. Experience the future of hiring.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-secondary transition-all hover:-translate-y-1 shadow-lg">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-secondary transition-all hover:-translate-y-1 shadow-lg">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="font-bold text-xl mb-8">Product</h4>
            <ul className="space-y-4 font-light text-lg">
              <li>
                <Link to={ROUTES.HOME} className="text-gray-400 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HOME} className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HOME} className="text-gray-400 hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:pl-5">
            <h4 className="font-bold text-xl mb-8">Company</h4>
            <ul className="space-y-4 font-light text-lg">
              <li>
                <Link to={ROUTES.HOME} className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HOME} className="text-gray-400 hover:text-white transition-colors">
                  Careers <span className="ml-2 px-2 py-0.5 bg-secondary rounded text-xs font-bold uppercase">Hiring</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.HOME} className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-xl mb-8">Legal</h4>
            <ul className="space-y-4 font-light text-lg">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-base font-light">
            &copy; {currentYear} HireNest Inc. All rights reserved. Crafted with ♥ for professionals.
          </p>
          <div className="flex space-x-8 text-gray-500 font-light text-sm">
            <Link to="#" className="hover:text-white transition-colors tracking-widest uppercase">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors tracking-widest uppercase">Terms</Link>
            <Link to="#" className="hover:text-white transition-colors tracking-widest uppercase">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
