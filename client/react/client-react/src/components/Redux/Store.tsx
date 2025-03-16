import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./AuthSlice";
// import ProfileSlice from "./ProfileSlice";
// import PublicRecipesSlice from "./PublicRecipesSlice";
// import uploadSlice from "./P";
// import PrivateRecipesSlice from "./PrivateRecipesSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";


const Store = configureStore({
    reducer: {
        auth: AuthSlice.reducer,
        // profile: ProfileSlice.reducer,
        // publicRecipes: PublicRecipesSlice.reducer,
        // privateRecipes: PrivateRecipesSlice.reducer,
        // p: uploadSlice.reducer
    }
});

export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof Store.getState>> = useSelector;
export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store