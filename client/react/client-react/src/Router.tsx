import { createBrowserRouter } from "react-router"
// import Home from "./components/Home"
import LayOut from "./components/LayOut"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import PublicRecipes from "./components/PublicRecipes"
import PrivateRecipes from "./components/PrivateRecipes"
import Categories from "./components/Categories"
import OneCategory from "./components/OneCategory"
import Request from "./components/Services/Request"
// import Home  from "./components/Home"



export const Router = createBrowserRouter([
    {
        path: '/', element: <LayOut />,
        errorElement: <div>error</div>,
        children: [
            // { path: '', element: <Home /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'categories', element: <Categories /> },
            {path: 'categories/:category', element: <OneCategory />},
            { path: 'public-recipes', element: <PublicRecipes /> },
            { path: 'private-recipes', element: <PrivateRecipes /> },
            {path: 'request', element: <Request />},
            { path: 'api', element: <Request /> },
        ]
    }
])
