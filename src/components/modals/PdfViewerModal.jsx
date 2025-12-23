import { useState, useEffect } from 'react';
import Button from '../Button';
import { downloadFile } from '../../utils/downloadUtils';
import { X, Download, FileText, Maximize2, Minimize2, Loader2, AlertCircle } from 'lucide-react';

const PdfViewerModal = ({ isOpen, onClose, pdfUrl, title = 'Document Preview' }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [localUrl, setLocalUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let url = null;
        if (isOpen && pdfUrl) {
            const loadPdf = async () => {
                setLoading(true);
                setError(null);
                try {
                    // Fetch the PDF binary data
                    const response = await fetch(pdfUrl);
                    if (!response.ok) throw new Error('Failed to load PDF');
                    const originalBlob = await response.blob();

                    // Create a NEW blob and explicitly set the type to application/pdf
                    // This is crucial to prevent browsers from triggering a download dialog
                    const pdfBlob = new Blob([originalBlob], { type: 'application/pdf' });
                    url = window.URL.createObjectURL(pdfBlob);

                    setLocalUrl(url);
                } catch (err) {
                    console.error('PdfViewer Error:', err);
                    setError('Could not preview this document. You can still download it using the button below.');
                } finally {
                    setLoading(false);
                }
            };
            loadPdf();
        }

        return () => {
            if (url) {
                window.URL.revokeObjectURL(url);
            }
        };
    }, [isOpen, pdfUrl]);

    if (!isOpen) return null;

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300 opacity-100">
            <div
                className={`relative bg-white dark:bg-[#111820] rounded-[2.rem] shadow-2xl overflow-hidden transition-all duration-500 border border-white/10 flex flex-col ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl h-[90vh]'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 bg-white dark:bg-[#111820] border-b border-gray-100 dark:border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-primary dark:text-white leading-tight">{title}</h3>
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">PDF Viewer</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleFullscreen}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-all text-gray-400"
                            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        >
                            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>

                        <button
                            onClick={() => downloadFile(pdfUrl, `${title.replace(/\s+/g, '_')}.pdf`)}
                            className="p-3 hover:bg-secondary/10 text-secondary rounded-2xl transition-all"
                            title="Download PDF"
                        >
                            <Download size={20} />
                        </button>

                        <div className="w-px h-6 bg-gray-100 dark:bg-white/5 mx-2" />

                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-red-50 text-red-500 rounded-2xl transition-all"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* PDF Viewer Body */}
                <div className="flex-1 bg-gray-100 dark:bg-[#0B1C2D] relative overflow-hidden flex items-center justify-center p-0">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Document...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border border-red-100 shadow-xl max-w-md mx-4">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={32} className="text-red-500" />
                            </div>
                            <h4 className="text-lg font-bold text-primary dark:text-white mb-2">Preview Unavailable</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                            <Button variant="secondary" onClick={() => downloadFile(pdfUrl, `${title}.pdf`)}>
                                Download Instead
                            </Button>
                        </div>
                    ) : localUrl ? (
                        <iframe
                            src={localUrl}
                            className="w-full h-full border-none m-0 p-0 overflow-hidden"
                            title="PDF Document"
                        />
                    ) : null}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-5 bg-gray-50 dark:bg-[#0B1C2D]/50 border-t border-gray-100 dark:border-white/5 flex items-center justify-between flex-shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        If the viewer doesn't load, use the download button to view the file.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={onClose} size="sm">Close</Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<Download size={16} />}
                            onClick={() => downloadFile(pdfUrl, `${title.replace(/\s+/g, '_')}.pdf`)}
                        >
                            Download PDF
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfViewerModal;
