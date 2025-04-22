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
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
};
 
// export const emailRecipeWithUrl = (url: string, email: string) => {
    // const subject = "קישור למתכון";
    // const body = `הנה הקישור למתכון שלך: ${url}`;
    // const result2 = await dispatch(sendEmail({ to: user.email, subject, body }));
    // if (result2.meta.requestStatus === 'fulfilled') {
    //     console.log("mail sent!");
    // }
    // else {
    //     console.log("mail not sent!");
    // }

// window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
// }
