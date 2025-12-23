import { useState } from 'react';
import { X, ExternalLink, Youtube, Play, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import Button from '../../Button';

/**
 * ProjectDetailModal - Beautiful modal to show complete project details
 */
const ProjectDetailModal = ({ project, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFullImage, setShowFullImage] = useState(false);

    if (!project) return null;

    // Get all images
    const images = project.imageUrls && project.imageUrls.length > 0
        ? project.imageUrls
        : project.imageUrl
            ? [project.imageUrl]
            : [];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        // Handle both regular YouTube and Shorts URLs
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    const hasVideo = project.videoUrl && (project.videoType === 'YOUTUBE' || project.videoType === 'UPLOAD');

    return (
        <>
            {/* Main Modal */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
                onClick={onClose}
            >
                <div
                    className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-20 p-3 bg-white/95 dark:bg-gray-800/95 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all shadow-xl hover:scale-110"
                    >
                        <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* Image Gallery */}
                    {images.length > 0 && (
                        <div className="relative h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                            <img
                                src={images[currentImageIndex]}
                                alt={`${project.title} - Image ${currentImageIndex + 1}`}
                                className="w-full h-full object-contain cursor-zoom-in"
                                onClick={() => setShowFullImage(true)}
                            />

                            {/* Fullscreen Button */}
                            <button
                                onClick={() => setShowFullImage(true)}
                                className="absolute top-4 left-4 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
                            >
                                <Maximize2 className="w-5 h-5 text-white" />
                            </button>

                            {/* Image Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/95 dark:bg-gray-800/95 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all shadow-xl hover:scale-110"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/95 dark:bg-gray-800/95 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all shadow-xl hover:scale-110"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-bold">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>

                                    {/* Image Thumbnails */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90%] overflow-x-auto pb-2">
                                        {images.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentImageIndex(index)}
                                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                    ? 'border-blue-500 scale-110 shadow-lg'
                                                    : 'border-white/50 hover:border-white opacity-70 hover:opacity-100'
                                                    }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-8 lg:p-12">
                        {/* Title & URL */}
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                            <div className="flex-1">
                                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {project.title}
                                </h2>
                                {project.projectUrl && (
                                    <a
                                        href={project.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1"
                                    >
                                        {project.projectUrl}
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                            {project.projectUrl && (
                                <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    View Live Project
                                </a>
                            )}
                        </div>

                        {/* Description */}
                        {project.description && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-3 tracking-wider flex items-center gap-2">
                                    📝 About This Project
                                </h3>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* YouTube Video */}
                        {project.videoType === 'YOUTUBE' && project.videoUrl && getYouTubeEmbedUrl(project.videoUrl) && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider flex items-center gap-2">
                                    <Youtube className="w-5 h-5 text-red-500" />
                                    Project Demo Video
                                </h3>
                                <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200 dark:border-gray-700">
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={getYouTubeEmbedUrl(project.videoUrl)}
                                        title="Project demo video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {/* Uploaded Video */}
                        {project.videoType === 'UPLOAD' && project.videoUrl && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider flex items-center gap-2">
                                    <Play className="w-5 h-5 text-purple-500" />
                                    Project Demo Video
                                </h3>
                                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-200 dark:border-gray-700">
                                    <video
                                        controls
                                        className="w-full"
                                        src={project.videoUrl}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        )}

                        {/* Project Stats/Info */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{images.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Images</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{hasVideo ? '1' : '0'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Video</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{project.projectUrl ? '✓' : '✗'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Live Demo</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                    {project.videoType === 'YOUTUBE' ? 'YT' : project.videoType === 'UPLOAD' ? 'MP4' : 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Video Type</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Image Viewer */}
            {showFullImage && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-in fade-in duration-200"
                    onClick={() => setShowFullImage(false)}
                >
                    <button
                        onClick={() => setShowFullImage(false)}
                        className="absolute top-6 right-6 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                    >
                        <X className="w-8 h-8 text-white" />
                    </button>
                    <img
                        src={images[currentImageIndex]}
                        alt={`${project.title} - Fullscreen`}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                            >
                                <ChevronLeft className="w-8 h-8 text-white" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all"
                            >
                                <ChevronRight className="w-8 h-8 text-white" />
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ProjectDetailModal;
