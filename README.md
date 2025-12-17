# HireNest - Job Portal Frontend

A modern, production-ready React 19 frontend for the HireNest job portal platform. Built with security, scalability, and best practices in mind.

## 🚀 Tech Stack

- **React 19** - Latest React with modern hooks
- **React Router DOM** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## 🎨 Design System

### Brand Colors
- **Primary (Deep Navy)**: `#0B1C2D` - Trust & Authority
- **Secondary (Royal Blue)**: `#2563EB` - Action & Tech
- **Accent (Emerald Green)**: `#10B981` - Success & Hiring
- **Warning (Amber)**: `#F59E0B`
- **Error (Soft Red)**: `#EF4444`
- **Background**: `#F8FAFC`

### Typography
- **Primary Font**: Inter - Clean, modern, excellent readability
- **Heading Font**: Plus Jakarta Sans - Premium feel for headings

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Alert.jsx
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Page-level components
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── VerifyEmailPage.jsx
│   └── DashboardPage.jsx
├── features/           # Feature-specific components
│   └── auth/
│       ├── LoginForm.jsx
│       ├── RegisterForm.jsx
│       └── VerifyEmailForm.jsx
├── services/           # API services
│   ├── api.js          # Axios instance with interceptors
│   └── authService.js  # Authentication API calls
├── store/              # Zustand stores
│   └── authStore.js    # Authentication state
├── utils/              # Utility functions
│   ├── validation.js   # Form validation
│   └── tokenUtils.js   # JWT token handling
├── config/             # Configuration
│   └── constants.js    # App constants
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🔐 Security Features

### Token Management
- **Access tokens** stored in memory only (never localStorage)
- **Refresh tokens** in HttpOnly cookies (backend managed)
- Automatic token refresh on 401 responses
- Token expiration checking

### Input Validation
- Client-side validation for all forms
- XSS prevention through input sanitization
- CSRF protection via cookies
- Field-level and form-level error handling

### Route Protection
- Protected routes with authentication check
- Role-based access control (RBAC)
- Automatic redirect to login for unauthorized access

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:8080`

### Installation

1. Clone the repository
```bash
cd HireNest
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENV=development
```

4. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎯 Features

### Authentication System
- ✅ User registration with email verification
- ✅ Login with JWT tokens
- ✅ Email verification with OTP
- ✅ Password reset flow
- ✅ Automatic token refresh
- ✅ Secure logout
- ✅ Role-based dashboards (Admin, Employer, Job Seeker)

### User Experience
- ✅ Responsive design (mobile-first)
- ✅ Loading states for all async operations
- ✅ Form validation with real-time feedback
- ✅ Error handling with user-friendly messages
- ✅ Accessible forms (ARIA labels, keyboard navigation)
- ✅ Clean, premium UI design

## 🔌 API Integration

### Base Configuration
```javascript
// Configured in src/services/api.js
baseURL: 'http://localhost:8080'
timeout: 30000ms
withCredentials: true (for cookies)
```

### Endpoints Used
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/verify-otp` - Email verification
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/verify-reset-otp` - Verify reset OTP
- `POST /api/v1/auth/reset-password` - Reset password

### Request Interceptors
- Automatically adds `Authorization: Bearer <token>` header
- Checks token expiration before requests

### Response Interceptors
- Handles 401 errors with automatic token refresh
- Redirects to login on authentication failure
- Centralized error handling

## 🎨 Component Usage

### Button Component
```jsx
import Button from './components/Button';

<Button 
  variant="primary"  // primary, secondary, outline, danger, success
  size="md"          // sm, md, lg
  loading={false}
  disabled={false}
  fullWidth={false}
  onClick={handleClick}
>
  Click Me
</Button>
```

### Input Component
```jsx
import Input from './components/Input';

<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  onBlur={handleBlur}
  error={errors.email}
  placeholder="you@example.com"
  required
/>
```

### Alert Component
```jsx
import Alert from './components/Alert';

<Alert
  type="success"  // success, error, warning, info
  message="Operation successful!"
  onClose={() => setAlert(null)}
  dismissible={true}
/>
```

## 🛡️ Best Practices Implemented

### Code Quality
- ✅ Functional components with hooks
- ✅ Clean, readable code with meaningful names
- ✅ No magic numbers (constants file)
- ✅ Proper error boundaries
- ✅ Consistent code formatting

### Performance
- ✅ Lazy loading for routes (can be added)
- ✅ Optimized re-renders
- ✅ Proper dependency arrays in useEffect
- ✅ Memoization where needed

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly

### Security
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Secure token storage
- ✅ Input sanitization
- ✅ No sensitive data in URLs

## 🧪 Testing (To Be Added)

Recommended testing setup:
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8080` |
| `VITE_ENV` | Environment | `development` |

## 🤝 Contributing

1. Follow the existing code structure
2. Use the established design system
3. Write clean, documented code
4. Test all features before committing
5. Follow security best practices

## 📄 License

This project is part of the HireNest platform.

## 🔗 Related

- Backend API: Spring Boot application on port 8080
- Database: PostgreSQL with Flyway migrations

## 📞 Support

For issues or questions, please contact the development team.

---

Built with ❤️ using React 19 and modern web technologies
