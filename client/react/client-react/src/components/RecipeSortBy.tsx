import type React from "react"

import { useState } from "react"
import type { Recipe } from "../models/RecipeType"
import { ArrowDownAZ, ArrowDownWideNarrow, Calendar } from "lucide-react"
import "../styles/RecipeSortBy.css"

export const sortRecipes = (recipes: Recipe[], criterion: string) => {
  switch (criterion) {
    case "degree":
      return [...recipes].sort((a, b) => a.degree - b.degree)
    case "name":
      return [...recipes].sort((a, b) => a.title.localeCompare(b.title))
    case "date":
      return [...recipes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    default:
      return recipes
  }
}

interface RecipeSortByProps {
  anchorEl: HTMLElement | null
  setAnchorEl: (value: React.SetStateAction<HTMLElement | null>) => void
  handleSortChange: (criterion: string) => void
}

const RecipeSortBy = ({ handleSortChange }: RecipeSortByProps) => {
// const RecipeSortBy = ({ anchorEl, setAnchorEl, handleSortChange }: RecipeSortByProps) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (criterion: string) => {
    handleSortChange(criterion)
    setIsOpen(false)
  }

  return (
    <div className="sort-container">
      <button className="sort-button" onClick={toggleDropdown} aria-expanded={isOpen}>
        <span>מיון לפי</span>
        <ArrowDownWideNarrow className="sort-icon" />
      </button>

      {isOpen && (
        <div className="sort-dropdown">
          <button className="sort-option" onClick={() => handleOptionClick("degree")}>
            <ArrowDownWideNarrow className="option-icon" />
            <span>דרגת קושי</span>
          </button>

          <button className="sort-option" onClick={() => handleOptionClick("name")}>
            <ArrowDownAZ className="option-icon" />
            <span>שם</span>
          </button>

          <button className="sort-option" onClick={() => handleOptionClick("date")}>
            <Calendar className="option-icon" />
            <span>תאריך יצירה</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default RecipeSortBy



// import { Sort } from "@mui/icons-material";
// import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
// import { Recipe } from "../models/RecipeType";

// export const sortRecipes = (recipes: Recipe[], criterion: string) => {
//     console.log(recipes);

//     switch (criterion) {
//         case 'degree':
//             return [...recipes].sort((a, b) => a.degree - b.degree);
//         case 'name':
//             return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
//         case 'date':
//             return [...recipes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
//         default:
//             return recipes;
//     }
// };

// const RecipeSortBy = ({ anchorEl, setAnchorEl, handleSortChange }: { anchorEl: HTMLElement | null, setAnchorEl: (value: React.SetStateAction<HTMLElement | null>) => void, handleSortChange: (criterion: string) => void }) => {
//     return (<>
//             <Tooltip title="מיון לפי">
//                 <Button
//                     variant="outlined"
//                     style={{
//                         backgroundColor: 'black',
//                         color: 'rgb(251, 222, 0)',
//                         borderColor: 'orange',
//                         maxHeight: '5.25vh',
//                         marginLeft: '3vw',
//                         marginRight: '1.5vw',
//                         width: '9vw',
//                         borderRadius: '7px'
//                     }}
//                     onClick={(e) => setAnchorEl(e.currentTarget)}
//                 >
//                     מיון לפי
//                     <p style={{ marginLeft: '1.5vw' }}></p>
//                     <Sort style={{ marginLeft: '8px', color: 'orange' }} />
//                 </Button>
//             </Tooltip>
//             <Menu
//                 anchorEl={anchorEl}
//                 open={Boolean(anchorEl)}
//                 onClose={() => setAnchorEl(null)}
//                 PaperProps={{
//                     style: {
//                         backgroundColor: 'black',
//                         color: 'orange',
//                         border: '1px solid orange',
//                         width: '8vw',
//                         maxWidth: '12vw'
//                     },
//                 }}
//             >
//                 <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
//                 <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
//                 <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
//             </Menu>
//     </>)
// }
// export default RecipeSortBy;