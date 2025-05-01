// import React, { useState } from 'react';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     Button,
//     Grid,
//     Box,
//     Typography
// } from '@mui/material';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// interface ProfilePictureSelectorProps {
//     onSelect: (file: File | null) => void;
//     onClose: () => void;
// }

// const ProfilePicture: React.FC<ProfilePictureSelectorProps> = ({ onSelect, onClose }) => {
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);

//     const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         if (file) {
//             const imageUrl = URL.createObjectURL(file);
//             setSelectedImage(imageUrl);
//             onSelect(file);
//             onClose();
//         }
//     };

//     const handleDefaultImageSelect = async (imageUrl: string) => {
//         try {
//             const response = await fetch(imageUrl);
//             const blob = await response.blob();
//             const fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
//             const file = new File([blob], fileName, { type: 'image/jpeg' });
//             console.log(file);
//             setSelectedImage(imageUrl);
//             onSelect(file);
//             onClose();
//         } catch (error) {
//             console.error('Error fetching the image:', error);
//         }
//     };

//     const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//         event.preventDefault();
//         const file = event.dataTransfer.files[0];
//         if (file && file.type.startsWith('image/')) {
//             const imageUrl = URL.createObjectURL(file);
//             setSelectedImage(imageUrl);
//             onSelect(file);
//             onClose();
//         }
//     };

//     const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//         event.preventDefault();
//     };

//     return (
//         <Dialog open onClose={onClose} fullWidth maxWidth="sm">
//             <DialogTitle style={{ backgroundColor: '#222', color: 'white', textAlign: 'center', margin: 0 }}>
//                 <div>בחירת תמונת פרופיל</div>
//             </DialogTitle>
//             <DialogContent
//                 sx={{ backgroundColor: '#222', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
//             >
//                 <Box
//                     onDrop={handleDrop}
//                     onDragOver={handleDragOver}
//                     sx={{
//                         border: '2px dashed white',
//                         borderRadius: '5px',
//                         paddingTop: '10px',
//                         paddingBottom: '10px',
//                         textAlign: 'center',
//                         width: '250px',
//                         height: '80px',
//                         display: 'flex',
//                         flexDirection: 'column',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         backgroundColor: '#999',
//                         margin: 0,
//                         marginBottom: 2
//                     }}
//                 >
//                     <CloudUploadIcon sx={{ fontSize: 50, color: "#FFA726" }} />
//                     <Typography variant="body1" color="white" sx={{ margin: 0, padding: 0, fontSize: '20px' }}>
//                         גרור לכאן
//                     </Typography>
//                 </Box>

//                 <Typography variant="h6" sx={{ margin: '5px 0', color: 'white', fontSize: '25px' }}>
//                     בחר תמונה
//                 </Typography>
//                 <Grid container spacing={1} justifyContent="center" sx={{ marginTop: '10px' }}>
//                     <Grid item>
//                     </Grid>
//                     <Grid item>
//                         <Button onClick={() => handleDefaultImageSelect('../../images/profiles/2.jpg')}>
//                             <img src='../../images/profiles/2.jpg' alt="Default 2" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
//                         </Button>
//                     </Grid>
//                     <Grid item>
//                         <Button onClick={() => handleDefaultImageSelect('../../images/profiles/1.jpg')}>
//                             <img src='../../images/profiles/1.jpg' alt="Default 1" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
//                         </Button>
//                     </Grid>
//                     <Grid item>
//                         <Button onClick={() => handleDefaultImageSelect('../../images/profiles/3.jpg')}>
//                             <img src='../../images/profiles/3.jpg' alt="Default 3" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
//                         </Button>
//                     </Grid>
//                     <Box sx={{ marginTop: '2%', marginLeft: '10px', width: 'auto', textAlign: 'center' }}>
//                         <input
//                             accept="image/*"
//                             style={{ display: 'none' }}
//                             id="icon-button-file"
//                             type="file"
//                             onChange={handleImageChange}
//                         />
//                         <label htmlFor="icon-button-file">
//                             <Button
//                                 variant="contained"
//                                 component="span"
//                                 style={{ backgroundColor: '#999', color: 'white', borderRadius: '50%', width: '83px', height: '83px', fontSize: '30px' }}
//                             >
//                                 +
//                             </Button>
//                         </label>
//                     </Box>
//                 </Grid>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default ProfilePicture;

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, Plus, Check } from "lucide-react"
import "../styles/ProfilePicture.css"

interface ProfilePictureSelectorProps {
  onSelect: (file: File | null) => void
  onClose: () => void
}

const ProfilePicture = ({ onSelect, onClose }: ProfilePictureSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const defaultImages = ["../../images/profiles/1.jpg", "../../images/profiles/2.jpg", "../../images/profiles/3.jpg"]

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)

      // Simulate loading
      setTimeout(() => {
        setIsUploading(false)
        onSelect(file)
        setTimeout(() => onClose(), 500)
      }, 1000)
    }
  }

  const handleDefaultImageSelect = async (imageUrl: string, index: number) => {
    setSelectedIndex(index)
    setIsUploading(true)

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1)
      const file = new File([blob], fileName, { type: "image/jpeg" })

      setSelectedImage(imageUrl)

      // Simulate loading
      setTimeout(() => {
        setIsUploading(false)
        onSelect(file)
        setTimeout(() => onClose(), 500)
      }, 1000)
    } catch (error) {
      console.error("Error fetching the image:", error)
      setIsUploading(false)
    }
  }

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]

    if (file && file.type.startsWith("image/")) {
      setIsUploading(true)
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)

      // Simulate loading
      setTimeout(() => {
        setIsUploading(false)
        onSelect(file)
        setTimeout(() => onClose(), 500)
      }, 1000)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } },
  }

  const dropzoneVariants = {
    default: { scale: 1 },
    dragging: { scale: 1.05, boxShadow: "0 0 25px rgba(255, 149, 0, 0.5)" },
  }

  return (
    <AnimatePresence>
      <motion.div
        className="profile-selector-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="profile-selector-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="profile-selector-header">
            <h2 className="profile-selector-title">בחירת תמונת פרופיל</h2>
            <motion.button
              className="profile-selector-close"
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          <div className="profile-selector-content">
            <motion.div
              className={`profile-selector-dropzone ${isDragging ? "dragging" : ""}`}
              variants={dropzoneVariants}
              animate={isDragging ? "dragging" : "default"}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className="profile-selector-upload-icon" size={40} />
              <p className="profile-selector-dropzone-text">גרור תמונה לכאן</p>
              <span className="profile-selector-dropzone-subtext">או לחץ לבחירה</span>
              <input
                type="file"
                ref={fileInputRef}
                className="profile-selector-file-input"
                accept="image/*"
                onChange={handleImageChange}
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>

            <div className="profile-selector-divider">
              <span className="profile-selector-divider-text">או בחר מהגלריה</span>
            </div>

            <div className="profile-selector-gallery">
              {defaultImages.map((image, index) => (
                <motion.div
                  key={index}
                  className={`profile-selector-image-container ${selectedIndex === index ? "selected" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDefaultImageSelect(image, index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`תמונת פרופיל ${index + 1}`}
                    className="profile-selector-image"
                  />
                  {selectedIndex === index && (
                    <div className="profile-selector-image-selected">
                      <Check size={24} />
                    </div>
                  )}
                </motion.div>
              ))}
              <motion.div
                className="profile-selector-upload-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus size={30} />
              </motion.div>
            </div>
          </div>

          {isUploading && (
            <div className="profile-selector-loading">
              <div className="profile-selector-spinner"></div>
              <p>מעלה תמונה...</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ProfilePicture
