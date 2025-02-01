import React from "react";
import RoutesApp from "./routes";
import AuthProvider from "./contexts/auth";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesApp />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
