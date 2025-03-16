import TextField from '@mui/material/TextField';


interface CustomTextFieldProps {
    name: string;
    label: string;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({ name, label, value, handleChange }) => {
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
                '& input': {
                    color: 'black',
                },
                '& label': {
                    color: 'black',
                },
                '& .MuiFormLabel-root.Mui-focused': {
                    color: 'black',
                },
                backgroundColor: 'white',
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
}

export const CreateTextField: React.FC<CreateTextFieldProps> = ({ name, label, type = "text", value, error, helperText, handleChange }) => (
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
            '& input': {
                color: 'black',
            },
            '& label': {
                color: 'black',
            },
            '& .MuiFormLabel-root.Mui-focused': {
                color: 'black',
            },
            backgroundColor: 'white',
        }}
    />
);
