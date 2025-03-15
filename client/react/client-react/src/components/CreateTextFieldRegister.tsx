import React from 'react';
import { TextField } from '@mui/material';

interface TextFieldProps {
    name: string;
    label: string;
    type?: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    required?: boolean;
    fullWidth?: boolean;
}

const createTextField = ({
    name,
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    fullWidth = true,
}: TextFieldProps) => {
    return (
        <TextField
            variant="outlined"
            margin="normal"
            required={required}
            fullWidth={fullWidth}
            name={name}
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            InputProps={{ style: { color: 'black' } }}
            InputLabelProps={{ style: { color: 'black' } }}
            sx={{ 
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: 'black',
                    },
                    '&:hover fieldset': {
                        borderColor: 'black',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'black',
                    },
                },
            }}
        />
    );
};

export default createTextField;
