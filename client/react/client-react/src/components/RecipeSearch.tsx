import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";

const RecipeSearch = ({setSearchRecipe}:{setSearchRecipe: (value: React.SetStateAction<string>) => void}) => {
    return (<>
        <TextField
            className="private-text-field"
            variant="outlined"
            placeholder=" חפש שם מתכון..."
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Search style={{ color: '#FFA500' }} />
                        <p style={{ marginLeft: '0.75vw' }}></p>
                    </InputAdornment>
                ),
                style: {
                    padding: '0',
                    color: 'orange',
                    maxWidth: '12vw',
                    maxHeight: '5.25vh',
                    borderRadius: '7px',
                    paddingRight: '10px'
                }
            }}
            onChange={(e) => setSearchRecipe(e.target.value)}
        />
    </>)
}

export default RecipeSearch;