import React, { FC } from "react";
import { NavLink } from "react-router-dom";

const Navbar: FC = () => {
  return (
    <div className='fixed transition-all left-0 top-0 w-20 h-screen bg-stone-300 flex flex-col items-center justify-around'>
      <NavLink to='add'>
        <div className="text-5xl hover:text-stone-600">
          <i className='plus icon'></i>
        </div>
      </NavLink>
      <NavLink to='/'>
        <div className="text-5xl hover:text-stone-600">
          <i className='calendar alternate icon'></i>
        </div>
      </NavLink>
      <NavLink to='list'>
        <div className="text-5xl hover:text-stone-600">
          <i className='list alternate icon'></i>
        </div>
      </NavLink>
    </div>
  );
};

export default Navbar;
