import { useState } from 'react';
import {
    Plus,
    Trash2,
    GripVertical,
    AlertCircle,
    Info,
    Sparkles
} from 'lucide-react';

const CVEditor = ({ template, cvData, onChange, validationErrors }) => {
    const [expandedSections, setExpandedSections] = useState(
        Object.keys(template.sections || {}).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    const updateField = (sectionKey, fieldKey, value) => {
        const newData = {
            ...cvData,
            [sectionKey]: {
                ...cvData[sectionKey],
                [fieldKey]: value
            }
        };
        onChange(newData);
    };

    const updateArrayField = (sectionKey, index, fieldKey, value) => {
        const currentArray = cvData[sectionKey] || [];
        const newArray = [...currentArray];
        newArray[index] = {
            ...newArray[index],
            [fieldKey]: value
        };
        onChange({
            ...cvData,
            [sectionKey]: newArray
        });
    };

    const addArrayItem = (sectionKey) => {
        const currentArray = cvData[sectionKey] || [];
        onChange({
            ...cvData,
            [sectionKey]: [...currentArray, {}]
        });
    };

    const removeArrayItem = (sectionKey, index) => {
        const currentArray = cvData[sectionKey] || [];
        onChange({
            ...cvData,
            [sectionKey]: currentArray.filter((_, i) => i !== index)
        });
    };

    const getFieldError = (sectionKey, fieldKey, index = null) => {
        return validationErrors.find(
            err => err.section === sectionKey &&
                err.field === fieldKey &&
                (index === null || err.index === index)
        );
    };

    const renderField = (sectionKey, fieldKey, fieldConfig, value, index = null) => {
        const error = getFieldError(sectionKey, fieldKey, index);
        const isRequired = fieldConfig.required;
        const fieldId = index !== null ? `${sectionKey}-${index}-${fieldKey}` : `${sectionKey}-${fieldKey}`;

        return (
            <div key={fieldId} className="space-y-2">
                <label htmlFor={fieldId} className="block text-sm font-semibold text-gray-700">
                    {formatFieldName(fieldKey)}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                </label>

                {fieldKey.includes('description') || fieldKey.includes('summary') ? (
                    <textarea
                        id={fieldId}
                        value={value || ''}
                        onChange={(e) => {
                            if (index !== null) {
                                updateArrayField(sectionKey, index, fieldKey, e.target.value);
                            } else {
                                updateField(sectionKey, fieldKey, e.target.value);
                            }
                        }}
                        rows={4}
                        className={`w-full px-4 py-3 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                            } focus:ring-2 outline-none transition-all duration-200 resize-none`}
                        placeholder={`Enter ${formatFieldName(fieldKey).toLowerCase()}`}
                    />
                ) : (
                    <input
                        id={fieldId}
                        type={fieldKey.includes('date') || fieldKey.includes('year') ? 'text' : 'text'}
                        value={value || ''}
                        onChange={(e) => {
                            if (index !== null) {
                                updateArrayField(sectionKey, index, fieldKey, e.target.value);
                            } else {
                                updateField(sectionKey, fieldKey, e.target.value);
                            }
                        }}
                        className={`w-full px-4 py-3 border ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                            } focus:ring-2 outline-none transition-all duration-200`}
                        placeholder={`Enter ${formatFieldName(fieldKey).toLowerCase()}`}
                    />
                )}

                {error && (
                    <p className="text-xs text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{error.message}</span>
                    </p>
                )}
            </div>
        );
    };

    const renderSection = (sectionKey, sectionFields) => {
        const isExpanded = expandedSections[sectionKey];
        const sectionData = cvData[sectionKey];
        const isArraySection = Array.isArray(sectionData);

        return (
            <div key={sectionKey} className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:border-blue-300">
                {/* Section Header */}
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white transition-all duration-200"
                >
                    <div className="flex items-center space-x-3">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-900 font-heading">
                            {formatFieldName(sectionKey)}
                        </h3>
                        {isArraySection && sectionData?.length > 0 && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                {sectionData.length}
                            </span>
                        )}
                    </div>
                    <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Section Content */}
                {isExpanded && (
                    <div className="px-6 py-5 space-y-5 animate-fade-in-up">
                        {isArraySection ? (
                            <>
                                {/* Array Items */}
                                {sectionData?.map((item, index) => (
                                    <div key={index} className="p-5 bg-gray-50 border border-gray-200 space-y-4 relative group">
                                        {/* Item Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-gray-700">
                                                {formatFieldName(sectionKey)} #{index + 1}
                                            </span>
                                            <button
                                                onClick={() => removeArrayItem(sectionKey, index)}
                                                className="p-2 text-red-600 hover:bg-red-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(sectionFields).map(([fieldKey, fieldConfig]) => (
                                                <div key={fieldKey} className={fieldKey.includes('description') || fieldKey.includes('summary') ? 'md:col-span-2' : ''}>
                                                    {renderField(sectionKey, fieldKey, fieldConfig, item[fieldKey], index)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <button
                                    onClick={() => addArrayItem(sectionKey)}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-blue-500 text-gray-600 hover:text-blue-600 font-semibold transition-all duration-200 flex items-center justify-center space-x-2 hover:bg-blue-50"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Add {formatFieldName(sectionKey)}</span>
                                </button>
                            </>
                        ) : (
                            /* Single Object Fields */
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(sectionFields).map(([fieldKey, fieldConfig]) => (
                                    <div key={fieldKey} className={fieldKey.includes('description') || fieldKey.includes('summary') ? 'md:col-span-2' : ''}>
                                        {renderField(sectionKey, fieldKey, fieldConfig, sectionData?.[fieldKey])}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Panel */}
            <div className="lg:col-span-2 space-y-4">
                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Auto-Filled Data</h4>
                        <p className="text-xs text-blue-700">
                            We've automatically filled in your information from your profile.
                            Feel free to edit or add more details.
                        </p>
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {Object.entries(template.sections || {}).map(([sectionKey, sectionFields]) =>
                        renderSection(sectionKey, sectionFields)
                    )}
                </div>
            </div>

            {/* Tips Panel */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                    {/* Tips Card */}
                    <div className="bg-white border border-gray-200 p-6 space-y-4">
                        <div className="flex items-center space-x-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            <h3 className="font-bold text-gray-900 font-heading">Pro Tips</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>Use action verbs to describe your experience</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>Quantify achievements with numbers and metrics</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>Keep descriptions concise and relevant</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>Highlight skills that match job requirements</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-600 font-bold">•</span>
                                <span>Proofread for spelling and grammar errors</span>
                            </li>
                        </ul>
                    </div>

                    {/* Required Fields */}
                    <div className="bg-amber-50 border border-amber-200 p-6 space-y-3">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                            <h3 className="font-bold text-amber-900 font-heading">Required Fields</h3>
                        </div>
                        <p className="text-sm text-amber-700">
                            Fields marked with <span className="text-red-500 font-bold">*</span> are required
                            and must be filled before saving or downloading your CV.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to format field names
const formatFieldName = (fieldName) => {
    return fieldName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default CVEditor;
