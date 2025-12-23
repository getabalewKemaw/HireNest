# CV Builder - Frontend Implementation

## 🎨 Overview

The CV Builder is a **premium, AI-powered** feature that allows job seekers to create professional CVs using pre-designed templates with automatic data filling from their profiles.

## ✨ Features

### 1. **Template Gallery** 
- Beautiful grid layout with hover effects
- Search and filter by category
- Real-time template preview
- Category badges (TECH, BUSINESS, CREATIVE, etc.)
- Responsive design

### 2. **Auto-Fill Intelligence**
- Automatically fills CV data from seeker profile
- Pulls from multiple sources:
  - Personal information (name, email, phone)
  - Skills and expertise
  - Projects and portfolio
  - Social links
  - Sectors and tags
- Smart field matching
- Empty fields for missing data

### 3. **Interactive CV Editor**
- Collapsible sections for better organization
- Array field management (add/remove items)
- Real-time validation
- Required field indicators
- Pro tips sidebar
- Smooth animations

### 4. **Live Preview**
- Professional CV layout
- Print-ready design
- Section-based rendering
- Icon integration
- Color-coded elements

### 5. **Save & Download**
- Save CV to profile
- Download as PDF (preparation ready)
- Validation before save/download
- Success/error notifications

## 📁 File Structure

```
src/
├── pages/
│   └── seeker/
│       └── CVBuilderPage.jsx          # Main CV Builder page
├── components/
│   └── cv/
│       ├── TemplateGallery.jsx        # Template selection
│       ├── CVEditor.jsx               # CV editing interface
│       └── CVPreview.jsx              # CV preview component
└── services/
    └── cvBuilderService.js            # API integration
```

## 🎯 User Flow

```
1. Select Template
   ↓
2. Auto-Fill Data (from profile)
   ↓
3. Edit & Customize
   ↓
4. Preview CV
   ↓
5. Save & Download
```

## 🚀 Getting Started

### Access the CV Builder

1. **Login as a Job Seeker**
2. **Navigate to**: Dashboard → Career & Growth → CV Builder
3. **Or directly**: `/cv-builder`

### Create Your First CV

1. **Browse Templates**: View all available templates
2. **Filter by Category**: Use the dropdown to filter templates
3. **Search**: Find specific templates by name
4. **Select Template**: Click "Use This Template"
5. **Review Auto-Filled Data**: Check pre-filled information
6. **Edit Sections**: Expand/collapse sections to edit
7. **Add More Data**: Use "+" buttons to add experiences, projects, etc.
8. **Preview**: Click "Preview" to see your CV
9. **Save**: Click "Save" to store your CV
10. **Download**: Click "Download PDF" to get your CV

## 🎨 Design System

### Colors

```javascript
Primary: Blue (#2563EB)
Secondary: Indigo (#4F46E5)
Success: Green (#10B981)
Warning: Amber (#F59E0B)
Error: Red (#EF4444)
```

### Typography

```javascript
Headings: 'Plus Jakarta Sans'
Body: 'Inter'
```

### Animations

- **Fade In Up**: Template cards, sections
- **Hover Effects**: Template cards, buttons
- **Smooth Transitions**: All interactive elements

## 📡 API Integration

### Endpoints Used

```javascript
// Get active templates
GET /api/v1/cv-builder/templates

// Get template with auto-fill
GET /api/v1/cv-builder/builder/{templateId}

// Preview CV
POST /api/v1/cv-builder/preview

// Download CV
POST /api/v1/cv-builder/download

// Save CV
POST /api/v1/seekers/profile/details/cv
PUT /api/v1/seekers/profile/details/cv

// Get CV
GET /api/v1/seekers/profile/details/cv
```

### Service Functions

```javascript
import cvBuilderService from '../services/cvBuilderService';

// Get templates
const templates = await cvBuilderService.getActiveTemplates();

// Get template with auto-fill
const data = await cvBuilderService.getTemplateWithAutoFill(templateId);

// Save CV
await cvBuilderService.saveCV(cvData);

// Download CV
await cvBuilderService.downloadCV(cvData);
```

## 🎨 Component Details

### TemplateGallery

**Props:**
- `templates` (array): List of templates
- `loading` (boolean): Loading state
- `onSelectTemplate` (function): Template selection handler

**Features:**
- Search functionality
- Category filtering
- Hover effects
- Responsive grid
- Loading states

### CVEditor

**Props:**
- `template` (object): Selected template
- `cvData` (object): Current CV data
- `onChange` (function): Data change handler
- `validationErrors` (array): Validation errors

**Features:**
- Collapsible sections
- Dynamic field rendering
- Array field management
- Validation display
- Tips panel

### CVPreview

**Props:**
- `template` (object): Selected template
- `cvData` (object): CV data to preview

**Features:**
- Professional layout
- Section rendering
- Icon integration
- Print-ready design

## 🔧 Customization

### Adding New Template Categories

```javascript
// In cvBuilderService.js
export const getCategoryDisplayName = (category) => {
  const categories = {
    'TECH': 'Technology',
    'BUSINESS': 'Business',
    'YOUR_CATEGORY': 'Your Category Name',
    // Add more...
  };
  return categories[category] || category;
};

export const getCategoryColor = (category) => {
  const colors = {
    'TECH': 'bg-blue-100 text-blue-700',
    'YOUR_CATEGORY': 'bg-purple-100 text-purple-700',
    // Add more...
  };
  return colors[category] || 'bg-gray-100 text-gray-700';
};
```

### Customizing CV Preview Layout

Edit `CVPreview.jsx` to modify the CV layout:

```javascript
// Example: Change header background
<div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
  {/* Change gradient colors */}
</div>
```

## 🎯 Validation Rules

### Required Fields

Fields marked with `*` in the template are required:

```javascript
{
  "sections": {
    "experience": {
      "job_title": { "required": true },
      "company_name": { "required": true },
      "start_date": { "required": true },
      "end_date": { "required": false }
    }
  }
}
```

### Validation Logic

```javascript
const validation = validateCVData(cvData, template.sections);
if (!validation.isValid) {
  // Show errors
  setValidationErrors(validation.errors);
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

### Mobile Optimizations

- Stacked layout
- Touch-friendly buttons
- Simplified navigation
- Optimized spacing

## 🚀 Performance

### Optimizations

1. **Lazy Loading**: Components loaded on demand
2. **Memoization**: Expensive calculations cached
3. **Debouncing**: Search input debounced
4. **Virtual Scrolling**: Large lists optimized

### Loading States

- Template loading skeleton
- Save/download loading indicators
- Smooth transitions

## 🎨 Premium Features

### Visual Excellence

- ✅ Gradient backgrounds
- ✅ Smooth animations
- ✅ Hover effects
- ✅ Shadow effects
- ✅ Icon integration
- ✅ Color-coded sections

### User Experience

- ✅ Auto-fill intelligence
- ✅ Real-time validation
- ✅ Pro tips
- ✅ Progress indicators
- ✅ Success/error notifications
- ✅ Keyboard shortcuts (coming soon)

## 🔮 Future Enhancements

### Planned Features

1. **PDF Generation**
   - Client-side PDF generation
   - Multiple export formats
   - Custom styling options

2. **Template Customization**
   - Color themes
   - Font selection
   - Layout variations

3. **AI Suggestions**
   - Content recommendations
   - Skill suggestions
   - Grammar checking

4. **Version History**
   - Save multiple versions
   - Compare versions
   - Restore previous versions

5. **Sharing**
   - Public CV link
   - Social media sharing
   - QR code generation

## 🐛 Troubleshooting

### Common Issues

**Templates not loading:**
```javascript
// Check API connection
// Verify authentication token
// Check browser console for errors
```

**Auto-fill not working:**
```javascript
// Ensure profile data is complete
// Check field name matching
// Verify template structure
```

**Save/Download failing:**
```javascript
// Check validation errors
// Verify required fields
// Check network connection
```

## 📚 Best Practices

### For Users

1. **Complete your profile first** for better auto-fill
2. **Use action verbs** in descriptions
3. **Quantify achievements** with numbers
4. **Keep it concise** and relevant
5. **Proofread** before downloading

### For Developers

1. **Follow component structure**
2. **Use TypeScript** for type safety (future)
3. **Write tests** for critical paths
4. **Document changes**
5. **Follow design system**

## 🎓 Examples

### Template Structure Example

```json
{
  "id": "uuid-1",
  "name": "Senior Software Engineer",
  "category": "TECH",
  "description": "Professional CV for senior technical roles",
  "sections": {
    "header": {
      "title": { "required": true },
      "professional_summary": { "required": true }
    },
    "experience": {
      "job_title": { "required": true },
      "company_name": { "required": true },
      "start_date": { "required": true },
      "end_date": { "required": false },
      "description": { "required": true },
      "technologies": { "required": false }
    }
  }
}
```

### CV Data Example

```json
{
  "header": {
    "title": "John Doe - Senior Backend Developer",
    "professional_summary": "Experienced developer with 5+ years..."
  },
  "experience": [
    {
      "job_title": "Backend Engineer",
      "company_name": "Tech Corp",
      "start_date": "2021-01",
      "end_date": "2024-12",
      "description": "Built scalable REST APIs...",
      "technologies": ["Java", "Spring Boot", "PostgreSQL"]
    }
  ]
}
```

## 🤝 Contributing

### Adding New Features

1. Create feature branch
2. Implement changes
3. Write tests
4. Update documentation
5. Submit pull request

### Code Style

- Use ESLint configuration
- Follow Prettier formatting
- Write meaningful comments
- Use descriptive variable names

## 📄 License

This feature is part of the HireNest platform.

---

**Built with ❤️ by the HireNest Team**

For questions or support, contact: support@hirenest.com
