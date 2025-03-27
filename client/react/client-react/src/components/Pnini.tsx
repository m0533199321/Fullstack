// const AddSong = () => {
//     const [open, setOpen] = useState(false);
//     const [progress, setProgress] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const dispatch = useDispatch();
//     const userId = useSelector((state: StoreType) => state.user.user.id);

//     const uploadToS3 = async (file: File): Promise<string | null> => {
//         try {
//             setLoading(true);
//             setProgress(0);

//             const res = await api.get("Song/upload-url", {
//                 params: { fileName: file.name, contentType: file.type },
//             });

//             const presignedUrl = res.data.url;
//             await axios.put(presignedUrl, file, {
//                 headers: { "Content-Type": file.type },
//                 onUploadProgress: (progressEvent) => {
//                     const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
//                     setProgress(percent);
//                 },
//             });

//             setLoading(false);
//             return presignedUrl.split("?")[0];
//         } catch (error) {
//             console.error("שגיאה בהעלאת הקובץ:", error);
//             setLoading(false);
//             return null;
//         }
//     };

//     const handleFileUpload = async (file: File) => {
//         if (!file) return;

//         try {
//             // קריאת מטא נתונים
//             const metadata = await mm.parseBlob(file);
//             console.log("Metadata:", metadata);

//             const genre = metadata.common.genre?.[0] || "לא ידוע";
//             const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "");

//             // let coverImageUrl = 'https://pninimusic.s3.us-east-1.amazonaws.com/images/music2.jpg';
//             // if (metadata.common.picture && metadata.common.picture.length > 0) {
//             //   const cover = metadata.common.picture[0];
//             //   const coverBlob = new Blob([cover.data], { type: cover.format });

//             //   // העלאה ל-S3
//             //   const imageRes = await api.get('User/upload-url', {
//             //     params: {
//             //       fileName: `${file.name}_cover.${cover.format.split('/')[1] || 'jpg'}`,
//             //       contentType: coverBlob.type
//             //     }
//             //   });

//             //   const coverPresignedUrl = imageRes.data.url;

//             //   await axios.put(coverPresignedUrl, coverBlob, {
//             //     headers: {
//             //       'Content-Type': coverBlob.type,
//             //     }
//             //   });

//             //   console.log('תמונת הקאבר הועלתה בהצלחה');
//             //   coverImageUrl = coverPresignedUrl.split("?")[0];
//             // }
//             // console.log(coverImageUrl);
//             const uploadedUrl = await uploadToS3(file);
//             if (!uploadedUrl) return;

//             const newSong = {
//                 title,
//                 gener: genre,
//                 isPublic: false,
//                 pathSong: uploadedUrl,
//                 userId
//             };

//             await addSong(newSong);
//             dispatch(loadUser(userId) as any);
//             setOpen(false);
//         } catch (error) {
//             console.error("שגיאה בקריאת מטא נתונים:", error);
//         }
//     };
//     return (
//         <Box>
//             <Button
//                 variant="contained"
//                 endIcon={<FileUploadIcon />}
//                 onClick={() => setOpen(true)}
//                 sx={{
//                     backgroundColor: "#FFA726",
//                     fontWeight: "bold",
//                     borderRadius: "5px",
//                     gap: "8px"
//                 }}
//             >
//                 הוסף שיר
//             </Button>

//             <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "16px" } }} disableEnforceFocus disableRestoreFocus>
//                 <DialogTitle align="center" sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "#fff", backgroundColor: "#1E1E1E", borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }}>
//                     העלאת שיר חדש
//                 </DialogTitle>
//                 <DialogContent sx={{ backgroundColor: "#1E1E1E", textAlign: "center", color: "white", borderBottomLeftRadius: "16px", borderBottomRightRadius: "16px" }}>
//                     <Box
//                         sx={{
//                             border: "2px dashed gray",
//                             borderRadius: "12px",
//                             padding: 4,
//                             textAlign: "center",
//                             cursor: "pointer",
//                             backgroundColor: "#252525",
//                             "&:hover": { borderColor: "#FFA726", backgroundColor: "#2E2E2E" },
//                             transition: "0.3s",
//                         }}
//                     >
//                         <CloudUploadIcon sx={{ fontSize: 50, color: "#FFA726" }} />
//                         <Typography variant="body1" sx={{ mt: 1, fontSize: "0.9rem", color: "#ccc" }}>
//                             גרור ושחרר כאן קובץ או לחץ לבחירה
//                         </Typography>
//                         <Button
//                             variant="contained"
//                             component="label"
//                             sx={{ mt: 2, backgroundColor: "#FFA726", "&:hover": { backgroundColor: "#FF9800" } }}
//                         >
//                             בחר קובץ
//                             <input type="file" hidden onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
//                         </Button>
//                     </Box>

//                     {loading && (
//                         <Box sx={{ width: "100%", marginTop: "15px" }}>
//                             <LinearProgress
//                                 variant="determinate"
//                                 value={progress}
//                                 sx={{
//                                     height: "8px",
//                                     borderRadius: "4px",
//                                     backgroundColor: "#333",
//                                     "& .MuiLinearProgress-bar": {
//                                         backgroundColor: "#FFA500",
//                                     },
//                                 }}
//                             />
//                             <Typography sx={{ marginTop: "5px", fontSize: "14px", color: "#FFA726" }}>{progress}%</Typography>
//                         </Box>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </Box>
//     );
// };

// export default AddSong;