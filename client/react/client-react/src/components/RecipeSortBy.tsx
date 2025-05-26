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