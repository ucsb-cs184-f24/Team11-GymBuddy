import { Slot } from "expo-router";
import React from "react";
import NavBar from "./NavBar";
const AppLayout = () => {
  return (
    <>
      <Slot />
      <NavBar />
    </>
  );
};

export default AppLayout;