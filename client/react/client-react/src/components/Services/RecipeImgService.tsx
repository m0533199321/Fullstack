import api from "../api";

const API_URL = "https://smartchef-api.onrender.com/api/RecipeImg";

export const recipeImg = async (request: string) => {
    const API_URL = "https://smartchef-python.onrender.com/api/recipe";

    try {
        const response = await api.post(`${API_URL}/image`, { prompt: request }, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'blob'
        });
        console.log("תגובה מלאה מהשרת:", response);

        if (response) {
            console.log("נתוני התגובה:", response.data);
            console.log("סוג נתוני התגובה:", typeof response.data);
            console.log("ההידרים של התגובה:", response.headers);
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            // const blob = new Blob([response.data], { type: 'image/png' });
            const file = new File([blob], 'recipeimage.png', { type: 'image/png' });
            // const blob = new Blob([response.data], { type: 'image/jpeg' });
            // const file = new File([blob], 'recipe-image.jpg', { type: 'image/jpeg' });

            console.log(typeof (file));

            return file;
            // const response2 = await uploadRecipeImgService(file);
            // console.log(response2);
            // return response2;
        }
    }
    catch (e) {
        console.error('Error:', e);
        return null;
    }
}

export const uploadRecipeImgService = async (file: File): Promise<string | null> => {
    if (file) {
        try {
            const imgName = '' + new Date().getTime() + ".png";
            console.log(imgName);
            console.log(file.type);

            const res = await api.get(`${API_URL}/Upload-url`, {
                params: {
                    fileName: imgName,
                    contentType: file.type
                },
            });

            const presignedUrl = res.data.url;
            console.log(presignedUrl);
            return presignedUrl;
            // await axios.put(presignedUrl, file, {
            //     headers: { "Content-Type": file.type }
            // });

            // return presignedUrl.split("?")[0];
        } catch (error) {
            console.error("שגיאה בהעלאת הקובץ:", error);
            return null;
        }
        // try { 
        //     const imageName = '' + new Date().getTime() + file.name;
        //     console.log(imageName);
        //     console.log(file.type);

        //     const res = await axios.get(`${API_URL}/Upload-url`, {
        //         params: {
        //             fileName: imageName,
        //             contentType: file.type
        //         },
        //     });

        //     const presignedUrl = res.data.url;
        //     console.log(presignedUrl);
        //     return presignedUrl;
        // } catch (error) {
        //     console.error("שגיאה בהעלאת הקובץ:", error);
        //     return null;
        // }
    }
    return null;
};