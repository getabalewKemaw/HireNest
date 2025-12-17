import useAuthStore from '../store/authStore';

/**
 * Dashboard Page Component
 * Role-specific dashboard content
 */
const DashboardPage = () => {
  const { user } = useAuthStore();
  
  const getDashboardContent = () => {
    switch (user?.userType) {
      case 'ADMIN':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-primary">
              Admin Dashboard
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Total Users</div>
                <div className="text-3xl font-bold text-primary">1,234</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Active Jobs</div>
                <div className="text-3xl font-bold text-secondary">567</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Applications</div>
                <div className="text-3xl font-bold text-accent">8,901</div>
              </div>
            </div>
          </div>
        );
      
      case 'EMPLOYER':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-primary">
              Employer Dashboard
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Active Jobs</div>
                <div className="text-3xl font-bold text-secondary">12</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Applications</div>
                <div className="text-3xl font-bold text-accent">145</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Interviews</div>
                <div className="text-3xl font-bold text-warning">23</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-heading font-bold text-primary mb-4">
                Recent Applications
              </h3>
              <p className="text-text-secondary">No recent applications</p>
            </div>
          </div>
        );
      
      case 'SEEKER':
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-primary">
              Job Seeker Dashboard
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Applications</div>
                <div className="text-3xl font-bold text-secondary">8</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Interviews</div>
                <div className="text-3xl font-bold text-accent">3</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-text-secondary mb-2">Saved Jobs</div>
                <div className="text-3xl font-bold text-warning">15</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-heading font-bold text-primary mb-4">
                Recommended Jobs
              </h3>
              <p className="text-text-secondary">No recommendations yet. Complete your profile to get personalized job matches.</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">
            Welcome back, {user?.email}!
          </h1>
          <p className="text-text-secondary">
            Here's what's happening with your account
          </p>
        </div>
        
        {getDashboardContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
