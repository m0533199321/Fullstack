import "../styles/PublicShows.css"

interface PrivateShowsProps {
    showPrivate: boolean
    showPublic: boolean
    privateClick: () => void
    publicClick: () => void
}

const PublicShows: React.FC<PrivateShowsProps> = ({ showPrivate, showPublic, privateClick, publicClick }) => {
    return (
        <div className="publicShows-recipe-toggle-wrapper">
            <div className="publicShows-recipe-toggle-container">
                <div className={`publicShows-toggle-slider ${showPublic ? "right" : "left"}`}></div>
                <button className={`publicShows-toggle-option ${showPrivate ? "active" : ""}`} onClick={publicClick}>
                    לא בספר
                </button>
                <button className={`publicShows-toggle-option ${showPublic ? "active" : ""}`} onClick={privateClick}>
                    בספר
                </button>
            </div>
        </div>
    )
}
export default PublicShows;


