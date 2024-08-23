import React, { useState } from "react";
import { Register } from "./components/Auth/Register";
import { Login } from "./components/Auth/Login";
import Catalog from "./components/Catalog/Catalog";
import './App.css'

const App: React.FC = () => {
    const [page, setPage] = useState<"register" | "login" | "catalog">("register");

    const navigateTo = (nextPage: "register" | "login" | "catalog") => {
        setPage(nextPage);
    };

    return (
      < >
        
            {page === "register" && <Register navigateTo={navigateTo} />}
            {page === "login" && <Login navigateTo={navigateTo} />}
            {page === "catalog" && <Catalog />}
        
      </>
    );
};

export default App;
