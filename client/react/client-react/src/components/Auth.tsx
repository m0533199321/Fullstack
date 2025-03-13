import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();


    const signIn = (): void => {
        navigate('/login');
    }

    const signUp = (): void => {
        navigate('/register');
    }

    return (
        <>
            <Button onClick={signIn}>sign in</Button>
            <Button onClick={signUp}>sign up</Button>
        </>
    )
}

export default Login;
