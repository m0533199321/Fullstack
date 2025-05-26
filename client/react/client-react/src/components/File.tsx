import type React from "react"
import { useEffect, useState } from "react"
import { fetchAddToMyBook, fetchUpdateRecipeImg } from "./Services/RecipeService"
import type { Recipe, RecipePostModel } from "../models/RecipeType"
import { AppDispatch, useAppSelector } from "./Redux/Store"
import mammoth from "mammoth"
import "../styles/File.css"
import { FaImage } from "react-icons/fa"
import { uploadRecipeService } from "./Services/RequestService"
import { ChefHat, ArrowRight, BookPlus, Star, Download, Mail } from "lucide-react"
import { recipeImg, uploadRecipeImgService } from "./Services/RecipeImgService"
import axios from "axios"
import { Close } from "@mui/icons-material"
import { downloadRecipeFromUrl } from "./DownLoad"
import { recipeEmailBody } from "./RecipeEmailBody"
import { sendEmail } from "./Redux/AuthSlice"
import { useDispatch } from "react-redux"
import chef from "../../images/back/chef.png"

interface FileViewerProps {
    recipe: Recipe | null
    fileUrl: Blob | string
    onClose: () => void | null
    details: string[] | null
}

const File2: React.FC<FileViewerProps> = ({ recipe, fileUrl, onClose, details }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useAppSelector((state) => state.auth.user)
    const [htmlContent, setHtmlContent] = useState("")
    const [direction, setDirection] = useState<"ltr" | "rtl">("rtl")
    const [isLoading, setIsLoading] = useState(true)
    const [recipeImage, setRecipeImage] = useState(recipe?.picture || "");
    const [isImageUploading, setIsImageUploading] = useState(false)

    const changeImage = async () => {
        if (recipe) {
            setIsImageUploading(true)
            try {
                const file = await recipeImg(recipe?.title)

                if (file) {
                    uploadRecipeImgService(file)
                        .then(async (presignedUrl) => {
                            if (presignedUrl) {
                                await axios
                                    .put(presignedUrl, file, {
                                        headers: { "Content-Type": file.type },
                                    })
                                    .then(async () => {
                                        const res = await fetchUpdateRecipeImg(recipe.id, presignedUrl.split("?")[0])
                                        console.log(res)
                                        setRecipeImage(presignedUrl.split("?")[0])
                                        setIsImageUploading(false)
                                    })
                            } else {
                                setIsImageUploading(false)
                            }
                        })
                        .catch(() => {
                            setIsImageUploading(false)
                        })
                } else {
                    setIsImageUploading(false)
                }
            } catch (error) {
                setIsImageUploading(false)
            }
        }
    }

    useEffect(() => {
        const fetchDocx = async () => {
            setIsLoading(true)
            try {
                let response
                if (typeof fileUrl === "string") {
                    response = await fetch(fileUrl)
                } else {
                    response = fileUrl
                }
                const arrayBuffer = await response.arrayBuffer()
                const { value } = await mammoth.convertToHtml({ arrayBuffer })

                const enhancedHtml = enhanceRecipeContent(value)
                setHtmlContent(enhancedHtml)

                const hebrewWords = value.match(/[א-ת]+/g)
                const hebrewWordCount = hebrewWords
                    ? hebrewWords.reduce((count, word) => count + word.split(/\s+/).length, 0)
                    : 0

                if (hebrewWordCount >= 5) {
                    setDirection("rtl")
                } else {
                    setDirection("ltr")
                }
            } catch (error) {
            } finally {
                setIsLoading(false)
            }
        }

        fetchDocx()
    }, [fileUrl])

    const enhanceRecipeContent = (html: string) => {
        let enhanced = html
            .replace(/<strong>(.*?)<\/strong>/g, '<span class="highlighted">$1</span>')

            .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="recipe-title"><span class="title-icon">👨‍🍳</span> $1</h1>')
            .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="recipe-section">$1</h2>')
            .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="recipe-subsection">$1</h3>')

            .replace(/<ul>/g, '<ul class="recipe-list">')
            .replace(/<ol>/g, '<ol class="recipe-steps">')

            .replace(/<li>(.*?)<\/li>/g, (match, content) => {
                console.log(match);
                const hasTimeReference = /(\d+)\s*(דקות|שעות|minutes|hours)/i.test(content)
                const hasTemperature = /(\d+)\s*(מעלות|°C|°F|degrees)/i.test(content)

                let enhancedContent = content

                if (hasTimeReference) {
                    enhancedContent = enhancedContent.replace(
                        /(\d+)\s*(דקות|שעות|minutes|hours)/gi,
                        '<span class="time-highlight">$1 $2</span>',
                    )
                }

                if (hasTemperature) {
                    enhancedContent = enhancedContent.replace(
                        /(\d+)\s*(מעלות|°C|°F|degrees)/gi,
                        '<span class="temp-highlight">$1 $2</span>',
                    )
                }

                enhancedContent = enhancedContent.replace(
                    /(\d+\/?\d*)\s*(כוס|כפית|כפות|גרם|מ"ל|ק"ג|cup|tsp|tbsp|g|ml|kg)/gi,
                    '<span class="quantity-highlight">$1 $2</span>',
                )

                return `<li class="recipe-item">${enhancedContent}</li>`
            })

            .replace(/<p>(.*?)<\/p>/g, (match, content) => {
                console.log(match);
                
                const isTip = /טיפ|עצה|המלצה|tip|note|hint/i.test(content)

                if (isTip) {
                    return `<p class="recipe-tip"><span class="tip-icon">💡</span> ${content}</p>`
                }

                return `<p class="recipe-paragraph">${content}</p>`
            })

        if (!enhanced.includes("מצרכים") && !enhanced.includes("Ingredients")) {
            const ingredientsHeader = direction === "rtl" ? "מצרכים" : "Ingredients"
            enhanced = enhanced.replace(
                /<ul class="recipe-list">/g,
                `<h2 class="recipe-section ingredients-header"><span class="section-icon">🍲</span> ${ingredientsHeader}</h2><ul class="recipe-list">`,
            )
        } else {
            enhanced = enhanced.replace(
                /<h2 class="recipe-section">(מצרכים|Ingredients)<\/h2>/gi,
                '<h2 class="recipe-section ingredients-header"><span class="section-icon">🍲</span> $1</h2>',
            )
        }

        if (!enhanced.includes("אופן הכנה") && !enhanced.includes("Instructions")) {
            const instructionsHeader = direction === "rtl" ? "אופן הכנה" : "Instructions"
            enhanced = enhanced.replace(
                /<ol class="recipe-steps">/g,
                `<h2 class="recipe-section instructions-header"><span class="section-icon">📝</span> ${instructionsHeader}</h2><ol class="recipe-steps">`,
            )
        } else {
            enhanced = enhanced.replace(
                /<h2 class="recipe-section">(אופן הכנה|Instructions)<\/h2>/gi,
                '<h2 class="recipe-section instructions-header"><span class="section-icon">📝</span> $1</h2>',
            )
        }

        enhanced = enhanced.replace(/<li class="recipe-item">(.*?)<\/li>/g, (match, content, index) => {
            console.log(index);
            
            if (
                enhanced.lastIndexOf('<ol class="recipe-steps">', enhanced.indexOf(match)) >
                enhanced.lastIndexOf("</ol>", enhanced.indexOf(match))
            ) {
                return `<li class="recipe-item"><span class="step-number"></span>${content}</li>`
            }
            return match
        })

        return enhanced
    }

    const onSelect = async () => {
        if (details && user && typeof fileUrl != "string") {
            try {
                const result = await uploadRecipeService(fileUrl, user.id)
                const recipePostModel: RecipePostModel = {
                    title: details[0],
                    degree: Number(details[1]),
                    isPublic: false,
                    path: result,
                    picture: ""
                }

                if (user) {
                    await fetchAddToMyBook(user.id, recipePostModel)
                    onClose()
                }
            } catch (error) {
            }
        }
    }

    const emailRecipe = async (recipe: Recipe) => {
        if (user) {
            const subject = "מתכון טעים במיוחד בשבילך";
            const body = recipeEmailBody(user.fName, recipe.path);
            await dispatch(sendEmail({ to: user.email, subject: subject, body: body }));
        }
    };

    return (
        <div className="file-fullscreen">
            <div className="recipe-viewer">
                <Close onClick={onClose} style={{ cursor: 'pointer' }}/>
                <div className="recipe-header">
                    <div className="recipe-title-area">
                        {details && details[0] && <h1 className="recipe-main-title">{details[0]}</h1>}
                        {recipe && <h1 className="recipe-main-title">{recipe.title}</h1>}

                        {details && details[1] && (
                            <div className="recipe-difficulty">
                                <span>דרגת קושי:</span>
                                <div className="stars-container">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`star ${i < Number(details[1]) ? "active" : ""}`} size={18} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="recipe-actions">
                        {details && (
                            <>
                                <button className="recipe-button back-button" onClick={onClose}>
                                    <ArrowRight size={18} />
                                    <span>חזרה לבחירת מתכון אחר</span>
                                </button>
                                <button className="recipe-button add-button" onClick={onSelect}>
                                    <BookPlus size={18} />
                                    <span>הוספה לספר המתכונים שלי</span>
                                </button>
                            </>
                        )}

                        {recipe && recipe.picture == "" && (
                            <button
                                className={`recipe-button img-button ${isImageUploading ? "disabled" : ""}`}
                                onClick={changeImage}
                                disabled={isImageUploading}
                            >
                                <FaImage size={18} />
                                <span>{isImageUploading ? "מחליף תמונה... " : "החלפת תמונה"}</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="recipe-content-wrapper">
                    <div className="recipe-chef-container">
                        <div className="chef-image-wrapper">
                            {isImageUploading && (
                                <div className="image-loading-overlay">
                                    <div className="loading-spinner"></div>
                                    <p>מחליף תמונה...</p>
                                </div>
                            )}
                            {!recipeImage && <img src={chef} alt="chef" className="chef-image" />}
                            {recipeImage && <img src={recipeImage || "/placeholder.svg"} alt="chef" className="chef-image" />}
                        </div>

                        {recipe && (
                            <div className="recipe-info">
                                <div className="info-item" onClick={() => downloadRecipeFromUrl(recipe)} style={{ cursor: 'pointer' }}>
                                    <Download size={20} className="info-icon" />
                                    <span>הורדת המתכון</span>
                                </div>
                                <div className="info-item" onClick={() => emailRecipe(recipe)} style={{ cursor: 'pointer' }}>
                                    <Mail size={20} className="info-icon" />
                                    <span>שליחה למייל</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="recipe-content">
                        {isLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>טוען את המתכון...</p>
                            </div>
                        ) : (
                            <div
                                className={`recipe-document ${direction === "rtl" ? "rtl-content" : "ltr-content"}`}
                                style={{ direction }}
                                dangerouslySetInnerHTML={{ __html: htmlContent }}
                            />
                        )}
                    </div>
                </div>

                <div className="recipe-footer">
                    <div className="footer-decoration">
                        <span className="decoration-dot"></span>
                        <span className="decoration-line"></span>
                        <ChefHat size={24} className="footer-icon" />
                        <span className="decoration-line"></span>
                        <span className="decoration-dot"></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default File2
