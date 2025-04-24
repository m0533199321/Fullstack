import { Sort } from "@mui/icons-material";
import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import { Recipe } from "../models/RecipeType";

export const sortRecipes = (recipes: Recipe[], criterion: string) => {
    console.log(recipes);

    switch (criterion) {
        case 'degree':
            return [...recipes].sort((a, b) => a.degree - b.degree);
        case 'name':
            return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
        case 'date':
            return [...recipes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        default:
            return recipes;
    }
};

const RecipeSortBy = ({ anchorEl, setAnchorEl, handleSortChange }: { anchorEl: HTMLElement | null, setAnchorEl: (value: React.SetStateAction<HTMLElement | null>) => void, handleSortChange: (criterion: string) => void }) => {
    return (<>
            <Tooltip title="מיון לפי">
                <Button
                    variant="outlined"
                    style={{
                        backgroundColor: 'black',
                        color: 'rgb(251, 222, 0)',
                        borderColor: 'orange',
                        maxHeight: '5.25vh',
                        marginLeft: '3vw',
                        marginRight: '1.5vw',
                        width: '9vw',
                        borderRadius: '7px'
                    }}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    מיון לפי
                    <p style={{ marginLeft: '1.5vw' }}></p>
                    <Sort style={{ marginLeft: '8px', color: 'orange' }} />
                </Button>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    style: {
                        backgroundColor: 'black',
                        color: 'orange',
                        border: '1px solid orange',
                        width: '8vw',
                        maxWidth: '12vw'
                    },
                }}
            >
                <MenuItem onClick={() => handleSortChange('degree')}>דרגת קושי</MenuItem>
                <MenuItem onClick={() => handleSortChange('name')}>שם</MenuItem>
                <MenuItem onClick={() => handleSortChange('date')}>תאריך יצירה</MenuItem>
            </Menu>
    </>)
}
export default RecipeSortBy;