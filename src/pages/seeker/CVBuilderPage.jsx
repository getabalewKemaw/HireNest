import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    Sparkles,
    Download,
    Save,
    Eye,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import {
    getActiveTemplates,
    getTemplateWithAutoFill,
    saveCV,
    previewCV,
    downloadCV,
    validateCVData
} from '../../services/cvBuilderService';
import TemplateGallery from '../../components/cv/TemplateGallery';
import CVEditor from '../../components/cv/CVEditor';
import CVPreview from '../../components/cv/CVPreview';
import PdfViewerModal from '../../components/modals/PdfViewerModal';
import api from '../../services/api';

const CVBuilderPage = () => {
    const navigate = useNavigate();

    // State management
    const [step, setStep] = useState(1); // 1: Select Template, 2: Edit CV, 3: Preview
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [pdfContent, setPdfContent] = useState(null);

    // Load templates on mount
    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getActiveTemplates();
            setTemplates(data);
        } catch (err) {
            setError('Failed to load templates. Please try again.');
            console.error('Error loading templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = async (template) => {
        try {
            setLoading(true);
            setError(null);
            setSelectedTemplate(template);

            // Get template with auto-filled data
            const data = await getTemplateWithAutoFill(template.id);
            setCvData(data.filledData);
            setStep(2);
        } catch (err) {
            setError('Failed to load template data. Please try again.');
            console.error('Error loading template data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCVDataChange = (newData) => {
        setCvData(newData);
        setValidationErrors([]);
    };

    const handlePreview = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate before preview
            const validation = validateCVData(cvData, selectedTemplate.sections);
            if (!validation.isValid) {
                setValidationErrors(validation.errors);
                setError('Please fill in all required fields before previewing.');
                return;
            }

            // Hit backend preview endpoint (useful for server-side layout logic/storage if needed)
            await previewCV({
                templateId: selectedTemplate.id,
                filledData: cvData
            });

            setStep(3);
        } catch (err) {
            setError('Failed to generate preview. Please try again.');
            console.error('Preview error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            // Validate data
            const validation = validateCVData(cvData, selectedTemplate.sections);
            if (!validation.isValid) {
                setValidationErrors(validation.errors);
                setError('Please fill in all required fields before saving.');
                return;
            }

            // Save CV matches CVDto structure: { title, about, details }
            await saveCV({
                title: cvData.header?.title || 'My Professional CV',
                about: cvData.header?.professional_summary || '', // Fits in 2000 chars now
                details: cvData // The full JSON state
            });

            setSuccess('CV saved successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to save CV. Please try again.');
            console.error('Error saving CV:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleDownload = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate data
            const validation = validateCVData(cvData, selectedTemplate.sections);
            if (!validation.isValid) {
                setValidationErrors(validation.errors);
                setError('Please fill in all required fields before downloading.');
                return;
            }

            // Prepare and trigger download on backend
            await downloadCV({
                templateId: selectedTemplate.id,
                filledData: cvData
            });

            setSuccess('CV Exported Successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Failed to prepare download. Please try again.');
            console.error('Error downloading CV:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenViewer = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get PDF blob from backend
            const response = await api.post('/api/v1/cv-builder/download', {
                templateId: selectedTemplate.id,
                filledData: cvData
            }, { responseType: 'blob' });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            setPdfContent(url);
            setShowPdfViewer(true);
        } catch (err) {
            setError('Failed to load PDF preview.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
            setSelectedTemplate(null);
            setCvData(null);
        } else if (step === 3) {
            setStep(2);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span className="font-medium">Back</span>
                                </button>
                            )}
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 font-heading">
                                        CV Builder
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {step === 1 && 'Choose a template'}
                                        {step === 2 && 'Build your CV'}
                                        {step === 3 && 'Preview & Download'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {step === 2 && (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>{saving ? 'Saving...' : 'Save'}</span>
                                </button>
                                <button
                                    onClick={handlePreview}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>Preview</span>
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>{saving ? 'Saving...' : 'Save'}</span>
                                </button>
                                <button
                                    onClick={handleDownload}
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Download className="w-4 h-4" />
                                    )}
                                    <span>{loading ? 'Preparing...' : 'Download PDF'}</span>
                                </button>
                                <button
                                    onClick={handleOpenViewer}
                                    disabled={loading}
                                    className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 transition-all duration-200 font-medium rounded-lg disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                                    <span>Professional Viewer</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
                    <div className="flex items-center justify-center space-x-4">
                        {[1, 2, 3].map((stepNum) => (
                            <div key={stepNum} className="flex items-center">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${step >= stepNum
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {step > stepNum ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            stepNum
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${step >= stepNum ? 'text-gray-900' : 'text-gray-500'
                                            }`}
                                    >
                                        {stepNum === 1 && 'Template'}
                                        {stepNum === 2 && 'Edit'}
                                        {stepNum === 3 && 'Preview'}
                                    </span>
                                </div>
                                {stepNum < 3 && (
                                    <div
                                        className={`w-16 h-1 mx-4 transition-all duration-300 ${step > stepNum ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-fade-in-up">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                            {validationErrors.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                    {validationErrors.slice(0, 3).map((err, idx) => (
                                        <li key={idx} className="text-xs text-red-700">
                                            • {err.section}: {err.message}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3 animate-fade-in-up">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-green-800 flex-1">{success}</p>
                        <button
                            onClick={() => setSuccess(null)}
                            className="text-green-600 hover:text-green-800"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Step 1: Template Selection */}
                {step === 1 && (
                    <div className="animate-fade-in-up">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-sm font-semibold">AI-Powered Auto-Fill</span>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-heading">
                                Choose Your Perfect Template
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Select a professional template and we'll automatically fill it with your profile data.
                                You can customize everything afterwards.
                            </p>
                        </div>

                        <TemplateGallery
                            templates={templates}
                            loading={loading}
                            onSelectTemplate={handleTemplateSelect}
                        />
                    </div>
                )}

                {/* Step 2: CV Editor */}
                {step === 2 && selectedTemplate && cvData && (
                    <div className="animate-fade-in-up">
                        <CVEditor
                            template={selectedTemplate}
                            cvData={cvData}
                            onChange={handleCVDataChange}
                            validationErrors={validationErrors}
                        />
                    </div>
                )}

                {/* Step 3: Preview */}
                {step === 3 && selectedTemplate && cvData && (
                    <div className="animate-fade-in-up">
                        <CVPreview
                            template={selectedTemplate}
                            cvData={cvData}
                        />
                    </div>
                )}
            </div>

            <PdfViewerModal
                isOpen={showPdfViewer}
                onClose={() => {
                    setShowPdfViewer(false);
                    if (pdfContent) {
                        window.URL.revokeObjectURL(pdfContent);
                        setPdfContent(null);
                    }
                }}
                pdfUrl={pdfContent}
                title="Professional CV Preview"
            />
        </div>
    );
};

export default CVBuilderPage;  
