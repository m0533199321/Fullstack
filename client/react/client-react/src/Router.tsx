import { createBrowserRouter } from "react-router"
// import Home from "./components/Home"
import LayOut from "./components/LayOut"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import ProfilePicture from "./components/ProfilePicture"



export const Router = createBrowserRouter([
    {
        path: '/', element: <LayOut />,
        errorElement: <div>error</div>,
        children: [
            // { path: 'Home', element: <Home /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'login', element: <LoginForm /> },
            // { path: 'register/profile', element: <ProfilePicture onSelect={() => {}} /> }
        ]
    }
])
