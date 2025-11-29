
// services/imgbbService.ts

interface ImgBBResponse {
    data: {
        id: string;
        title: string;
        url_viewer: string;
        url: string;
        display_url: string;
        width: string;
        height: string;
        size: string;
        time: string;
        expiration: string;
        image: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        thumb: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        medium: {
            filename: string;
            name: string;
            mime: string;
            extension: string;
            url: string;
        };
        delete_url: string;
    };
    success: boolean;
    status: number;
}


export const imgbbService = {
    /**
     * Uploads an image file to imgbb.com.
     * @param file The image file to upload.
     * @returns A promise that resolves with the URL of the uploaded image.
     */
    upload: async (file: File): Promise<string> => {
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        if (!apiKey) {
            throw new Error('IMGBB_API_KEY is not defined in environment variables.');
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ImgBB upload failed: ${response.status} - ${errorText}`);
        }

        const result: ImgBBResponse = await response.json();

        if (!result.success || !result.data || !result.data.url) {
            throw new Error('ImgBB upload response malformed or failed.');
        }

        return result.data.url;
    }
};
