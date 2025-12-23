/**
 * File Download Utility
 * Handles cross-origin file downloads by fetching as a blob to ensure correct file headers and naming.
 */

export const downloadFile = async (url, filename = 'document.pdf') => {
    if (!url) return;

    console.log('--- Starting File Download ---');
    console.log('Source:', url);
    console.log('Target Name:', filename);

    try {
        // Fetch the file
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        // Get the response as a blob
        const blob = await response.blob();

        // Create a temporary object URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a hidden anchor element
        const link = document.createElement('a');
        link.href = blobUrl;

        // Set the download attribute with the desired filename
        link.setAttribute('download', filename);

        // Append to body, click, and cleanup
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Clean up the object URL
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

        console.log('Download triggered successfully');
    } catch (error) {
        console.error('Download failed:', error);

        // Fallback: Try opening in a new tab if blob download fails
        console.log('Attempting fallback: opening in new tab');
        window.open(url, '_blank');
    }
};

export default downloadFile;
