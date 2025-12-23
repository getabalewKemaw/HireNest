import {
    Mail,
    Phone,
    MapPin,
    Globe,
    Linkedin,
    Github,
    Calendar,
    Briefcase,
    GraduationCap,
    Award,
    Code,
    Languages
} from 'lucide-react';

const CVPreview = ({ template, cvData }) => {
    const renderHeader = () => {
        const header = cvData.header || {};
        const personalInfo = cvData.personal_information || {};

        return (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                <h1 className="text-4xl font-bold mb-2 font-heading">
                    {header.title || personalInfo.full_name || 'Your Name'}
                </h1>
                {header.professional_summary && (
                    <p className="text-blue-100 text-lg mb-4 max-w-3xl">
                        {header.professional_summary}
                    </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                    {personalInfo.email && (
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderExperience = () => {
        const experiences = cvData.experience || [];
        if (experiences.length === 0) return null;

        return (
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4 pb-2 border-b-2 border-blue-600">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Experience</h2>
                </div>
                <div className="space-y-6">
                    {experiences.map((exp, index) => (
                        <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{exp.job_title}</h3>
                                <p className="text-blue-600 font-semibold">{exp.company_name}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {exp.start_date} - {exp.end_date || 'Present'}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p className="text-gray-700 mb-2">{exp.description}</p>
                                )}
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {exp.technologies.map((tech, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderProjects = () => {
        const projects = cvData.projects || [];
        if (projects.length === 0) return null;

        return (
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4 pb-2 border-b-2 border-blue-600">
                    <Code className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Projects</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project, index) => (
                        <div key={index} className="p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{project.project_name}</h3>
                            {project.description && (
                                <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                            )}
                            {project.technologies && project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {project.technologies.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {project.project_url && (
                                <a
                                    href={project.project_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                                >
                                    <Globe className="w-3 h-3" />
                                    <span>View Project</span>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderEducation = () => {
        const education = cvData.education || [];
        if (education.length === 0) return null;

        return (
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4 pb-2 border-b-2 border-blue-600">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Education</h2>
                </div>
                <div className="space-y-4">
                    {education.map((edu, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                                <p className="text-blue-600 font-semibold">{edu.institution}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                    {edu.field_of_study && <span>{edu.field_of_study}</span>}
                                    {edu.graduation_year && <span>• {edu.graduation_year}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSkills = () => {
        const skills = cvData.skills || {};
        const technicalSkills = skills.technical_skills || [];
        const professionalSkills = skills.professional_skills || [];

        if (technicalSkills.length === 0 && professionalSkills.length === 0) return null;

        return (
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4 pb-2 border-b-2 border-blue-600">
                    <Award className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Skills</h2>
                </div>
                <div className="space-y-4">
                    {technicalSkills.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-2">Technical Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {technicalSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {professionalSkills.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-2">Professional Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {professionalSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderLanguages = () => {
        const languages = cvData.languages || [];
        if (languages.length === 0) return null;

        return (
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4 pb-2 border-b-2 border-blue-600">
                    <Languages className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Languages</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {languages.map((lang, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                            <div>
                                <p className="font-semibold text-gray-900">{lang.language_name}</p>
                                <p className="text-sm text-gray-600">{lang.proficiency_level}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCertifications = () => {
        const certifications = cvData.certifications || [];
        if (certifications.length === 0) return null;

        return (
            <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4 pb-2 border-b-2 border-blue-600">
                    <Award className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900 font-heading">Certifications</h2>
                </div>
                <div className="space-y-3">
                    {certifications.map((cert, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <div className="p-1.5 bg-blue-100 rounded flex-shrink-0 mt-0.5">
                                <Award className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{cert.certificate_name}</h3>
                                <p className="text-sm text-gray-600">
                                    {cert.issuer} {cert.year && `• ${cert.year}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Preview Container */}
            <div className="bg-white shadow-2xl border border-gray-200 overflow-hidden">
                {/* CV Content */}
                <div className="print:shadow-none">
                    {renderHeader()}

                    <div className="p-8 space-y-8">
                        {renderExperience()}
                        {renderProjects()}
                        {renderEducation()}
                        {renderSkills()}
                        {renderLanguages()}
                        {renderCertifications()}
                    </div>
                </div>
            </div>

            {/* Preview Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-700">
                    This is a preview of your CV. Click "Download PDF" to get the final version.
                </p>
            </div>
        </div>
    );
};

export default CVPreview;
