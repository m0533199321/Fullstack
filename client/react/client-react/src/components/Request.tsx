import { useState } from "react";
import { Send } from "@mui/icons-material";
import "../styles/Request.css";

const Request = () => {
    const [inputValue, setInputValue] = useState("");

    // const handleInputChange = (event) => {
    //     setInputValue(event.target.value);
    // };

    // const handleSend = () => {
        
    //     console.log("Sent:", inputValue);
    //     setInputValue(""); // מנקה את ה-input לאחר שליחה
    // };

    // const handleKeyPress = (event) => {
    //     if (event.key === "Enter") {
    //         handleSend();
    //     }
    // };

    return (
        <>
            <h1>smart-chef חיפוש עם</h1>
            <input 
                type="text" 
                className="input-with-icon" 
                placeholder="ספר/י לי מה את/ה רוצה" 
                value={inputValue} 
                // onChange={handleInputChange} 
                // onKeyPress={handleKeyPress} 
            />
            {/* <span className="icon-container" onClick={handleSend}> */}
                <Send className="send" />
            {/* </span> */}
        </>
    );
};

export default Request;

