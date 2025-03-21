import TextField from '@mui/material/TextField';


interface CustomTextFieldProps {
    name: string;
    label: string;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    sx?: object;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({ name, label, value, handleChange, sx }) => {
    return (
        <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name={name}
            label={label}
            multiline
            rows={4}
            value={value}
            onChange={handleChange}
            InputProps={{
                style: { textAlign: 'right' },
                dir: 'rtl'
            }}
            sx={{
                ...sx,
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#777',
                    },
                    '&:hover fieldset': {
                        borderColor: '#777',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#777',
                    },
                },
                '& input': {
                    color: '#777',
                },
                '& label': {
                    color: '#777',
                },
                '& .MuiFormLabel-root.Mui-focused': {
                    color: '#777',
                },
                backgroundColor: '#222',
            }}
        />
    );
};

interface CreateTextFieldProps {
    name: string;
    label: string;
    type: string;
    value: string;
    error?: boolean;
    helperText?: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    sx?: object;
}


export const CreateTextField: React.FC<CreateTextFieldProps> = ({ name, label, type = "text", value, error, helperText, handleChange, sx }) => (
    <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        name={name}
        label={label}
        type={type}
        value={value}
        onChange={handleChange}
        required
        error={error}
        helperText={helperText}
        InputProps={{
            sx: {
                backgroundColor: '#222',
                '&:hover': {
                    backgroundColor: '#222',
                },
                '&.Mui-focused': {
                    backgroundColor: '#222',
                },
                '&[type="text"]': {
                    backgroundColor: '#222',
                },
            }
        }}
        autoComplete="off"
        sx={{
            ...sx,
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderColor: '#777',
                },
                '&:hover fieldset': {
                    borderColor: '#777',
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#777',
                },
            },
            '& input': {
                color: '#777',
            },
            '& label': {
                color: '#777',
            },
            '& .MuiFormLabel-root.Mui-focused': {
                color: '#777',
            },
            backgroundColor: '#222',
        }}
    />
);
