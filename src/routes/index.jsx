import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import RecoverPassword from "../pages/RecoverPassword";
import { Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Private = ({ Item }) => {
    const signed = localStorage.getItem("token");

    return signed ? <Item /> : <Navigate to="/" />;
};

const Public = ({ Item }) => {
    const signed = localStorage.getItem("token");

    return signed ? <Navigate to="/dashboard-admin" /> : <Item />;
};

const RoutesApp = () => {
    return (
        <BrowserRouter>
            <Fragment>
                <Routes>
                    <Route path="/" element={<Public Item={SignIn} />} />
                    <Route path="/recover-password" element={<Public Item={RecoverPassword} />} />
                    <Route exact path="/dashboard-admin" element={<Private Item={Home} />} />
                    <Route path="*" element={<SignIn />} />
                </Routes>
            </Fragment>
            <ToastContainer
                position="bottom-right"
            />
        </BrowserRouter>
    );
}

export default RoutesApp;