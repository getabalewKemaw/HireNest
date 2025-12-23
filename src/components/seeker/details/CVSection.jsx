import { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Eye, CheckCircle2, Loader2, AlertCircle, X, Maximize2 } from 'lucide-react';
import Button from '../../Button';
import useSeekerStore from '../../../store/seekerStore';
import PdfViewerModal from '../../modals/PdfViewerModal';
import { downloadFile } from '../../../utils/downloadUtils';

const CVSection = () => {
    const { media, uploadCVFile, deleteCVFile, isLoading } = useSeekerStore();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const fileRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a PDF or Word document (.pdf, .doc, .docx)');
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            setError('File size must be less than 5MB');
            return;
        }

        setSelectedFile(file);
        setError('');
        handleFileUpload(file);
    };

    const handleFileUpload = async (file) => {
        setUploading(true);
        setError('');
        setSuccess('');
        setUploadProgress(0);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            await uploadCVFile(file);

            clearInterval(progressInterval);
            setUploadProgress(100);
            setSuccess(`CV uploaded successfully: ${file.name}`);
            setSelectedFile(null);

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(''), 5000);
        } catch (err) {
            console.error('Failed to upload CV:', err);
            setError(err.message || 'Failed to upload CV. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your CV?')) return;

        try {
            await deleteCVFile();
            setSuccess('CV deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to delete CV');
        }
    };

    const handleViewCV = () => {
        if (!media?.cvUrl) return;
        const isPdf = media.cvUrl.toLowerCase().endsWith('.pdf');
        if (isPdf) {
            setShowPdfViewer(true);
        } else {
            window.open(media.cvUrl, '_blank');
        }
    };

    const handleDownload = () => {
        if (!media?.cvUrl) return;
        downloadFile(media.cvUrl, `Resume_${getFileName(media.cvUrl)}`);
    };

    const getFileName = (url) => {
        if (!url) return 'CV Document';
        const parts = url.split('/');
        return decodeURIComponent(parts[parts.length - 1]);
    };

    return (
        <>
            <section className="bg-white dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/20 rounded-[2rem] p-8 transition-all hover:shadow-2xl hover:shadow-gray-200/40 dark:hover:shadow-none">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-primary dark:text-white">Curriculum Vitae</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Upload your resume (PDF, DOC, DOCX - Max 5MB)</p>
                        </div>
                    </div>
                </div>

                {/* Status Messages */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                    </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                    <div className="mb-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
                        <div className="flex items-center gap-3 mb-3">
                            <Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Uploading resume...
                            </p>
                        </div>
                        <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                            <div
                                className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* CV Display or Upload Area */}
                {media?.cvUrl ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-3xl group">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-emerald-500 shadow-sm transition-transform group-hover:scale-110">
                            <CheckCircle2 size={32} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="font-bold text-primary dark:text-white mb-1">Resume Uploaded Successfully</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{getFileName(media.cvUrl)}</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<Eye size={16} />}
                                onClick={handleViewCV}
                            >
                                Preview
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<Download size={16} />}
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<Trash2 size={16} />}
                                onClick={handleDelete}
                                disabled={uploading}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                Delete
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileRef}
                            onChange={handleFileSelect}
                            hidden
                            accept=".pdf,.doc,.docx"
                        />
                    </div>
                ) : (
                    <div
                        onClick={() => !uploading && fileRef.current.click()}
                        className={`group text-center py-10 bg-gray-50 dark:bg-gray-900/10 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-800 transition-all duration-300 ${uploading
                            ? 'cursor-not-allowed opacity-50'
                            : 'cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5'
                            }`}
                    >
                        <div className={`w-20 h-20 bg-white dark:bg-gray-800 rounded-3xl mx-auto flex items-center justify-center text-gray-400 mb-6 shadow-sm transition-all ${!uploading && 'group-hover:scale-110 group-hover:text-blue-500'
                            }`}>
                            {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                        </div>
                        <h3 className="text-lg font-bold text-primary dark:text-white mb-2">
                            {uploading ? 'Processing...' : 'Upload Resume'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-4">
                            Click to browse or drag and drop your CV here
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Supported formats: PDF, DOC, DOCX (Max 5MB)
                        </p>
                        <input
                            type="file"
                            ref={fileRef}
                            onChange={handleFileSelect}
                            hidden
                            accept=".pdf,.doc,.docx"
                            disabled={uploading}
                        />
                    </div>
                )}
            </section>

            <PdfViewerModal
                isOpen={showPdfViewer}
                onClose={() => setShowPdfViewer(false)}
                pdfUrl={media?.cvUrl}
                title="Your Professional CV"
            />
        </>
    );
};

export default CVSection;
