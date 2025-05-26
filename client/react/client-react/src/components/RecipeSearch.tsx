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