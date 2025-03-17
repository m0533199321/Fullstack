import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "./Redux/Store";
import CategoriesGrid from "./Categories";

const Auth = () => {
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    const signIn = (): void => {
        navigate('/login');
    }

    const signUp = (): void => {
        navigate('/register');
    }

    const allPrivateRecipes = () => {
        navigate('/private-recipes');
    }

    const allPublicRecipes = () => {
        navigate('/public-recipes');
    }

    return (
        <>
        <CategoriesGrid />
            {!isAuthenticated ? (
                <>
                    <Button onClick={signIn}>Sign In</Button>
                    <Button onClick={signUp}>Sign Up</Button>
                </>
            ) : (
                <>
                    <Button onClick={allPublicRecipes}>Pubilc Recipes</Button>
                    <Button onClick={allPrivateRecipes}>Private Recipes</Button>
                </>
            )}
        </>
    )
}

export default Auth;
