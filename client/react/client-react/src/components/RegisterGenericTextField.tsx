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
                backgroundColor: 'black',
                '&:hover': {
                    border: '3px solid rgba(180, 120, 0, 0.7)',
                    backgroundColor: 'black',
                    boxShadow: '0 4px 10px rgba(180, 120, 0, 0.5)',
                },
                '&.Mui-focused': {
                    backgroundColor: 'black',
                },
                '&[type="text"]': {
                    backgroundColor: 'black',
                },
                borderRadius: '15px'
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
            borderRadius: '15px'
        }}
    />
);
