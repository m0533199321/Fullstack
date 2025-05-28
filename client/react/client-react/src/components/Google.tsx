// import { useDispatch } from "react-redux";
// import { AppDispatch } from "./Redux/Store";
// import { connectWithGoogle, fetchUser } from "./Redux/AuthSlice";
// import { GoogleLogin } from "@react-oauth/google";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Box, Divider, Typography } from "@mui/material";
// import { AlertCircle } from "lucide-react";
// import "../styles/Google.css";

// const Google = () => {
//     const [errorMessage, setErrorMessage] = useState<string>("")
//     const [errorOpen, setErrorOpen] = useState<boolean>(false);
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();


//     const handleGoogleSignIn = async (token: string) => {
//         try {

//             const result = await dispatch(connectWithGoogle({ token }));

//             if (result.meta.requestStatus === 'fulfilled') {
//                 setTimeout(() => { navigate('/'); }, 1500);
//                 dispatch(fetchUser() as any);
//             }

//             else {
//                 setErrorMessage('הרשמה באמצעות Google נכשלה');
//                 setErrorOpen(true)
//                 setTimeout(() => {
//                     setErrorOpen(false);
//                   }, 3000);
//             }
//         }
//         catch (error) {
//             setErrorMessage('הרשמה באמצעות Google נכשלה');
//             setErrorOpen(true)
//             setTimeout(() => {
//                 setErrorOpen(false);
//               }, 3000);
//         }
//     }

//     return (<>
//         <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
//             <Divider sx={{ flexGrow: 1, borderColor: 'grey.500' }} />
//             <Typography variant="body2" sx={{ mx: 2, color: 'grey.500', fontSize: '20px' }}>
//                 או
//             </Typography>
//             <Divider sx={{ flexGrow: 1, borderColor: 'grey.500' }} />
//         </Box>
//         <Box sx={{ direction: 'ltr' }}>
//             <GoogleLogin
//                 locale='en'
//                 text="signin_with"
//                 onSuccess={(credentialResponse) => {
//                     const token = credentialResponse.credential;
//                     if (token) {
//                         handleGoogleSignIn(token);
//                     } else {
//                         //setErrorMessage('Google Sign-In failed. Please try again.');
//                     }
//                 }}
//                 onError={() => {
//                     // setErrorMessage('Google Sign-In failed. Please try again.');
//                 }}
//                 useOneTap
//                 theme="outline"
//                 size="large"
//             />
//         </Box>
//         {errorOpen && errorMessage && (
//             <div className="google-error-message">
//                 <AlertCircle className="google-error-icon" size={18} />
//                 {errorMessage}
//             </div>
//         )}
//     </>)
// }

// export default Google


import { useDispatch } from "react-redux"
import type { AppDispatch } from "./Redux/Store"
import { connectWithGoogle, fetchUser } from "./Redux/AuthSlice"
import { GoogleLogin } from "@react-oauth/google"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Divider, Typography } from "@mui/material"
import { AlertCircle } from "lucide-react"
import "../styles/Google.css"

const Google = () => {
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [errorOpen, setErrorOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleGoogleSignIn = async (token: string) => {
    setIsLoading(true)
    try {
      const result = await dispatch(connectWithGoogle({ token }))

      if (result.meta.requestStatus === "fulfilled") {
        setTimeout(() => {
          navigate("/")
          setIsLoading(false)
        }, 1500)
        dispatch(fetchUser() as any)
      } else {
        setErrorMessage("הרשמה באמצעות Google נכשלה")
        setErrorOpen(true)
        setIsLoading(false)
        setTimeout(() => {
          setErrorOpen(false)
        }, 3000)
      }
    } catch (error) {
      setErrorMessage("הרשמה באמצעות Google נכשלה")
      setErrorOpen(true)
      setIsLoading(false)
      setTimeout(() => {
        setErrorOpen(false)
      }, 3000)
    }
  }

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", my: 4 }}>
        <Divider sx={{ flexGrow: 1, borderColor: "grey.500" }} />
        <Typography variant="body2" sx={{ mx: 2, color: "grey.500", fontSize: "20px" }}>
          או
        </Typography>
        <Divider sx={{ flexGrow: 1, borderColor: "grey.500" }} />
      </Box>
      <Box sx={{ direction: "ltr", position: "relative" }}>
        {isLoading && (
          <div className="google-button-loading">
            <div className="google-button-spinner"></div>
          </div>
        )}
        <GoogleLogin
          locale="en"
          text="signin_with"
          onSuccess={(credentialResponse) => {
            const token = credentialResponse.credential
            if (token && !isLoading) {
              handleGoogleSignIn(token)
            }
          }}
          onError={() => {
            if (!isLoading) {
              setErrorMessage("Google Sign-In failed. Please try again.")
              setErrorOpen(true)
              setTimeout(() => {
                setErrorOpen(false)
              }, 3000)
            }
          }}
          useOneTap
          theme="outline"
          size="large"
        //   disabled={isLoading}
        />
      </Box>
      {errorOpen && errorMessage && (
        <div className="google-error-message">
          <AlertCircle className="google-error-icon" size={18} />
          {errorMessage}
        </div>
      )}
    </>
  )
}

export default Google