import '../styles/Categories.css';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'ארוחות בוקר', english: 'Breakfast', image: '../../images/categories/BreakFast.jpg' },
    { name: 'מנות פתיחה', english: 'Starters', image: '../../images/categories/starters.jpg' },
    { name: 'מנות עיקריות', english: 'Main_dishes', image: '../../images/categories/Main_dishes.jpg' },
    { name: 'תוספות', english: 'Extras', image: '../../images/categories/Extras.jpg' },
    { name: 'מרקים', english: 'Soups', image: '../../images/categories/Soups.jpg' },
    { name: 'סלטים', english: 'Salads', image: '../../images/categories/Salads.jpg' },
    { name: 'מאפים ולחמים', english: 'Pastries_breads', image: '../../images/categories/Pastries_breads.jpg' },
    { name: 'קינוחים', english: 'Desserts', image: '../../images/categories/desserts.jpg' },
    { name: 'משקאות', english: 'Drinks', image: '../../images/categories/Drinks.jpg' }
];

const Categories = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/categories/${categoryName}`);
    };

    return (
        <div className="categories-container">
            {categories.map((category) => (
                <div
                    className="category-card"
                    key={category.english}
                    onClick={() => handleCategoryClick(category.english)}
                >
                    <div className="category-image-container">
                        <img src={category.image} alt={category.name} className="category-image" />
                        <div className="category-overlay">
                            <h3>{category.name}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Categories;





// import { useState } from "react";
// import { Card, CardContent } from '@mui/material';
// import { motion } from "framer-motion";

// const categories = [
//   { name: "מנות פתיחה", key: "Starters", image: "https://netfree.link/example/starters.jpg", description: "מנות קטנות ומעוררות תיאבון להתחלה מושלמת." },
//   { name: "מנות עיקריות", key: "Main_dishes", image: "https://netfree.link/example/main_dishes.jpg", description: "מנות משביעות ומלאות בטעמים למנה המרכזית." },
//   { name: "תוספות", key: "Extras", image: "https://netfree.link/example/extras.jpg", description: "תוספות מושלמות להשלמת הארוחה." },
//   { name: "מרקים", key: "Soups", image: "https://netfree.link/example/soups.jpg", description: "מרקים חמים ומנחמים לכל עונה." },
//   { name: "סלטים", key: "Salads", image: "https://netfree.link/example/salads.jpg", description: "שילובים מרעננים של ירקות, פירות ורטבים." },
//   { name: "מאפים ולחמים", key: "Pastries_breads", image: "https://netfree.link/example/pastries_breads.jpg", description: "מאפים טריים ולחמים חמים מהתנור." },
//   { name: "קינוחים", key: "Desserts", image: "https://netfree.link/example/desserts.jpg", description: "מגוון מתוקים לסיום מושלם של הארוחה." },
//   { name: "משקאות", key: "Drinks", image: "https://netfree.link/example/drinks.jpg", description: "משקאות קרים וחמים לכל מצב רוח." },
// ];

// export default function CategoriesGrid() {
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
//       {categories.map((category) => (
//         <CategoryCard key={category.key} category={category} />
//       ))}
//     </div>
//   );
// }

// function CategoryCard({ category }) {
//   const [hovered, setHovered] = useState(false);

//   return (
//     <Card
//       className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//     >
//       <div className="relative w-full h-48">
//         <img
//           src={category.image}
//           alt={category.name}
//           className="w-full h-full object-cover"
//         />
//         {hovered && (
//           <motion.div
//             className="absolute inset-0 border-2 border-white"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           />
//         )}
//       </div>
//       <CardContent className="p-4 text-center">
//         <h3 className="text-lg font-semibold">{category.name}</h3>
//         <p className="text-sm text-gray-600">{category.description}</p>
//       </CardContent>
//     </Card>
//   );
// }
