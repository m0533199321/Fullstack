// import React, { useState } from 'react';

// const ProfilePictureSelector = () => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [showImages, setShowImages] = useState(false); // מצב לתצוגת התמונות

//   const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setSelectedImage(imageUrl);
//     }
//   };

//   const handleDefaultImageSelect = (imageUrl: string) => {
//     setSelectedImage(imageUrl);
//   };

//   const handleShowImages = () => {
//     setShowImages(true); // מציג את התמונות
//   };

//   return (
//     <div>
//       <h2>בחר תמונת פרופיל</h2>
//       <button onClick={handleShowImages}>הצג תמונות</button>
//       {showImages && (
//         <div>
//           <button onClick={() => handleDefaultImageSelect('url_to_default_image_1')}>
//             תמונה 1
//           </button>
//           <button onClick={() => handleDefaultImageSelect('url_to_default_image_2')}>
//             תמונה 2
//           </button>
//           <input type="file" accept="image/*" onChange={handleImageChange} />
//         </div>
//       )}
//       {selectedImage && <img src={selectedImage} alt="Profile Preview" style={{ width: '100px', height: '100px' }} />}
//     </div>
//   );
// };

// export default ProfilePictureSelector;


import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

interface ProfilePictureSelectorProps {
    onSelect: (file: File | null) => void;
    onClose: () => void;
}

const ProfilePicture: React.FC<ProfilePictureSelectorProps> = ({ onSelect, onClose }) => {

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showImages, setShowImages] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            onSelect(file);
            onClose();
        }
    };

    const handleDefaultImageSelect = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        onSelect(new File([], imageUrl));
        onClose();
    };

    const handleShowImages = () => {
        setShowImages(!showImages);
    };

    return (
        <Dialog open onClose={onClose}>
            <DialogTitle>
              <div>בחירת תמונת פרופיל</div>
            </DialogTitle>
            <DialogContent>
                <Box textAlign="center">
                    <Button 
                        variant="outlined" 
                        style={{ width: '200px', color: 'black', borderColor: 'black', backgroundColor: 'white'  }} 
                        onClick={handleShowImages} 
                        startIcon={<PhotoCamera />}
                    >
                        {showImages ? 'הסתר תמונות קיימות' : 'הצג תמונות קיימות'}
                    </Button>
                </Box>
                {showImages && (
                    <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
                        <Grid item>
                            <Button onClick={() => handleDefaultImageSelect('../../images/profiles/1.jpg')}>
                                <img src='../../images/profiles/1.jpg' alt="Default 1" style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={() => handleDefaultImageSelect('../../images/profiles/2.jpg')}>
                                <img src='../../images/profiles/2.jpg' alt="Default 2" style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
                            </Button>
                        </Grid>
                    </Grid>
                )}
                <Box textAlign="center" sx={{ marginTop: 2 }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="icon-button-file"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="icon-button-file">
                        <Button 
                            variant="contained" 
                            component="span" 
                            style={{ width: '200px', backgroundColor: 'black', color: 'white' }} 
                            startIcon={<PhotoCamera />}
                        >
                            בחר מהמחשב שלי
                        </Button>
                    </label>
                </Box>
                {selectedImage && (
                    <Box textAlign="center" sx={{ marginTop: 2 }}>
                        <img src={selectedImage} alt="Profile Preview" style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">סגור</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProfilePicture;
