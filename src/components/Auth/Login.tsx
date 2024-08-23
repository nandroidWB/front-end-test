// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { BrokerClient } from "../../client/http/Broker";


interface LoginPageProps {
    navigateTo: (page: "catalog") => void;
}

export const Login: React.FC<LoginPageProps> = ({ navigateTo }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            const client = new BrokerClient();
            const response = await client.loginUser(username, password);
            if (response) {
                navigateTo("catalog");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("An unexpected error occurred");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p>{error}</p>}
        </div>
    );
};
