import { Recipe } from "../models/RecipeType";

export const downloadRecipeFromUrl = (recipe: Recipe) => {
    fetch(recipe.path)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = recipe.title+'.docx';
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(() => {
        });
};
 