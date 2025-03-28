// import axios from "axios";
// import api from "../api";
// export const fetchRecipeDetails = async (request: string) => {
//     try {
//         const response = await axios.post('http://localhost:5000/api/fetch_recipe', {
//             request: request
//         });
//         console.log(response.data.result);
        

//         if (response.data.result.includes('```')) {
//             const answer = response.data.result.split('```')[1];
//             console.log(answer.split('json')[1]);
            
//             return answer.split('json')[1];
//         }
//         return response.data.result;

//         return response.data.result;
//     } catch (err: any) {
//         console.log('Error fetching recipe: ' + err);
//         return null;
//     }
// };

// export const uploadRecipeService = async (
//     blob: Blob,
//     userId: number
// ) => {  
//     const API_URL = "https://localhost:7005/api/Recipe";
//     if (blob) {
//         try {
//             const blobName = '' + userId + new Date().getTime() + ".docx";
//             console.log(blobName);
//             console.log(blob.type);

//             const res = await api.get(`${API_URL}/Upload-url`, {
//                 params: {
//                     fileName: blobName,
//                     contentType: blob.type
//                 },
//             });

//             const presignedUrl = res.data.url;
//             await axios.put(presignedUrl, blob, { headers: { "Content-Type": blob.type } });
 
//             return presignedUrl.split("?")[0];
//         } catch (error) {
//             console.error("שגיאה בהעלאת הקובץ:", error);
//             return null;
//         }
//     }
//     return null;
// };
