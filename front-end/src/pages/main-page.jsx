import React from "react";
import { Outlet } from "react-router-dom";

import TopMenu from "../components/top-menu-component";




export default function MainPage(){

    return (
        <div>
            <TopMenu ></TopMenu>
            {/* <SideMenu ></SideMenu> */}
            <Outlet />
        </div>
    )
}