import api from './api';

/**
 * Seeker Profile Services
 */

/**
 * Get seeker basic info
 */
export const getBasicInfo = async () => {
    try {
        const response = await api.get('api/v1/seekers/profile/basic-info');
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: 'Failed to fetch basic info' }
        };
    }
};

/**
 * Create seeker basic info
 */
export const createBasicInfo = async (basicInfo) => {
    try {
        const response = await api.post('api/v1/seekers/profile/basic-info', basicInfo);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: 'Failed to create basic info' }
        };
    }
};

/**
 * Update seeker basic info
 */
export const updateBasicInfo = async (basicInfo) => {
    try {
        const response = await api.put('api/v1/seekers/profile/basic-info', basicInfo);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: 'Failed to update basic info' }
        };
    }
};

/**
 * Delete seeker profile
 */
export const deleteProfile = async () => {
    try {
        await api.delete('api/v1/seekers/profile/basic-info');
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: 'Failed to delete profile' }
        };
    }
};

// Profile image functions moved to Media API section below

/**
 * Set address
 */
export const setAddress = async (address) => {
    try {
        const response = await api.post('api/v1/seekers/profile/address', address);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: 'Failed to set address' }
        };
    }
};

/**
 * Delete address
 */
export const deleteAddress = async () => {
    try {
        const response = await api.delete('api/v1/seekers/profile/address');
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || { message: 'Failed to delete address' }
        };
    }
};

/**
 * BIO SERVICES
 */
export const getBio = async () => {
    try {
        const response = await api.get('api/v1/seekers/profile/details/bio');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to fetch bio' } };
    }
};

export const saveBio = async (bioData) => {
    try {
        const response = await api.post('api/v1/seekers/profile/details/bio', bioData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to save bio' } };
    }
};

export const updateBio = async (bioData) => {
    try {
        const response = await api.put('api/v1/seekers/profile/details/bio', bioData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to update bio' } };
    }
};

/**
 * SKILL SERVICES
 */
export const getSkills = async () => {
    try {
        const response = await api.get('api/v1/seekers/profile/details/skills');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to fetch skills' } };
    }
};

export const addSkill = async (skillData) => {
    try {
        const response = await api.post('api/v1/seekers/profile/details/skills', skillData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to add skill' } };
    }
};

export const updateSkill = async (id, skillData) => {
    try {
        const response = await api.put(`api/v1/seekers/profile/details/skills/${id}`, skillData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to update skill' } };
    }
};

/**
 * PROJECT SERVICES
 */
export const getProjects = async () => {
    try {
        console.log('📦 [PROJECTS] Fetching projects...');
        const response = await api.get('api/v1/seekers/profile/details/projects');
        console.log('📦 [PROJECTS] ✅ Projects fetched:', response.data.length, 'projects');
        console.log('📦 [PROJECTS] Sample project structure:', response.data[0]);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('📦 [PROJECTS] ❌ Failed to fetch:', error.response?.status, error.message);
        return { success: false, error: error.response?.data || { message: 'Failed to fetch projects' } };
    }
};

export const createProject = async (formData) => {
    try {
        console.log('📦 [PROJECTS] Creating project...');
        console.log('📦 [PROJECTS] FormData entries:');
        for (let pair of formData.entries()) {
            console.log(`  - ${pair[0]}:`, pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]);
        }

        const response = await api.post('api/v1/seekers/profile/details/projects', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        console.log('📦 [PROJECTS] ✅ Project created successfully!');
        console.log('📦 [PROJECTS] Response:', response.data);
        console.log('📦 [PROJECTS] Image URLs:', response.data.imageUrls);
        console.log('📦 [PROJECTS] Video URL:', response.data.videoUrl);

        return { success: true, data: response.data };
    } catch (error) {
        console.error('📦 [PROJECTS] ❌ Creation failed:', error.response?.status);
        console.error('📦 [PROJECTS] Error details:', error.response?.data);
        return { success: false, error: error.response?.data || { message: 'Failed to create project' } };
    }
};

export const updateProject = async (id, formData) => {
    try {
        console.log('📦 [PROJECTS] Updating project:', id);
        const response = await api.put(`api/v1/seekers/profile/details/projects/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('📦 [PROJECTS] ✅ Project updated:', response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error('📦 [PROJECTS] ❌ Update failed:', error.response?.data);
        return { success: false, error: error.response?.data || { message: 'Failed to update project' } };
    }
};

export const deleteProject = async (id) => {
    try {
        await api.delete(`api/v1/seekers/profile/details/projects/${id}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to delete project' } };
    }
};

/**
 * SECTOR SERVICES (Multi-select support)
 */
export const getSectors = async () => {
    try {
        const response = await api.get('api/v1/seekers/profile/details/sector');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to fetch sectors' } };
    }
};

export const addSector = async (sectorData) => {
    try {
        const response = await api.post('api/v1/seekers/profile/details/sector', sectorData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to add sector' } };
    }
};

export const deleteSector = async (id) => {
    try {
        await api.delete(`api/v1/seekers/profile/details/sector/${id}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to delete sector' } };
    }
};

/**
 * CV SERVICES
 */
export const getCV = async () => {
    try {
        const response = await api.get('api/v1/seekers/profile/details/cv');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to fetch CV' } };
    }
};

export const saveCV = async (cvData) => {
    try {
        const response = await api.post('api/v1/seekers/profile/details/cv', cvData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to save CV' } };
    }
};

/**
 * TAGS SERVICES (Professional Headlines/Taglines)
 */
export const getTags = async () => {
    try {
        const response = await api.get('api/v1/seekers/profile/details/tags');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to fetch tags' } };
    }
};

export const addTag = async (tagData) => {
    try {
        const response = await api.post('api/v1/seekers/profile/details/tags', tagData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to add tag' } };
    }
};

export const deleteTag = async (tagData) => {
    try {
        await api.delete('api/v1/seekers/profile/details/tags', { data: tagData });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to delete tag' } };
    }
};

/**
 * SOCIAL LINKS SERVICES
 */
export const getSocialLinks = async () => {
    try {
        const response = await api.get('api/v1/seekers/profile/details/social-links');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to fetch social links' } };
    }
};

export const addSocialLink = async (linkData) => {
    try {
        const response = await api.post('api/v1/seekers/profile/details/social-links', linkData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to add social link' } };
    }
};

export const deleteSocialLink = async (linkData) => {
    try {
        await api.delete('api/v1/seekers/profile/details/social-links', { data: linkData });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to delete social link' } };
    }
};

/**
 * MEDIA SERVICES (Profile Image & CV Upload)
 */
export const getMedia = async () => {
    try {
        const response = await api.get('api/v1/seekers/profile/details/media');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to fetch media' } };
    }
};

export const uploadProfileImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('api/v1/seekers/profile/details/media/profile-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to upload profile image' } };
    }
};

export const deleteProfileImage = async () => {
    try {
        const response = await api.delete('api/v1/seekers/profile/details/media/profile-image');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to delete profile image' } };
    }
};

export const uploadCV = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('api/v1/seekers/profile/details/media/cv', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to upload CV' } };
    }
};

export const deleteCVFile = async () => {
    try {
        const response = await api.delete('api/v1/seekers/profile/details/media/cv');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to delete CV' } };
    }
};

/**
 * Get full seeker profile by ID (for employers)
 */
export const getFullProfile = async (seekerId) => {
    try {
        const response = await api.get(`api/v1/seekers/profile/${seekerId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to fetch full seeker profile' } };
    }
};

/**
 * Search seekers (for discovery)
 */
export const searchSeekers = async (query = '', page = 0, size = 20) => {
    try {
        const response = await api.get('api/v1/seekers/profile', {
            params: { query, page, size }
        });
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || { message: 'Failed to search seekers' } };
    }
};
