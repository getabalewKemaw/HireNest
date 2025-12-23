import React, { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    FileText,
    Eye,
    Search,
    Filter,
    X,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Code
} from 'lucide-react';
import {
    getAllTemplates,
    createTemplate,
    deleteTemplate,
    getCategoryDisplayName,
    getCategoryColor
} from '../../services/cvBuilderService';

const AdminCVTemplatesPage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllTemplates();
            setTemplates(data || []);
        } catch (err) {
            setError('Failed to load templates. Please try again.');
            console.error('Error loading templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTemplate = async (templateData) => {
        try {
            setLoading(true);
            setError(null);
            await createTemplate(templateData);
            setSuccess('Template created successfully!');
            setShowCreateModal(false);
            loadTemplates();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create template. Please try again.');
            console.error('Error creating template:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTemplate = async (templateId) => {
        if (!window.confirm('Are you sure you want to delete this template? This will make it unavailable for new CVs.')) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await deleteTemplate(templateId);
            setSuccess('Template deleted successfully!');
            loadTemplates();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to delete template. Please try again.');
            console.error('Error deleting template:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'ALL' || template.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['ALL', 'TECH', 'BUSINESS', 'CREATIVE', 'HEALTHCARE', 'EDUCATION', 'FINANCE', 'MARKETING', 'SALES', 'OTHER'];

    return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CV Template Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage professional structures for your candidates</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Template</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Total Templates</p>
                    <p className="text-2xl font-bold text-slate-900">{templates.length}</p>
                </div>
                <div className="bg-white p-6 border border-slate-200 shadow-sm border-l-4 border-l-green-500">
                    <p className="text-sm font-medium text-slate-500">Active Structures</p>
                    <p className="text-2xl font-bold text-slate-900">{templates.filter(t => t.status === 'ACTIVE').length}</p>
                </div>
                <div className="bg-white p-6 border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                    <p className="text-sm font-medium text-slate-500">Categories</p>
                    <p className="text-2xl font-bold text-slate-900">{new Set(templates.map(t => t.category)).size}</p>
                </div>
                <div className="bg-white p-6 border border-slate-200 shadow-sm border-l-4 border-l-indigo-500">
                    <p className="text-sm font-medium text-slate-500">Primary Industry</p>
                    <p className="text-2xl font-bold text-slate-900">Tech</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="text-slate-400 w-5 h-5" />
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-slate-50 border border-slate-200 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full md:w-[200px]"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'ALL' ? 'All Categories' : getCategoryDisplayName(cat)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center justify-between text-red-700 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 mr-3" />
                        <p className="font-medium">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 flex items-center justify-between text-green-700 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 mr-3" />
                        <p className="font-medium">{success}</p>
                    </div>
                    <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Content grid */}
            {loading && templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Synchronizing with template registry...</p>
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="bg-white border border-slate-200 py-20 text-center shadow-sm">
                    <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                        <FileText className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">No matching templates</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your filters or create a new one.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((tpl) => (
                        <div
                            key={tpl.id}
                            className="bg-white border border-slate-200 hover:border-blue-400 transition-all duration-300 group relative overflow-hidden flex flex-col"
                        >
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 text-xs font-bold tracking-wider uppercase ${getCategoryColor(tpl.category)}`}>
                                        {getCategoryDisplayName(tpl.category)}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setSelectedTemplate(tpl)}
                                            className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors"
                                            title="View Configuration"
                                        >
                                            <Code className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTemplate(tpl.id)}
                                            className="p-2 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors"
                                            title="Delete Template"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">{tpl.name}</h3>
                                <p className="text-slate-500 text-sm line-clamp-3 mb-4">{tpl.description || 'No description provided for this template structure.'}</p>
                                <div className="flex items-center text-xs text-slate-400 font-medium">
                                    <FileText className="w-3.5 h-3.5 mr-1" />
                                    <span>{Object.keys(tpl.sections || {}).length} Structure Sections</span>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 mt-auto flex justify-between items-center">
                                <span className="text-xs text-slate-400">Modified {new Date(tpl.updatedAt || tpl.createdAt).toLocaleDateString()}</span>
                                <button
                                    onClick={() => setSelectedTemplate(tpl)}
                                    className="text-blue-600 text-sm font-bold hover:underline"
                                >
                                    View Specs
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <CreateTemplateModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateTemplate}
                    loading={loading}
                />
            )}

            {selectedTemplate && (
                <ViewTemplateModal
                    template={selectedTemplate}
                    onClose={() => setSelectedTemplate(null)}
                />
            )}
        </div>
    );
};

const CreateTemplateModal = ({ onClose, onCreate, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'TECH',
        description: ''
    });

    // Initial structure based on your skeleton
    const [sections, setSections] = useState([
        {
            id: 's1',
            name: 'header',
            fields: [
                { id: 'f1', name: 'title', required: true },
                { id: 'f2', name: 'professional_summary', required: true }
            ]
        },
        {
            id: 's2',
            name: 'experience',
            fields: [
                { id: 'f3', name: 'job_title', required: true },
                { id: 'f4', name: 'company_name', required: true }
            ]
        }
    ]);

    const [error, setError] = useState(null);

    const addSection = () => {
        setSections([...sections, { id: Date.now().toString(), name: '', fields: [{ id: (Date.now() + 1).toString(), name: '', required: false }] }]);
    };

    const removeSection = (sectionId) => {
        setSections(sections.filter(s => s.id !== sectionId));
    };

    const updateSectionName = (id, newName) => {
        setSections(sections.map(s => s.id === id ? { ...s, name: newName } : s));
    };

    const addField = (sectionId) => {
        setSections(sections.map(s => s.id === sectionId ? {
            ...s,
            fields: [...s.fields, { id: Date.now().toString(), name: '', required: false }]
        } : s));
    };

    const removeField = (sectionId, fieldId) => {
        setSections(sections.map(s => s.id === sectionId ? {
            ...s,
            fields: s.fields.filter(f => f.id !== fieldId)
        } : s));
    };

    const updateField = (sectionId, fieldId, updates) => {
        setSections(sections.map(s => s.id === sectionId ? {
            ...s,
            fields: s.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
        } : s));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) return setError('Template name is required');

        // Transform visual sections back to Backend JSON format
        // format: { "sections": { "header": { "title": { "required": true } } } }
        const formattedSections = {};
        let isValid = true;

        sections.forEach(s => {
            if (!s.name.trim()) {
                isValid = false;
                return;
            }
            const fieldMap = {};
            s.fields.forEach(f => {
                if (!f.name.trim()) {
                    isValid = false;
                    return;
                }
                fieldMap[f.name.trim().toLowerCase().replace(/\s+/g, '_')] = { required: f.required };
            });
            formattedSections[s.name.trim().toLowerCase().replace(/\s+/g, '_')] = fieldMap;
        });

        if (!isValid) return setError('Ensure all sections and fields have names');
        if (Object.keys(formattedSections).length === 0) return setError('At least one section is required');

        onCreate({
            ...formData,
            sections: formattedSections
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white max-w-4xl w-full shadow-2xl relative flex flex-col max-h-[95vh] rounded-xl overflow-hidden">
                <div className="bg-slate-900 p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Template Content Builder</h2>
                            <p className="text-xs text-slate-400">Define the visual structure using simple forms</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-8">
                    <form id="templateForm" onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 flex items-center mb-6">
                                <AlertCircle className="w-5 h-5 mr-3" />
                                <span className="font-medium text-sm">{error}</span>
                            </div>
                        )}

                        {/* General Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-100">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Internal Template Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Modern Full Stack Engineer"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Industry</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="TECH">Technology & IT</option>
                                    <option value="BUSINESS">Business & Management</option>
                                    <option value="CREATIVE">Design & Creative</option>
                                    <option value="HEALTHCARE">Healthcare</option>
                                    <option value="FINANCE">Finance</option>
                                </select>
                            </div>
                        </div>

                        {/* Section Builder */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Define CV Sections</h3>
                                <button
                                    type="button"
                                    onClick={addSection}
                                    className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Add Section
                                </button>
                            </div>

                            <div className="space-y-4">
                                {sections.map((section, sIdx) => (
                                    <div key={section.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 group animate-in slide-in-from-left-2 transition-all">
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="bg-slate-200 text-slate-500 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                                                {sIdx + 1}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Section Name (e.g. Experience)"
                                                value={section.name}
                                                onChange={e => updateSectionName(section.id, e.target.value)}
                                                className="bg-transparent border-b-2 border-slate-300 focus:border-blue-500 outline-none font-bold text-slate-900 px-1 py-1 flex-grow"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeSection(section.id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="pl-12 space-y-3">
                                            {section.fields.map((field) => (
                                                <div key={field.id} className="flex items-center gap-4 animate-in fade-in">
                                                    <input
                                                        type="text"
                                                        placeholder="Field Name"
                                                        value={field.name}
                                                        onChange={e => updateField(section.id, field.id, { name: e.target.value })}
                                                        className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm flex-grow outline-none focus:border-blue-500 transition-all font-medium"
                                                    />
                                                    <label className="flex items-center gap-2 cursor-pointer group/check">
                                                        <div
                                                            onClick={() => updateField(section.id, field.id, { required: !field.required })}
                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${field.required ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}
                                                        >
                                                            {field.required && <X className="w-3 h-3 text-white" strokeWidth={4} />}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-500 select-none">Required</span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeField(section.id, field.id)}
                                                        className="text-slate-300 hover:text-red-400"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addField(section.id)}
                                                className="text-[11px] font-bold text-blue-500 hover:underline uppercase tracking-widest pl-1"
                                            >
                                                + Add field to {section.name || 'section'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">
                        Builder mode: Fields will be saved exactly as entered
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 transition-all text-sm rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            form="templateForm"
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 bg-slate-900 text-white font-bold shadow-xl hover:bg-blue-600 disabled:opacity-50 transition-all rounded-lg flex items-center group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            Create Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ViewTemplateModal = ({ template, onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white max-w-3xl w-full shadow-2xl relative flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${template.category === 'TECH' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{template.name}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{template.category} SPECIFICATION</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</h4>
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${template.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {template.status}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Last Registered</h4>
                                <p className="text-sm font-bold text-slate-700">{new Date(template.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description / Background</h4>
                            <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 border border-slate-100">{template.description || 'No specific background provided for this structure.'}</p>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">JSON Structure Definition</h4>
                            <pre className="bg-slate-900 text-blue-400 p-6 overscroll-none overflow-x-auto text-xs font-mono leading-relaxed max-h-[400px]">
                                {JSON.stringify(template.sections, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminCVTemplatesPage;
