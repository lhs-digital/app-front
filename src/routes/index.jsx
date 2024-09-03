import { Fragment, useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import RecoverPassword from "../pages/RecoverPassword";
import PasswordUpdate from "../pages/PasswordUpdate";
import { Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Users from "../pages/Users";
import FirstAccess from "../pages/FirstAccess";

const Private = ({ Item }) => {
    const signed = localStorage.getItem("token");

    return signed ? <Item /> : <Navigate to="/" />;
};

const Public = ({ Item }) => {
    const signed = localStorage.getItem("token");

    return signed ? <Navigate to="/dashboard-admin" /> : <Item />;
};

const AuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const intervalId = setInterval(() => {
            const rememberMe = localStorage.getItem("rememberMe");
            const token = localStorage.getItem("token");
            const expiresAt = localStorage.getItem("expiresAt");

            if (rememberMe && token) {
                const currentTime = new Date().getTime();

                if (expiresAt && currentTime > parseInt(expiresAt, 10)) {
                    console.log("Token expired. Removing token.");
                    localStorage.removeItem("token");
                    localStorage.removeItem("rememberMe");
                    localStorage.removeItem("expiresAt");
                    navigate('/');
                }
            }
        },1 * 24 * 60 * 60 * 1000); // Verifica a cada um dia

        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, [navigate]);

    return null;
};

const RoutesApp = () => {
    return (
        <BrowserRouter>
            <AuthCheck />
            <Fragment>
                <Routes>
                    <Route path="/" element={<Public Item={SignIn} />} />
                    <Route path="/recover-password" element={<Public Item={RecoverPassword} />} />
                    <Route path="/password-update/:token" element={<Public Item={PasswordUpdate} />} />
                    <Route path="/first-access/:token" element={<Public Item={FirstAccess} />} />
                    <Route exact path="/dashboard-admin" element={<Private Item={Home} />} />
                    <Route path="*" element={<SignIn />} />

                    {/* SuperAdmin */}
                    <Route path="/users" element={<Private Item={Users} />} />
                </Routes>
            </Fragment>
            <ToastContainer
                position="bottom-right"
            />
        </BrowserRouter>
    );
}

export default RoutesApp;