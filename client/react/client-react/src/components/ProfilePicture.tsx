import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Grid,
    Box,
    Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface ProfilePictureSelectorProps {
    onSelect: (file: File | null) => void;
    onClose: () => void;
}

const ProfilePicture: React.FC<ProfilePictureSelectorProps> = ({ onSelect, onClose }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            onSelect(file);
            onClose();
        }
    };

    const handleDefaultImageSelect = async (imageUrl: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            console.log(file);
            setSelectedImage(imageUrl);
            onSelect(file);
            onClose();
        } catch (error) {
            console.error('Error fetching the image:', error);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            onSelect(file);
            onClose();
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle style={{ backgroundColor: '#222', color: 'white', textAlign: 'center', margin: 0 }}>
                <div>בחירת תמונת פרופיל</div>
            </DialogTitle>
            <DialogContent
                sx={{ backgroundColor: '#222', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                        border: '2px dashed white',
                        borderRadius: '5px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        textAlign: 'center',
                        width: '250px',
                        height: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#999',
                        margin: 0,
                        marginBottom: 2
                    }}
                >
                    <CloudUploadIcon sx={{ fontSize: 50, color: "#FFA726" }} />
                    <Typography variant="body1" color="white" sx={{ margin: 0, padding: 0, fontSize: '20px' }}>
                        גרור לכאן
                    </Typography>
                </Box>

                <Typography variant="h6" sx={{ margin: '5px 0', color: 'white', fontSize: '25px' }}>
                    בחר תמונה
                </Typography>
                <Grid container spacing={1} justifyContent="center" sx={{ marginTop: '10px' }}>
                    <Grid item>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => handleDefaultImageSelect('../../images/profiles/2.jpg')}>
                            <img src='../../images/profiles/2.jpg' alt="Default 2" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => handleDefaultImageSelect('../../images/profiles/1.jpg')}>
                            <img src='../../images/profiles/1.jpg' alt="Default 1" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={() => handleDefaultImageSelect('../../images/profiles/3.jpg')}>
                            <img src='../../images/profiles/3.jpg' alt="Default 3" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                        </Button>
                    </Grid>
                    <Box sx={{ marginTop: '2%', marginLeft: '10px', width: 'auto', textAlign: 'center' }}>
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
                                style={{ backgroundColor: '#999', color: 'white', borderRadius: '50%', width: '83px', height: '83px', fontSize: '30px' }}
                            >
                                +
                            </Button>
                        </label>
                    </Box>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default ProfilePicture;
