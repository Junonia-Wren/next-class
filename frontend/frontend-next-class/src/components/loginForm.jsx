import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import userServices from "../services/userServices";

function LoginForm() {

    const [formData, setFormData] = useState({
        matricula: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await userServices.login(formData);
            console.log("Respuesta del servidor:", response.data);

            setSuccess("Inicio de sesión exitoso");

            // Si tu backend devuelve un token:
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            // Redirigir a dashboard / home
            navigate("/dashboard");

        } catch (err) {
            console.log(err);
            setError("Matrícula o contraseña incorrecta");
        }
    };

    return (
        <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="card p-4 shadow" style={{ width: "350px" }}>
                <h4 className="text-center mb-4">Login</h4>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">Matrícula</label>
                        <input
                            type="text"
                            className="form-control"
                            name="matricula"
                            value={formData.matricula}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="text-center mt-2 mb-2">
                        <span>¿Olvidaste tu contraseña?</span>
                        <Link to="/forgot-password" className="ms-1">
                            Recuperar
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                        Iniciar sesión
                    </button>

                    <Link
                        to="/register"
                        className="btn btn-outline-primary w-100 mt-2"
                    >
                        Registrarse
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
