import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const navigate = useNavigate();


    const signIn = (): void => {
        navigate('/login');
    }

    const signUp = (): void => {
        navigate('/register');
    }

    const allRecipes =() => {
        navigate('/private-recipes');
    }

    return (
        <>
            <Button onClick={signIn}>sign in</Button>
            <Button onClick={signUp}>sign up</Button>
            <Button onClick={allRecipes}>private recipes</Button>
        </>
    )
}

export default Auth;
