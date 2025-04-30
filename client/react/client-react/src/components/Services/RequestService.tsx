import axios from "axios";
import api from "../api";

// const requestService = async (
//     request: string,
//     userId: number
// ) => {
//     console.log(request);

//     const response = await fetch('http://localhost:5000/api/recipe/name', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ request: request }),
//     });

//     if (response.ok) {
//         const data = await response.json();
//         const name = data.recipe_name;
//         console.log(name);
//         const response2 = await fetch('http://localhost:5000/api/recipe/file', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ request: request, recipe_name: name }),
//         });
//         if (response.ok) {
//             const blob = await response2.blob();
//             console.log(name);
//             return [name, blob]
//             // return [name, await uploadRecipeService(blob, userId)];
//         }
//         // const url = window.URL.createObjectURL(blob);
//         // console.log(url);
//         // return url;
//     } else {
//         const errorText = await response.text();
//         console.error('Error:', errorText);
//         return null;
//     }

// };

// export default requestService;

const requestService = async (
    request: string
) => {
    // const API_URL = "https://localhost:7005/api/Request";
    const API_URL = "http://localhost:5000/api/recipe";

    try {
        const response = await api.post(`${API_URL}/name`, { request: request }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response) {
            const data = response.data;
            const name = data.recipe_name;
            console.log(name);
            const response2 = await api.post(`${API_URL}/file`, { request: request, recipe_name: name }, {
                headers: { 'Content-Type': 'application/json' },
                responseType: 'arraybuffer'
            });

            if (response2) {
                const fileData = new Uint8Array(response2.data);
                const base64File = btoa(String.fromCharCode(...fileData));

                const byteCharacters = atob(base64File);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'application/zip' });
                const file = new File([blob], name, { type: 'application/zip' });
                return [name, file];
            }
        }

        // const response = await api.post(`${API_URL}/Request`,
        // request,
        // { headers: { 'Content-Type': 'application/json' } }
        // );

        // if (response) {
        // const data = response.data;
        // console.log(data);
        // return data;
        // }
        // if (response) {
        //     const data = response.data;
        //     const fileName = data[0];
        //     const base64Data = data[1];

        //     const byteCharacters = atob(base64Data);
        //     const byteNumbers = new Array(byteCharacters.length);
        //     for (let i = 0; i < byteCharacters.length; i++) {
        //         byteNumbers[i] = byteCharacters.charCodeAt(i);
        //     }
        //     const byteArray = new Uint8Array(byteNumbers);
        //     const blob = new Blob([byteArray], { type: 'application/zip' });
        //     const file = new File([blob], fileName, { type: 'application/zip' });
        //     return [fileName, file];
        // }
        // else {
        //     return null;
        // }
    }
    catch (e) {
        console.error('Error:', e);
        return null;
    }
};

export default requestService;

export const uploadRecipeService = async (
    blob: Blob,
    userId: number
) => {
    const API_URL = "https://localhost:7005/api/Recipe";
    if (blob) {
        try {
            const blobName = '' + userId + new Date().getTime() + ".docx";
            console.log(blobName);
            console.log(blob.type);

            const res = await api.get(`${API_URL}/Upload-url`, {
                params: {
                    fileName: blobName,
                    contentType: blob.type
                },
            });

            const presignedUrl = res.data.url;
            await axios.put(presignedUrl, blob, { headers: { "Content-Type": blob.type } });

            return presignedUrl.split("?")[0];
        } catch (error) {
            console.error("שגיאה בהעלאת הקובץ:", error);
            return null;
        }
    }
    return null;
};

export const fetchGenerateImage = async (
    request: string,
    userId: number
) => {
    try {
        console.log(request);
        const response = await fetch('http://localhost:5000/api/generate_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: request }),
        });

        if (!response.ok) {
            throw new Error(`שגיאה בשרת 5000: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const imageUrl = data.image_url;

        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = imageResponse.data;
        const contentType = imageResponse.headers['content-type'];
        console.log(contentType);



        const imgName = '' + userId + new Date().getTime() + ".png";
        console.log(imgName);

        const apiUrl = "https://localhost:7005/api/Recipe/Upload-url";
        const presignedResponse = await axios.get(apiUrl, {
            params: {
                fileName: imgName,
                contentType: contentType,
            },
        });

        const presignedUrl = presignedResponse.data.url;

        await axios.put(presignedUrl, imageBuffer, {
            headers: {
                'Content-Type': contentType,
            },
        });

        return presignedUrl.split('?')[0];

    } catch (error) {
        console.error('שגיאה:', error);
        return null;
    }
}




// const RequestService = async (request: string) => {
//     const response = await fetch('http://localhost:5000/api/recipe', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ request: request }),
//     });

//     if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'recipe.docx';
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//     } else {
//         const errorText = await response.text();
//         console.error('Error:', errorText);
//     }
// };

// export default RequestService;

