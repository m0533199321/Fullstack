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
    const [difficulty, setDifficulty] = useState<number>(2);
    const [details, setDetails] = useState<string[]>([]);
    const [send, setSend] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSend = async () => {
        if (user && inputValue != "") {
            setSend(true);
            console.log("Sent:", inputValue);
            const url = await RequestService(inputValue + " difficulty: " + difficulty + " " + user.information, user.id);
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
        setSend(false);
    };

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDifficulty(Number(event.target.value));
    };

    const getSliderColor = (value: number) => {
        switch (value) {
            case 0:
                return 'red';
            case 1:
                return 'orange';
            case 2:
                return 'yellow';
            case 3:
                return 'lightgreen';
            case 4:
                return 'green';
            default:
                return 'green'
        }
    };
    return (
        <>
            {!showFileViewer ? (<>
                <h1>smart-chef חיפוש עם</h1>
                {send && <h3>אנחנו מכינים בשבילך</h3>}
                <input
                    type="text"
                    className="input-with-icon"
                    placeholder="ספר/י לי מה את/ה רוצה"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <div style={{ width: '20%', marginLeft: '18vw' }}>
                    <div className="difficulty-slider">
                        <label>דרגת קושי: {difficulty}</label>
                        <input
                            type="range"
                            min="0"
                            max="4"
                            value={difficulty}
                            onChange={handleDifficultyChange}
                            style={{ width: '100%', backgroundColor: getSliderColor(difficulty) }}
                        />
                    </div>
                    <span className="icon-container" onClick={handleSend}>
                        <Send className="send" />
                    </span>
                </div>
            </>) : (
                <>
                    {showFileViewer && fileUrl && (
                        <FileViewer fileUrl={fileUrl} onClose={handleClose} details={[...details, '' + difficulty]} />
                    )}
                </>
            )}
        </>
    )
}
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

