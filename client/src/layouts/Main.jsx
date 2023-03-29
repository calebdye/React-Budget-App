// rrd imports
import { useContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

// assets
import wave from "../assets/wave.svg";

// components
import Nav from "../components/Nav";
import { UserContext } from "../components/UserContext";


//  helper functions
//import { fetchData } from "../helpers"

// loader
// export function mainLoader() {
//   const userName = fetchData("userName");
//   return { userName }
// }

const Main = () => {

  const {ready,user,setUser} = useContext(UserContext);

  return (
    <div className="layout">
      <Nav user={user} />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  )
}
export default Main