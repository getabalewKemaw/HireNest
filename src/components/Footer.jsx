import { Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';

/**
 * Footer Component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-heading font-bold mb-4">HireNest</h3>
            <p className="text-text-white/80 mb-4">
              Connecting talented professionals with amazing opportunities. 
              Your next career move starts here.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.HOME} className="text-text-white/80 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LOGIN} className="text-text-white/80 hover:text-accent transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER} className="text-text-white/80 hover:text-accent transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-text-white/80 hover:text-accent transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-text-white/80 hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-text-white/80 hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-primary-light mt-8 pt-8 text-center text-text-white/60">
          <p>&copy; {currentYear} HireNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
