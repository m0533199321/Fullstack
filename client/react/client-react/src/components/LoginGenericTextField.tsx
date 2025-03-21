const inputStyles = {
    variant: "outlined" as const,
    margin: "normal" as const,
    required: true,
    fullWidth: true,
    sx: {
        input: { color: '#777' },
        label: { color: '#777' },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#777' },
            '&:hover fieldset': { borderColor: '#777' },
            '&.Mui-focused fieldset': { borderColor: '#777' },
        },
        '& .MuiInputLabel-root': { color: '#777' }, 
        '& .MuiInputLabel-root.Mui-focused': { color: '#777' }, 
    },
};

export default inputStyles;