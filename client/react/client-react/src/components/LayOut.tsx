import { Outlet } from "react-router";
import Auth from "./Auth";

const LayOut = () => {
      
    return (<>
        <Auth />
        <div style={{ marginTop: '20vh', marginLeft: '10vw', marginRight: '20vw' }}>
            <Outlet />
        </div>
    </>
    );
}

export default LayOut;