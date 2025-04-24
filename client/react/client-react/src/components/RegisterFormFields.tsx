import { ChangeEvent } from "react";
import { CreateTextField } from "./RegisterGenericTextField";

const RegisterFromFields = ({ firstName, lastName, email, password, errorsEmail, errorsPassword, handleChange }:
     { firstName: string, lastName: string, email: string, password: string, errorsEmail: string | undefined, errorsPassword: string | undefin,
        handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) => {
    return (<>
        <CreateTextField
            name="firstName"
            label="שם פרטי"
            type="text"
            value={firstName}
            handleChange={handleChange}
        />
        <CreateTextField
            name="lastName"
            label="שם משפחה"
            type="text"
            value={lastName}
            handleChange={handleChange}
        />
        <CreateTextField
            name="email"
            label="מייל"
            type="email"
            value={email}
            error={!!errorsEmail}
            helperText={errorsEmail}
            handleChange={handleChange}
        />
        <CreateTextField
            name="password"
            label="סיסמה"
            type="password"
            value={password}
            error={!!errorsPassword}
            helperText={errorsPassword}
            handleChange={handleChange}
        />
    </>)
}

export default RegisterFromFields;