import api from './api';

const savedJobService = {
    /**
     * Toggle save/bookmark for a job
     * @param {string} jobId 
     * @returns {Promise<Object>} {saved: boolean, message: string}
     */
    toggleSave: async (jobId) => {
        const response = await api.post(`/api/v1/jobs/saved/${jobId}`);
        return response.data;
    },

    /**
     * Check if a job is saved by the current user
     * @param {string} jobId 
     * @returns {Promise<boolean>}
     */
    isSaved: async (jobId) => {
        try {
            const response = await api.get(`/api/v1/jobs/saved/check/${jobId}`);
            return response.data.isSaved;
        } catch (error) {
            return false;
        }
    },

    /**
     * Get paginated saved jobs
     * @param {number} page 
     * @param {number} size 
     * @returns {Promise<Object>} Paginated jobs
     */
    getSavedJobs: async (page = 0, size = 20) => {
        const response = await api.get(`/api/v1/jobs/saved`, {
            params: { page, size }
        });
        return response.data;
    }
};

export default savedJobService;
