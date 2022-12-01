import "./MainNavigation.css"; 
import React, { useState } from "react";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer"; 
import Backdrop from "../UIElement/Backdrop";
const MainNavigation = (props) => { 
  const [drowerIsOpened , setDrowerIsOpened] = useState(false) 
  const openDrawer = ()=>{ 
     setDrowerIsOpened(true)
  } 
  const closeDrawer = ()=>{ 
     setDrowerIsOpened(false) ; 
  }
  return (
    <React.Fragment> 
      {drowerIsOpened && <Backdrop onClick={closeDrawer} />}
     <SideDrawer show={drowerIsOpened} onClick={closeDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={openDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h2 className="main-navigation__title">Be Safe</h2>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};
export default MainNavigation;
