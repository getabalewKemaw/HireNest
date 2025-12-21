import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import AdminVerificationQueue from '../../components/dashboard/AdminVerificationQueue';

const ApprovalsPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-10 animate-fade-in pb-12">
                <div>
                    <h1 className="text-4xl font-heading font-black text-primary dark:text-white leading-tight italic">
                        Verification Center.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg mt-1">
                        Securely audit and validate company identities to maintain platform integrity.
                    </p>
                </div>

                <AdminVerificationQueue />
            </div>
        </DashboardLayout>
    );
};

export default ApprovalsPage;
