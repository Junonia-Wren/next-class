import React, { useState } from "react";
import { X, Save, Calendar as CalIcon } from "lucide-react";
import TaskService from "../services/taskService";

export default function ModalTarea({ isOpen, onClose, materiaPreseleccionada }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: ""
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.dueDate) return alert("Título y fecha obligatorios");

        try {
            await TaskService.create({
                ...formData,
                subject: materiaPreseleccionada._id // ID de la materia seleccionada
            });
            alert("Tarea creada exitosamente");
            onClose(); // Cierra y recarga (el padre se encarga de recargar)
        } catch (error) {
            console.error(error);
            alert("Error al crear tarea");
        }
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
            display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div className="bg-white rounded-4 p-4 shadow-lg" style={{ width: "90%", maxWidth: "400px", position: "relative" }}>
                
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold m-0" style={{color: "#007E8C"}}>Nueva Tarea</h4>
                    <button onClick={onClose} className="btn btn-sm btn-light rounded-circle"><X size={20}/></button>
                </div>

                <p className="text-muted small mb-3">
                    Asignando a: <strong>{materiaPreseleccionada?.name}</strong>
                </p>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="fw-bold small mb-1">Título</label>
                        <input 
                            type="text" 
                            className="form-control rounded-3" 
                            placeholder="Ej: Ensayo Final"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="fw-bold small mb-1">Descripción</label>
                        <textarea 
                            className="form-control rounded-3" 
                            rows="3"
                            placeholder="Detalles de la tarea..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="fw-bold small mb-1">Fecha de Entrega</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0"><CalIcon size={18}/></span>
                            <input 
                                type="date" 
                                className="form-control rounded-end-3" 
                                value={formData.dueDate}
                                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn w-100 text-white fw-bold rounded-pill" style={{backgroundColor: "#00B8C8"}}>
                        <Save size={18} className="me-2"/> Guardar Tarea
                    </button>
                </form>
            </div>
        </div>
    );
}