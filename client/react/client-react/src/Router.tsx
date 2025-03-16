import { createBrowserRouter } from "react-router"
// import Home from "./components/Home"
import LayOut from "./components/LayOut"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import PublicRecipes from "./components/PublicRecipes"
import PrivateRecipes from "./components/PrivateRecipes"



export const Router = createBrowserRouter([
    {
        path: '/', element: <LayOut />,
        errorElement: <div>error</div>,
        children: [
            // { path: 'Home', element: <Home /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'public-recipes', element: <PublicRecipes /> },
            { path: 'private-recipes', element: <PrivateRecipes /> }
        ]
    }
])
