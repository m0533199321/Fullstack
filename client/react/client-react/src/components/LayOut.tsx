import { Outlet } from "react-router";
import Login from "./Auth";

const LayOut = () => {
      
    return (<>
        <Login />
        <div style={{ marginTop: '20vh', marginLeft: '10vw', marginRight: '20vw' }}>
            <Outlet />
        </div>
    </>
    );
}

export default LayOut;