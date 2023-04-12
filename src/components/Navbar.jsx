import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav>
        <div className="d-flex justify-content-between w-25 mx-auto">
          <div className="link">
            <NavLink to="/">Home</NavLink>
          </div>
          <div className="link">
            <NavLink to="/iframe">iframe</NavLink>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
