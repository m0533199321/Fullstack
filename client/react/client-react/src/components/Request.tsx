import { useState } from "react";
import { Send } from "@mui/icons-material";
import "../styles/Request.css";
import FileViewer from "./FileViewer";
import RequestService from "./Services/RequestService";
import { useAppSelector } from "./Redux/Store";
import { recipeDetailsService } from "./Services/RecipeService";

const Request = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [inputValue, setInputValue] = useState("");
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [showFileViewer, setShowFileViewer] = useState(false);
    const [difficulty, setDifficulty] = useState(0);
    const [details, setDetails] = useState<string[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSend = async () => {
        if (user && inputValue != "") {
            console.log("Sent:", inputValue);
            const url = await RequestService(inputValue + " difficulty: " + difficulty, user.id);
            console.log(url);
            if (url) {
                console.log(url);
                setFileUrl(url);
                setShowFileViewer(true);
            }
            setDetails(await recipeDetailsService(inputValue));
            setInputValue("");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSend();
        }
    };

    const handleClose = () => {
        setShowFileViewer(false);
        console.log(fileUrl);
        setFileUrl(null);
    };
    return (
        <>
            <input type="number" value={difficulty} onChange={event => { setDifficulty(Number(event.target.value)) }} />
            <h1>smart-chef חיפוש עם</h1>
            <input
                type="text"
                className="input-with-icon"
                placeholder="ספר/י לי מה את/ה רוצה"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
            <span className="icon-container" onClick={handleSend}>
                <Send className="send" />
            </span>
            {showFileViewer && fileUrl && (
                <FileViewer fileUrl={fileUrl} onClose={handleClose} details={[...details, ''+difficulty]} />
            )}
        </>
    );
};

export default Request;



// import { useState } from "react";
// import { Send } from "@mui/icons-material";
// import "../styles/Request.css";
// import RequestService from "./Services/RequestService";

// const Request = () => {
//     const [inputValue, setInputValue] = useState("");

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setInputValue(event.target.value);
//     };

//     const handleSend = async () => {
//         console.log("Sent:", inputValue);
//         const data = await RequestService(inputValue);
//         console.log(data);
//         setInputValue("");
//     };

//     const handleKeyPress = (event: React.KeyboardEvent) => {
//         if (event.key === "Enter") {
//             handleSend();
//         }
//     };

//     return (
//         <>
//             <h1>smart-chef חיפוש עם</h1>
//             <input
//                 type="text"
//                 className="input-with-icon"
//                 placeholder="ספר/י לי מה את/ה רוצה"
//                 value={inputValue}
//                 onChange={handleInputChange}
//                 onKeyPress={handleKeyPress}
//             />
//             <span className="icon-container" onClick={handleSend}>
//                 <Send className="send" />
//             </span>
//         </>
//     );
// };

// export default Request;

