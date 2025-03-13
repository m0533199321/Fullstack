import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const images = [
  "../../Images/back1.jpg",
  "../../Images/back2.jpg"
];

export default function Images() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // שינוי תמונה כל 3 שניות

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
      <motion.img
        key={index}
        src={images[index]}
        alt="food"
        className="absolute w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </div>
  );
}
