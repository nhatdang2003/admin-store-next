import httpClient from "./axios-config";

export const imageApi = {
    getPresignedUrl: async (fileName: string) => {
        const [name, extension] = fileName.split(".");
        const response = await httpClient.post("/api/v1/products/upload-images", {
            fileName: `${name}-${new Date().getTime()}.${extension}`,
        });
        return response.data;
    },
    uploadImage: async (presignedUrl: string, file: File) => {
        const response = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to upload image");
        }
        return response;
    },
};
