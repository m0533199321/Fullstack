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
            const result = await RequestService(inputValue + " difficulty: " + difficulty + " " + user.information, user.id);
            console.log(result);
            if (result!=null && result!=undefined && result.length > 0) {
                console.log(result[0]);
                console.log(result[1]);
                setFileUrl(result[1]);
                setShowFileViewer(true);
                console.log(result[0]);
                const name = result[0].split("\"")[1];
                console.log(name);
                setDetails([name,3]);
            }
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
        const value = Number(event.target.value);
        setDifficulty(value);
        event.target.style.setProperty('--value', `${(value - 1) * (100 / 4)}%`); // עדכון הערך עבור הגרדיאנט
    };

    return (
        <>
            {!showFileViewer ? (<>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8vh', marginLeft: '25vw' }}>
                    <img src="../../images/back/only-smartChef.png" alt="chef" style={{ width: '25vw', marginRight: '5px' }} />
                    <h1 style={{ margin: '0', marginTop: '19%', color: 'rgb(255, 217, 0)' }}>חיפוש עם</h1> {/* הוספת margin: 0 כדי למנוע רווחים */}
                </div>

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
                            min="1"
                            max="5"
                            value={difficulty}
                            onChange={handleDifficultyChange}
                            style={{ width: '100%', borderRadius: '10px' }}
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

