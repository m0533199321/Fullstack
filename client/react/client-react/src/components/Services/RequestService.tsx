import axios from "axios";
import api from "../api";

const requestService = async (
    request: string,
    userId: number
) => {
    console.log(request);

    const response = await fetch('http://localhost:5000/api/recipe/name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ request: request }),
    });

    if (response.ok) {
        const data = await response.json();
        const name = data.recipe_name;
        console.log(name);
        const response2 = await fetch('http://localhost:5000/api/recipe/file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ request: request, recipe_name: name }),
        });
        if (response.ok) {
            const blob = await response2.blob();
            return [name, await uploadRecipeService(blob, userId)];
        }
        // const url = window.URL.createObjectURL(blob);
        // console.log(url);
        // return url;
    } else {
        const errorText = await response.text();
        console.error('Error:', errorText);
        return null;
    }

};

export default requestService;

const uploadRecipeService = async (
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

