import { createBrowserRouter } from "react-router"
import Home from "./components/Home"
import LayOut from "./components/LayOut"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import PublicRecipes from "./components/PublicRecipes"
import PrivateRecipes from "./components/PrivateRecipes"
import Request from "./components/Request"
import DisplayRecipe from "./components/DisplayRecipe"
import About from "./components/About"
import LastRecipes from "./components/LastRecipes"
import ForgotPassword from "./components/ForgotPassword"
import { Google } from "@mui/icons-material"
import AllergiesForm from "./components/AllergiesForm"
import PreferencesForm from "./components/PreferencesForm"


export const Router = createBrowserRouter([
    {
        path: '/', element: <LayOut />,
        errorElement: <div>error</div>,
        children: [
            { path: '', element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'register', element: <RegisterForm /> },
            { path: 'login', element: <LoginForm /> },
            { path: 'public-recipes', element: <PublicRecipes /> },
            { path: 'private-recipes', element: <PrivateRecipes /> },
            { path: 'request', element: <Request /> },
            { path: 'recipe/:id', element: <DisplayRecipe /> },
            { path: 'last', element: <LastRecipes /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'google', element: <Google /> },
            { path: 'allergies', element: <AllergiesForm userId={110}/> },
            { path: 'preferences', element: <PreferencesForm userId={110}/> },

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


// import { Routes, Route } from "react-router-dom";
// import Home from "./components/Home";
// import LayOut from "./components/LayOut";
// import LoginForm from "./components/LoginForm";
// import RegisterForm from "./components/RegisterForm";
// import PublicRecipes from "./components/PublicRecipes";
// import PrivateRecipes from "./components/PrivateRecipes";
// import Request from "./components/Request";
// import DisplayRecipe from "./components/DisplayRecipe";
// import About from "./components/About";
// import LastRecipes from "./components/LastRecipes";
// import ForgotPassword from "./components/ForgotPassword";
// import EmailToMe from "./components/EmailToMe";
// import AllergiesForm from "./components/AllergiesForm";
// import PreferencesForm from "./components/PreferencesForm";

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<LayOut />}>
//         <Route index element={<Home />} />
//         <Route path="about" element={<About />} />
//         <Route path="register" element={<RegisterForm />} />
//         <Route path="login" element={<LoginForm />} />
//         <Route path="public-recipes" element={<PublicRecipes />} />
//         <Route path="private-recipes" element={<PrivateRecipes />} />
//         <Route path="request" element={<Request />} />
//         <Route path="recipe/:id" element={<DisplayRecipe />} />
//         <Route path="last" element={<LastRecipes />} />
//         <Route path="forgot-password" element={<ForgotPassword />} />
//         <Route path="email-to-me" element={<EmailToMe />} />
//         <Route path="allergies" element={<AllergiesForm userId={110} />} />
//         <Route path="preferences" element={<PreferencesForm userId={110} />} />
//         <Route path="*" element={<div>404 - page not found</div>} />
//       </Route>
//     </Routes>
//   );
// }