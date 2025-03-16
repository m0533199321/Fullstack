const inputStyles = {
    variant: "outlined" as const,
    margin: "normal" as const,
    required: true,
    fullWidth: true,
    sx: {
        input: { color: 'black' },
        label: { color: 'black' },
        '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'black' },
            '&:hover fieldset': { borderColor: 'black' },
            '&.Mui-focused fieldset': { borderColor: 'black' },
        },
        '& .MuiInputLabel-root': { color: 'black' }, // שינוי צבע הלייבלים
        '& .MuiInputLabel-root.Mui-focused': { color: 'black' }, // צבע הלייבל במיקוד
    },
};

export default inputStyles;