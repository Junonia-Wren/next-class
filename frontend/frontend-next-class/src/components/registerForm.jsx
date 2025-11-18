import React, { useState } from "react";
import userServices from "../services/userServices.js";

function RegisterForm() {
    const [formData, setFormData] = useState({
        matricula: "",
        name: "",
        password: "",
        area: "",
        nivel: "",
        grupo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos del formulario", formData);

        const response = await userServices.register(formData);
        console.log(response);
    };

    return (
        <div className="container d-flex justify-content-center mt-4">
            <div
                className="card p-4 shadow"
                style={{ maxWidth: "700px", width: "100%" }}
            >
                <div className="card-body">
                    <h4 className="text-center mb-3">Registro</h4>

                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-lg-6">
                                <label className="form-label">Matricula</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="matricula"
                                    value={formData.matricula}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-lg-6">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-6">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-lg-6">
                                <label className="form-label">Área</label>
                                <select
                                    className="form-select"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione área</option>
                                    <option value="DSM">DSM</option>
                                    <option value="EVND">EVND</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-lg-6">
                                <label className="form-label">Nivel</label>
                                <select
                                    className="form-select"
                                    name="nivel"
                                    value={formData.nivel}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione nivel</option>
                                    <option value="Técnico">Técnico</option>
                                    <option value="Ingeniería">Ingeniería</option>
                                </select>
                            </div>

                            <div className="col-lg-6">
                                <label className="form-label">Grupo</label>
                                <select
                                    className="form-select"
                                    name="grupo"
                                    value={formData.grupo}
                                    onChange={handleChange}
                                >
                                    {/* Tus grupos */}
                                    <option value="">Seleccione grupo</option>
                                    <option value="1A">1A</option>
                                    <option value="1B">1B</option>
                                    <option value="2A">2A</option>
                                    <option value="2B">2B</option>
                                    <option value="3A">3A</option>
                                    <option value="3B">3B</option>
                                    <option value="4A">4A</option>
                                    <option value="4B">4B</option>
                                    <option value="5A">5A</option>
                                    <option value="5B">5B</option>
                                    <option value="6A">6A</option>
                                    <option value="6B">6B</option>
                                    <option value="8A">8A</option>
                                    <option value="8B">8B</option>
                                    <option value="9A">9A</option>
                                    <option value="9B">9B</option>
                                    <option value="10A">10A</option>
                                    <option value="10B">10B</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">
                                Registrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
