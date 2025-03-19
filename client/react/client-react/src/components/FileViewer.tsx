import React from 'react';
import { fetchAddToMyBook } from './Services/RecipeService';
import { RecipePostModel } from '../models/RecipeType';
import { useAppSelector } from './Redux/Store';

interface FileViewerProps {
    fileUrl: string;
    onClose: () => void;
    details: string[];
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, onClose, details }) => {
    const user = useAppSelector((state) => state.auth.user);
    console.log(details);
    const onSelect = async () => {
        console.log(details);
        const recipePostModel: RecipePostModel = {
            title: details[0],
            degree: Number(details[2]),
            path: fileUrl,
            category: Number(details[1]),
        }
        console.log(recipePostModel);      
        if (user) {
            await fetchAddToMyBook(user.id, recipePostModel);
            console.log("הוספה לספר המתכונים שלי");
        }
    }

    const styles = {
        container: {
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            display: 'flex' as 'flex',
            flexDirection: 'column' as 'column',
            alignItems: 'flex-end',
        } as React.CSSProperties,
        buttonContainer: {
            display: 'flex' as 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            marginBottom: '20px',
        } as React.CSSProperties,
        button: {
            backgroundColor: '#000000',
            color: '#FFA500',
            border: '1px solid white',
            borderRadius: '4px',
            padding: '10px 15px',
            cursor: 'pointer',
            margin: '0 5px',
            transition: 'transform 0.2s',
        } as React.CSSProperties,
        buttonHover: {
            transform: 'translateY(-1px)',
        },
        iframe: {
            width: '100%',
            height: '80vh',
            border: 'none',
            backgroundColor: 'white',
            borderRadius: '4px',
            overflow: 'auto'
        } as React.CSSProperties
    };

    return (
        <div style={styles.container}>
            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    onClick={onClose}
                >
                    חזרה לבחירת מתכון אחר
                </button>
                <button
                    style={styles.button}
                    onMouseEnter={(e) => e.currentTarget.style.transform = styles.buttonHover.transform}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    onClick={onSelect}
                >
                    הוספה לספר המתכונים שלי
                </button>
            </div>
            <iframe
                src={fileUrl}
                style={styles.iframe}
                title="File Viewer"
                scrolling="yes"
            />
        </div>
    );
};

export default FileViewer;
