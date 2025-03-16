import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
import ProfileSlice from "./ProfileSlice";
import PublicRecipesSlice from "./PublicRecipesSlice";
import uploadSlice from "./P";
import PrivateRecipesSlice from "./PrivateRecipesSlice";


const Store = configureStore({
    reducer: {
        auth: AuthSlice.reducer,
        profile: ProfileSlice.reducer,
        publicRecipes: PublicRecipesSlice.reducer,
        pruvateRecipes: PrivateRecipesSlice.reducer,
        p: uploadSlice.reducer
    }
});

export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store