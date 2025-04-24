import { useEffect, useState } from "react";
import { Send } from "@mui/icons-material";
import "../styles/Request.css";
import FileViewer from "./FileViewer";
import RequestService from "./Services/RequestService";
import { useAppSelector } from "./Redux/Store";

const Request = () => {
    const user = useAppSelector((state) => state.auth.user);
    const [inputValue, setInputValue] = useState("");
    const [fileUrl, setFileUrl] = useState<Blob | null>(null);
    const [showFileViewer, setShowFileViewer] = useState(false);
    const [difficulty, setDifficulty] = useState<number>(2);
    const [details, setDetails] = useState<string[]>([]);
    const [send, setSend] = useState(false);
    const emptyInput = "";
    const placeHolderTexts = [
        "איזה מתכון טעים בא לכם היום?",
        "מחפשים השראה קולינרית? בואו נגלה יחד!",
        "בואו נמצא את המתכון המושלם בשבילכם!",
        "חלומות מתוקים מתחילים כאן... חפשו מתכון!",
        "מה בא לכם לבשל היום? נשמח לעזור!",
        "מתכון חדש מחכה לכם! רק תכתבו מה בא לכם.",
        "מחפשים מתכון? אנחנו כאן כדי לעזור לכם!",
        "כל מתכון שתרצו, במרחק חיפוש אחד.",
        "תפתיעו אותנו! איזה מתכון אתם מחפשים?",
    ];
    const [placeholder, setPlaceholder] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    let intervalId: NodeJS.Timeout | undefined;

    useEffect(() => {
        const rangeInput = document.querySelector('input[type="range"]') as HTMLInputElement;
        if (rangeInput) {
            rangeInput.style.setProperty('--value', `${(difficulty - 1) * (100 / 4)}%`);
        }
    }, []);

    useEffect(() => {
        if (!isDeleting && charIndex < placeHolderTexts[placeholderIndex].length) {
            intervalId = setInterval(() => {
                setPlaceholder((prev) => prev + placeHolderTexts[placeholderIndex][charIndex]);
                setCharIndex((prev) => prev + 1);
            }, 100);
        } else if (isDeleting && charIndex > 0) {
            intervalId = setInterval(() => {
                setPlaceholder((prev) => prev.slice(0, -1));
                setCharIndex((prev) => prev - 1);
            }, 50);
        } else {
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (isDeleting) {
                setIsDeleting(false);
                setPlaceholderIndex((prev) => (prev + 1) % placeHolderTexts.length);
            } else {
                setTimeout(() => {
                    setIsDeleting(true);
                }, 1000);
            }
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [placeholderIndex, charIndex, isDeleting]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSend = async () => {
        if (user && inputValue != "") {
            setSend(true);
            const result = await RequestService(inputValue + " difficulty: " + difficulty);
            if (result != null && result != undefined && result.length > 0) {
                setFileUrl(result[1]);
                setShowFileViewer(true);
                const name = result[0]
                setDetails([name]);
            }
        }
        setInputValue("");
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            handleSend();
        }
    };

    const handleClose = () => {
        setShowFileViewer(false);
        setFileUrl(null);
        setSend(false);
    };

    const handleDifficultyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        setDifficulty(value);
        event.target.style.setProperty('--value', `${(value - 1) * (100 / 4)}%`);
    };

    return (
        <>
            {!showFileViewer ? (<>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8vh', marginLeft: '28vw' }}>
                    <img src="../../images/back/only-smartChef.png" alt="chef" style={{ width: '25vw', marginRight: '5px' }} />
                    <h1 style={{ margin: '0', marginTop: '19%', color: 'rgb(255, 217, 0)' }}>חיפוש עם</h1>
                </div>

                {!send && <input
                    type="text"
                    className="input-with-icon"
                    placeholder={placeholder}
                    value={send ? emptyInput : inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    style={{ marginLeft: '19vw' }}
                />}
                {send &&
                   <input
                   type="text"
                   className="input-with-icon"
                   value={"אני מכין לך מתכון מושלם, בתאבון..."}
                   style={{ marginLeft: '19vw' }}
               />}
                {!send && <div style={{ width: '20%', marginLeft: '20vw' }}>
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
                </div>}
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

