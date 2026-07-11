import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUser } from "../../utils/localStorage";

import authService from "../../services/authService";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import "./Login.css";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try{

            const response = await authService.login(email,password);

            if (response.success) {
                saveUser(response);

                if (response.role === "Waiter") {
                    navigate("/waiter");
                } else if (response.role === "Kitchen") {
                    navigate("/kitchen");
                } else if (response.role === "Cashier") {
                    navigate("/cashier");
                } else {
                    navigate("/admin");
                }
            }

        }
        catch(error){

            console.error(error);

        }

    };

    return (
        <div className="login-page">
            <Card>
                <div className="login-header">
                    <div className="login-logo">🍽️</div>
                    <h1>DineFlow</h1>
                    <p>Restaurant Management System</p>
                </div>

                <div className="login-title">
                    <h2>Welcome Back</h2>
                    <p>Login to continue</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button text="Login" type="submit" />
                </form>
            </Card>
        </div>
    );
}

export default Login;