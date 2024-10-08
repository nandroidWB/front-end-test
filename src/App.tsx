import React, { useState } from "react";
import { Register } from "./components/Auth/Register";
import { Login } from "./components/Auth/Login";
import Catalog from "./components/Catalog/Catalog";
import Dashboard from './components/Dashboard/Dashboard';
import './App.css'

const App: React.FC = () => {
    const [page, setPage] = useState<string>("register");

    const navigateTo = (nextPage: string) => {
        setPage(nextPage);
    };

    return (
      < >
        
            {page === "register" && <Register navigateTo={navigateTo} />}
            {page === "login" && <Login navigateTo={navigateTo} />}
            {page === "catalog" && <Dashboard children={<Catalog />} navigateTo={navigateTo}/>}
            {page === "dashboard" && <Dashboard navigateTo={navigateTo}/>}
        
      </>
    );
};

export default App;
