import { useState, useEffect } from 'react';
import Button from '../Button';
import { downloadFile } from '../../utils/downloadUtils';
import { getAccessToken } from '../../utils/tokenUtils';
import { X, Download, FileText, Maximize2, Minimize2, Loader2, AlertCircle } from 'lucide-react';

const PdfViewerModal = ({ isOpen, onClose, pdfUrl, title = 'Document Preview' }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [localUrl, setLocalUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Use the URL as-is to avoid breaking legitimate nested paths
    const cleanUrl = pdfUrl;

    useEffect(() => {
        let url = null;
        if (isOpen && cleanUrl) {
            const loadPdf = async () => {
                setLoading(true);
                setError(null);

                const fetchWithFallback = async (targetUrl, stage = 0) => {
                    try {
                        const isCloudinary = targetUrl.includes('cloudinary.com');
                        const token = getAccessToken();
                        const headers = {};

                        if (!isCloudinary && token) {
                            headers['Authorization'] = `Bearer ${token}`;
                        }

                        console.log(`[PdfViewer] Stage ${stage} Attempt: ${targetUrl}`);
                        const response = await fetch(targetUrl, {
                            headers,
                            credentials: isCloudinary ? 'omit' : 'same-origin'
                        });

                        if (!response.ok) {
                            if (isCloudinary) {
                                let nextUrl = targetUrl;

                                if (stage === 0) {
                                    // Stage 0 -> 1: Strip signature, keep same resource type
                                    nextUrl = targetUrl.replace(/\/s--[^/]+\//, '/');
                                    if (nextUrl !== targetUrl) {
                                        console.log('🔄 Stage 1: Trying unsigned URL (same type)');
                                        return await fetchWithFallback(nextUrl, 1);
                                    }
                                    stage = 1; // Skip to next stage if no signature was present
                                }

                                if (stage === 1) {
                                    // Stage 1 -> 2: Switch resource type (raw <-> image)
                                    // Also clean up double extensions
                                    nextUrl = targetUrl.replace(/\/s--[^/]+\//, '/');
                                    if (nextUrl.includes('/image/upload/')) {
                                        nextUrl = nextUrl.replace('/image/upload/', '/raw/upload/');
                                    } else if (nextUrl.includes('/raw/upload/')) {
                                        nextUrl = nextUrl.replace('/raw/upload/', '/image/upload/');
                                    }

                                    // Fix legacy double extensions .pdf.pdf
                                    if (nextUrl.toLowerCase().endsWith('.pdf.pdf')) {
                                        nextUrl = nextUrl.slice(0, -4);
                                    }

                                    if (nextUrl !== targetUrl) {
                                        console.log('🔄 Stage 2: Trying alternate resource type');
                                        return await fetchWithFallback(nextUrl, 2);
                                    }
                                }
                            }

                            if (response.status === 401) throw new Error('Unauthorized access to document');
                            if (response.status === 404) throw new Error('Document not found in Cloudinary');
                            throw new Error(`Failed to load PDF (${response.status})`);
                        }

                        const originalBlob = await response.blob();
                        const pdfBlob = new Blob([originalBlob], { type: 'application/pdf' });
                        const objectUrl = window.URL.createObjectURL(pdfBlob);
                        setLocalUrl(objectUrl);
                        url = objectUrl;
                        return true;
                    } catch (err) {
                        if (stage >= 2) throw err;

                        // Handle network errors by moving to next stage
                        console.warn('[PdfViewer] Network error, trying fallback...', err.message);
                        return await fetchWithFallback(targetUrl, stage + 1);
                    }
                };

                try {
                    await fetchWithFallback(cleanUrl);
                } catch (err) {
                    console.error('PdfViewer Error:', err);
                    setLocalUrl(cleanUrl); // Fallback to direct URL
                    setError(null);
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
    }, [isOpen, cleanUrl]);

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
                            onClick={() => downloadFile(cleanUrl, `${title.replace(/\s+/g, '_')}.pdf`)}
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
                            <Button variant="secondary" onClick={() => downloadFile(cleanUrl, `${title}.pdf`)}>
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
                            onClick={() => downloadFile(cleanUrl, `${title.replace(/\s+/g, '_')}.pdf`)}
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
