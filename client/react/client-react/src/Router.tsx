import { createBrowserRouter } from "react-router"
import Home from "./components/Home"
import LayOut from "./components/LayOut"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import PublicRecipes from "./components/PublicRecipes"
import PrivateRecipes from "./components/PrivateRecipes"
import Categories from "./components/Categories"
import OneCategory from "./components/OneCategory"
import Request from "./components/Request"
import FileViewer from "./components/FileViewer"
import Comments from "./components/Comments"
import DisplayRecipe from "./components/DisplayRecipe"
import About from "./components/About"
import LastRecipes from "./components/LastRecipes"
import ForgotPassword from "./components/ForgotPassword"
// import Python from "./components/Python"
// import Home  from "./components/Home"



export const Router = createBrowserRouter([
    {
        path: '/', element: <LayOut />,
        errorElement: <div>error</div>,
        children: [
            { path: '', element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'categories', element: <Categories /> },
            { path: 'categories/:category', element: <OneCategory /> },
            { path: 'public-recipes', element: <PublicRecipes /> },
            { path: 'private-recipes', element: <PrivateRecipes /> },
            { path: 'request', element: <Request /> },
            { path: 'comments', element: <Comments recipeId={1} /> },
            { path: 'recipe/:id', element: <DisplayRecipe /> },
            { path: 'last', element: <LastRecipes /> },
            { path: 'forgot-password', element: <ForgotPassword /> }
            // {
            //     path: 'file-viewer', element: <FileViewer onClose={() => { }}
            //         fileUrl="https://malismartchef.s3.us-east-1.amazonaws.com/recipes/261742340504975.docx"
            //         // details={['חלה מתוקה', '4', '0']} />
            //         details={null} />
            // },
            // {path: 'python', element: <Python request="אני צריכה מתכון ארוך מאד מאד ומסובך מאד ממש עם מלא רכיבים והוראות הכנה להכנת עוגת שכבות תאריך כמה שרק אפשר" onClose={() => {}}/>}

        ]
    }
])
