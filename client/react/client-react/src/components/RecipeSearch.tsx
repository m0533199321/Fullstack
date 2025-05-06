import type React from "react"

import { Search } from "lucide-react"
import "../styles/RecipeSearch.css"

interface RecipeSearchProps {
  setSearchRecipe: (value: React.SetStateAction<string>) => void
}

const RecipeSearch = ({ setSearchRecipe }: RecipeSearchProps) => {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="חפש שם מתכון..."
          onChange={(e) => setSearchRecipe(e.target.value)}
        />
        <Search className="search-icon" />
      </div>
    </div>
  )
}

export default RecipeSearch

// import { Search } from "@mui/icons-material";
// import { InputAdornment, TextField } from "@mui/material";

// const RecipeSearch = ({setSearchRecipe}:{setSearchRecipe: (value: React.SetStateAction<string>) => void}) => {
//     return (<>
//         <TextField
//             className="private-text-field"
//             variant="outlined"
//             placeholder=" חפש שם מתכון..."
//             InputProps={{
//                 endAdornment: (
//                     <InputAdornment position="end">
//                         <Search style={{ color: '#FFA500' }} />
//                         <p style={{ marginLeft: '0.75vw' }}></p>
//                     </InputAdornment>
//                 ),
//                 style: {
//                     padding: '0',
//                     color: 'orange',
//                     maxWidth: '12vw',
//                     maxHeight: '5.25vh',
//                     borderRadius: '7px',
//                     paddingRight: '10px'
//                 }
//             }}
//             onChange={(e) => setSearchRecipe(e.target.value)}
//         />
//     </>)
// }

// export default RecipeSearch;