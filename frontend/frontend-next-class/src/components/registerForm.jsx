import { useState } from "react";

function RegisterForm() {
    const [form, setForm] = useState({
        matricula: "",
        name: "",
        password: "",
        area: "DSM",
        nivel: "Ingeniería",
        grupo: "1A"
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mt-5">
            <h2>Registro Estudiante</h2>
            <input
                name="matricula"
                className="form-control mb-2"
                placeholder="Matricula"
                value={form.matricula}
                onChange={handleChange}
            />
            <input
                name="name"
                className="form-control mb-2"
                placeholder="Nombre"
                value={form.name}
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                className="form-control mb-2"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
            />

            <select
                name="area"
                className="form-select mb-2"
                value={form.area}
                onChange={handleChange}
            >
                <option value="DSM">DSM</option>
                <option value="EVND">EVND</option>
            </select>

            <select
                name="nivel"
                className="form-select mb-2"
                value={form.nivel}
                onChange={handleChange}
            >
                <option value="Técnico">Técnico</option>
                <option value="Ingeniería">Ingeniería</option>
            </select>

            <select
                name="grupo"
                className="form-select mb-3"
                value={form.grupo}
                onChange={handleChange}
            >
                <option value="1A">1A</option>
                <option value="1B">1B</option>
                <option value="2A">2A</option>
                <option value="3A">3A</option>
                <option value="4A">4A</option>
                <option value="5A">5A</option>
                <option value="6A">6A</option>
                <option value="8A">8A</option>
                <option value="9A">9A</option>
                <option value="10A">10A</option>
            </select>

            <button className="btn btn-success">Registrarse</button>
        </div>
    );
}

export default RegisterForm;