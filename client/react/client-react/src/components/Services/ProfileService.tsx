import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "https://localhost:7005/api/User";

export const uploadProfilePictureService = async (file: File) => {
    // קבלת ה-URL להעלאה
    let uploadUrl: string;

    if (file) {
        const fileNameWithExtension = file.name.split('/').pop(); 
        if(fileNameWithExtension == null) return;
        const fileName = fileNameWithExtension.split('.').shift(); // מחלק לפי '.' ומחזיר את החלק הראשון

        // חילוץ סוג הקובץ
        const fileExtension = fileNameWithExtension.split('.').pop(); // מחלק לפי '.' ומחזיר את החלק האחרון

        console.log(fileName);
        console.log(fileExtension);

        try {
            const response = await axios.get(`${API_URL}/Upload-url`, {
                params: {
                    fileName,
                    contentType: fileExtension
                }
            });
            uploadUrl = response.data.url;
            console.log(uploadUrl);
            
        } catch (e: any) {
            Swal.fire("Error!", "Failed to get upload URL. Please try again.", "error");
            throw new Error(e.message);
        }

        // העלאת הקובץ ל-URL שהתקבל
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.put(uploadUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            Swal.fire("Success!", "Profile picture uploaded successfully!", "success");
        } catch (e: any) {
            Swal.fire("Error!", "Failed to upload profile picture. Please try again.", "error");

            throw new Error(e.message);
        }
    }

};
