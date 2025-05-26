import axios from "axios";

const API_URL = "https://smartchef-api.onrender.com/api/User";
export const uploadProfilePictureService = async (file: File): Promise<string | null> => {
    if (file) {
        try {
            const imageName = '' + new Date().getTime() + file.name
            const res = await axios.get(`${API_URL}/Upload-url`, {
                params: {
                    fileName: imageName,
                    contentType: file.type
                },
            });

            const presignedUrl = res.data.url;
            return presignedUrl;
            // await axios.put(presignedUrl, file, { headers: { "Content-Type": file.type } });
            // return presignedUrl.split("?")[0];
        } catch (error) {
            return null;
        }
    }
    return null;
};

// export const DownloadProfilePictureService = async (
//     fileName: string
// ) => {
//     try {
//         const response = await api.get(`${API_URL}/Download-url/${fileName}`);
//         console.log(response.data.downloadUrl);
//         return response.data.downloadUrl;
//     } catch (error) {
//         console.error("Error fetching download URL:", error);
//     }
// };



// import axios from "axios";

// const API_URL = "https://localhost:7005/api/User";

// export const uploadProfilePictureService = async (file: File) => {
//     // קבלת ה-URL להעלאה
//     let uploadUrl: string;

//     if (file) {
//         const fileNameWithExtension = file.name.split('/').pop();
//         if (fileNameWithExtension == null) return;
//         const fileName = fileNameWithExtension.split('.').shift(); // מחלק לפי '.' ומחזיר את החלק הראשון

//         // חילוץ סוג הקובץ
//         const fileExtension = fileNameWithExtension.split('.').pop(); // מחלק לפי '.' ומחזיר את החלק האחרון

//         console.log(fileName);
//         console.log(fileExtension);

//         try {
//             const response = await axios.get(`${API_URL}/Upload-url`, {
//                 params: {
//                     fileName,
//                     contentType: fileExtension
//                 }
//             });
//             uploadUrl = response.data.url;
//             console.log(uploadUrl);

//         } catch (e: any) {
//             throw new Error(e.message);
//         }


//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             await axios.put(uploadUrl, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//         } catch (e: any) {

//             throw new Error(e.message);
//         }
//     }

// };
