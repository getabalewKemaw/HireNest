import api from './api';

const paymentService = {
    /**
     * Check if payment is required for job posting
     */
    checkPaymentRequirement: async () => {
        const response = await api.get('/api/v1/payments/check-requirement');
        return response.data;
    },

    /**
     * Initiate a payment for job posting
     */
    initiateJobPostingPayment: async (paymentData) => {
        const response = await api.post('/api/v1/payments/initiate', {
            amount: paymentData.amount,
            currency: paymentData.currency || 'ETB',
            email: paymentData.email,
            firstName: paymentData.firstName,
            lastName: paymentData.lastName,
            phoneNumber: paymentData.phoneNumber,
            purpose: 'JOB_POSTING',
            metadata: JSON.stringify(paymentData.metadata || {})
        });
        return response.data;
    },

    /**
     * Verify a payment
     */
    verifyPayment: async (txRef) => {
        const response = await api.get(`/api/v1/payments/verify/${txRef}`);
        return response.data;
    },

    /**
     * Get payment by transaction reference
     */
    getPayment: async (txRef) => {
        const response = await api.get(`/api/v1/payments/${txRef}`);
        return response.data;
    },

    /**
     * Get payment history
     */
    getPaymentHistory: async (page = 0, size = 10) => {
        const response = await api.get('/api/v1/payments/history', {
            params: { page, size }
        });
        return response.data;
    },

    /**
     * Get successful payments
     */
    getSuccessfulPayments: async () => {
        const response = await api.get('/api/v1/payments/successful');
        return response.data;
    }
};

export default paymentService;
