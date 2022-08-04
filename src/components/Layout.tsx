import React, {FC} from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout: FC = () => {
  return (
    <>
      <Navbar />
      <div className='ml-20'>
        <Outlet />
      </div>
    </>
  );
};
export default Layout;
