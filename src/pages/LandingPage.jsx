import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { ROUTES } from '../config/constants';

/**
 * Landing Page Component
 */
const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-secondary py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 leading-tight">
                Find Your Dream Job Today
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Connect with top employers and discover opportunities that match your skills and aspirations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={() => navigate(ROUTES.REGISTER)}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="!bg-white !text-primary hover:!bg-gray-100"
                >
                  Sign In
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-white">
                      <div className="font-semibold">10,000+ Jobs</div>
                      <div className="text-sm text-white/70">Available positions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="text-white">
                      <div className="font-semibold">5,000+ Companies</div>
                      <div className="text-sm text-white/70">Trusted employers</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="text-white">
                      <div className="font-semibold">50,000+ Users</div>
                      <div className="text-sm text-white/70">Active job seekers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">
              Why Choose HireNest?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              We make job searching and hiring simple, efficient, and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-3">
                Smart Job Matching
              </h3>
              <p className="text-text-secondary">
                Our AI-powered algorithm matches you with jobs that fit your skills, experience, and career goals.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-3">
                Easy Application
              </h3>
              <p className="text-text-secondary">
                Apply to multiple jobs with one click. Track your applications and get real-time updates.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-3">
                Secure & Private
              </h3>
              <p className="text-text-secondary">
                Your data is protected with enterprise-grade security. Control who sees your profile.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">
              How It Works
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-secondary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-heading font-bold text-primary mb-3">
                Create Your Profile
              </h3>
              <p className="text-text-secondary">
                Sign up and build your professional profile in minutes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-heading font-bold text-primary mb-3">
                Search & Apply
              </h3>
              <p className="text-text-secondary">
                Browse thousands of jobs and apply with one click
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-warning text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-heading font-bold text-primary mb-3">
                Get Hired
              </h3>
              <p className="text-text-secondary">
                Connect with employers and land your dream job
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-secondary to-secondary-dark">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of professionals who found their dream jobs through HireNest
          </p>
          <Button
            variant="success"
            size="lg"
            onClick={() => navigate(ROUTES.REGISTER)}
            className="!text-lg !px-8 !py-4"
          >
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
