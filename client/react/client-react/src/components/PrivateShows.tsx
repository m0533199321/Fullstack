import type React from "react"
import "../styles/PrivateShows.css"

interface PrivateShowsProps {
  showPrivate: boolean
  showPublic: boolean
  privateClick: () => void
  publicClick: () => void
}

const PrivateShows: React.FC<PrivateShowsProps> = ({ showPrivate, showPublic, privateClick, publicClick }) => {
  return (
    <div className="privateShows-recipe-toggle-wrapper">
      <div className="privateShows-recipe-toggle-container">
        <div className={`privateShows-toggle-slider ${showPublic ? "right" : "left"}`}></div>
        <button className={`privateShows-toggle-option ${showPrivate ? "active" : ""}`} onClick={publicClick}>
          מהמומלצים
        </button>
        <button className={`privateShows-toggle-option ${showPublic ? "active" : ""}`} onClick={privateClick}>
          אישיים
        </button>
      </div>
    </div>
  )
}

export default PrivateShows