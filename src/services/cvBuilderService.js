import api from './api';

/**
 * CV Builder Service
 * Handles all CV template and builder operations
 */

// ==================== SEEKER ENDPOINTS ====================

/**
 * Get all active CV templates
 * @returns {Promise} List of active templates
 */
export const getActiveTemplates = async () => {
    const response = await api.get('/api/v1/cv-builder/templates');
    return response.data;
};

/**
 * Get template with auto-filled data from seeker profile
 * @param {string} templateId - Template UUID
 * @returns {Promise} Template with auto-filled data
 */
export const getTemplateWithAutoFill = async (templateId) => {
    const response = await api.get(`/api/v1/cv-builder/builder/${templateId}`);
    return response.data;
};

/**
 * Preview CV without saving
 * @param {Object} cvData - CV builder request data
 * @param {string} cvData.templateId - Template UUID
 * @param {Object} cvData.filledData - Filled CV data
 * @returns {Promise} Preview data
 */
export const previewCV = async (cvData) => {
    const response = await api.post('/api/v1/cv-builder/preview', cvData);
    return response.data;
};

/**
 * Download CV as PDF from backend
 * @param {Object} cvData - CV builder request data
 */
export const downloadCV = async (cvData) => {
    console.log('--- Initiating PDF Download ---');
    try {
        const response = await api.post('/api/v1/cv-builder/download', cvData, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Resume.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error('Download CV failed:', error);
        throw error;
    }
};

// ==================== CV DATA MANAGEMENT ====================

/**
 * Get seeker's CV data
 * @returns {Promise} CV data
 */
export const getSeekerCV = async () => {
    const response = await api.get('/api/v1/seekers/profile/details/cv');
    return response.data;
};

/**
 * Create or update seeker's CV
 * @param {Object} cvDto - CV data
 * @returns {Promise} Saved CV data
 */
export const saveCV = async (cvDto) => {
    const response = await api.post('/api/v1/seekers/profile/details/cv', cvDto);
    return response.data;
};

/**
 * Update seeker's CV
 * @param {Object} cvDto - CV data
 * @returns {Promise} Updated CV data
 */
export const updateCV = async (cvDto) => {
    const response = await api.put('/api/v1/seekers/profile/details/cv', cvDto);
    return response.data;
};

// ==================== ADMIN ENDPOINTS ====================

/**
 * Get all CV templates (Admin only)
 * @returns {Promise} List of all templates
 */
export const getAllTemplates = async () => {
    const response = await api.get('/api/v1/admin/cv-templates');
    return response.data;
};

/**
 * Create a new CV template (Admin only)
 */
export const createTemplate = async (templateData) => {
    const response = await api.post('/api/v1/admin/cv-templates', templateData);
    return response.data;
};

/**
 * Delete a CV template (Admin only)
 */
export const deleteTemplate = async (templateId) => {
    const response = await api.delete(`/api/v1/admin/cv-templates/${templateId}`);
    return response.data;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Validate required fields in CV data
 */
export const validateCVData = (cvData, templateSections) => {
    const errors = [];

    Object.entries(templateSections).forEach(([sectionKey, sectionFields]) => {
        const sectionData = cvData[sectionKey];

        if (Array.isArray(sectionData)) {
            sectionData.forEach((item, index) => {
                Object.entries(sectionFields).forEach(([fieldKey, fieldConfig]) => {
                    if (fieldConfig.required) {
                        const value = item[fieldKey];
                        if (!value || (typeof value === 'string' && value.trim() === '')) {
                            errors.push({
                                section: sectionKey,
                                field: fieldKey,
                                index: index,
                                message: `${fieldKey.replace(/_/g, ' ')} is required (Item #${index + 1})`
                            });
                        }
                    }
                });
            });
        } else {
            Object.entries(sectionFields).forEach(([fieldKey, fieldConfig]) => {
                if (fieldConfig.required) {
                    const value = sectionData?.[fieldKey];
                    if (!value || (typeof value === 'string' && value.trim() === '')) {
                        errors.push({
                            section: sectionKey,
                            field: fieldKey,
                            message: `${fieldKey.replace(/_/g, ' ')} is required`
                        });
                    }
                }
            });
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const formatCVData = (cvData) => {
    return cvData;
};

export const getCategoryDisplayName = (category) => {
    const categories = {
        'TECH': 'Technology',
        'BUSINESS': 'Business',
        'CREATIVE': 'Creative',
        'HEALTHCARE': 'Healthcare',
        'EDUCATION': 'Education',
        'FINANCE': 'Finance',
        'MARKETING': 'Marketing',
        'SALES': 'Sales',
        'OTHER': 'Other'
    };
    return categories[category] || category;
};

export const getCategoryColor = (category) => {
    const colors = {
        'TECH': 'bg-blue-100 text-blue-700',
        'BUSINESS': 'bg-purple-100 text-purple-700',
        'CREATIVE': 'bg-pink-100 text-pink-700',
        'HEALTHCARE': 'bg-green-100 text-green-700',
        'EDUCATION': 'bg-yellow-100 text-yellow-700',
        'FINANCE': 'bg-indigo-100 text-indigo-700',
        'MARKETING': 'bg-orange-100 text-orange-700',
        'SALES': 'bg-red-100 text-red-700',
        'OTHER': 'bg-gray-100 text-gray-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
};

export default {
    getActiveTemplates,
    getTemplateWithAutoFill,
    previewCV,
    downloadCV,
    getSeekerCV,
    saveCV,
    updateCV,
    getAllTemplates,
    createTemplate,
    deleteTemplate,
    validateCVData,
    formatCVData,
    getCategoryDisplayName,
    getCategoryColor
};
