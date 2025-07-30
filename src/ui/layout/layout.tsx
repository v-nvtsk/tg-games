import React from "react";
import { GameHeader } from "../components/game-header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <GameHeader />
      {children}
    </>
  );
};
