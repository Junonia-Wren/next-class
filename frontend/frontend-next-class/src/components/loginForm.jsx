import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function LoginForm() {
    const [matricula, setMatricula] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="text-center mb-4">
                    {/* Puedes reemplazar esto con tu logo */}
                    <img src="/logo.png" alt="Logo" style={{ width: "80px" }} />
                    <h4 className="mt-3">Login Estudiante</h4>
                </div>

                <div className="mb-3">
                    <label className="form-label">Matrícula</label>
                    <input
                        type="text"
                        className="form-control"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mb-3 text-end">
                    <a href="#" className="text-decoration-none">¿Olvidaste tu contraseña?</a>
                </div>

                <div className="d-grid gap-2">
                    <button className="btn btn-info text-white">Login</button>
                    <Link to="/register" className="btn btn-outline-secondary">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;