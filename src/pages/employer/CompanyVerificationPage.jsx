import React from 'react';
import CompanyVerificationWidget from '../../components/dashboard/CompanyVerificationWidget';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

const CompanyVerificationPage = () => {
    return (
        <div className="space-y-10 animate-fade-in pb-12 mt-16 md:mt-32 lg:mt-48 xl:mt-60  ml-10">
            <div>
                <h1 className="text-4xl lg:text-5xl font-serif font-black text-primary dark:text-white leading-tight mb-4 ml-5  text-center">
                    Trust & Verification
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-heading font-light text-lg max-w-2xl leading-relaxed  ml-100  flex  justify-center">
                    Complete your company verification to unlock job posting capabilities and build trust with candidates.
                </p>
            </div>

            <CompanyVerificationWidget inline={true} />
        </div>
    );
};

export default CompanyVerificationPage;
