import { Outlet } from "react-router";
import Header from "./Header";

const LayOut = () => {
      
    return (<>
       <Header />
      <div style={{ marginTop: '10vh', marginLeft: '10vw', marginRight: '20vw' }}>
        <Outlet />
      </div>
    </>
    );
}

export default LayOut;