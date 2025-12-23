import { useState } from 'react';
import {
    FileText,
    Sparkles,
    CheckCircle2,
    Loader2,
    Search,
    Filter
} from 'lucide-react';
import { getCategoryDisplayName, getCategoryColor } from '../../services/cvBuilderService';

const TemplateGallery = ({ templates, loading, onSelectTemplate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    // Get unique categories
    const categories = ['ALL', ...new Set(templates.map(t => t.category))];

    // Filter templates
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading templates...</p>
                </div>
            </div>
        );
    }

    if (templates.length === 0) {
        return (
            <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Templates Available</h3>
                <p className="text-gray-600">Please check back later for new templates.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 appearance-none bg-white cursor-pointer min-w-[200px]"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'ALL' ? 'All Categories' : getCategoryDisplayName(category)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{filteredTemplates.length}</span> template{filteredTemplates.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No templates match your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onSelect={onSelectTemplate}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const TemplateCard = ({ template, onSelect, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-white border border-gray-200 hover:border-blue-500 transition-all duration-300 overflow-hidden cursor-pointer animate-fade-in-up shadow-sm hover:shadow-xl"
            style={{ animationDelay: `${index * 50}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect(template)}
        >
            {/* Gradient Overlay on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

            {/* Template Preview */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    <div className="absolute top-4 left-4 right-4 space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-3/4" />
                        <div className="h-2 bg-gray-300 rounded w-1/2" />
                    </div>
                    <div className="absolute top-16 left-4 right-4 space-y-3">
                        <div className="h-2 bg-gray-300 rounded w-full" />
                        <div className="h-2 bg-gray-300 rounded w-5/6" />
                        <div className="h-2 bg-gray-300 rounded w-4/6" />
                    </div>
                </div>

                {/* Template Icon */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
                    <div className="p-6 bg-white rounded-full shadow-lg">
                        <FileText className="w-12 h-12 text-blue-600" />
                    </div>
                </div>

                {/* Sparkle Effect */}
                <div className={`absolute top-4 right-4 transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                    <div className="p-2 bg-blue-600 rounded-full shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

            {/* Template Info */}
            <div className="relative p-5 space-y-3">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold ${getCategoryColor(template.category)}`}>
                        {getCategoryDisplayName(template.category)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {template.status === 'ACTIVE' ? (
                            <span className="flex items-center space-x-1 text-green-600">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Active</span>
                            </span>
                        ) : (
                            <span className="text-gray-400">Inactive</span>
                        )}
                    </span>
                </div>

                {/* Template Name */}
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 font-heading line-clamp-1">
                    {template.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {template.description || 'Professional CV template'}
                </p>

                {/* Sections Count */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span className="flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{Object.keys(template.sections || {}).length} sections</span>
                    </span>
                </div>

                {/* Select Button */}
                <button
                    className={`w-full py-2.5 font-semibold transition-all duration-300 ${isHovered
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(template);
                    }}
                >
                    {isHovered ? 'Use This Template' : 'Select Template'}
                </button>
            </div>

            {/* Hover Border Effect */}
            <div className={`absolute inset-0 border-2 border-blue-500 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>
    );
};

export default TemplateGallery;
