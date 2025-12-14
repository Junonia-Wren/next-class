import React from 'react';
import { CheckCircle, AlertTriangle, Trash2, X } from 'lucide-react';

const FeedbackModal = ({ isOpen, type, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    // Configuración de estilos según el tipo de alerta
    const isDanger = type === 'danger' || type === 'deleteSuccess';

    // Colores basados en tu diseño (Turquesa para éxito, Vino/Rojo para peligro)
    const primaryColor = isDanger ? "#8D2745" : "#00B8C8";
    const bgColor = isDanger ? "#FFF5F7" : "#E0F7FA";

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semitransparente
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: "blur(3px)", animation: "fadeIn 0.2s"
        }}>
            <div style={{
                backgroundColor: "white", width: "90%", maxWidth: "400px",
                borderRadius: "25px", padding: "30px", textAlign: "center",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)", position: "relative",
                animation: "scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}>

                {/* Ícono Principal */}
                <div style={{
                    width: "80px", height: "80px", margin: "0 auto 20px",
                    backgroundColor: bgColor, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: primaryColor
                }}>
                    {type === 'success' && <CheckCircle size={40} />}
                    {type === 'danger' && <AlertTriangle size={40} />}
                    {type === 'deleteSuccess' && <Trash2 size={40} />}
                </div>

                {/* Títulos - Fuente Poppins implícita */}
                <h2 style={{
                    margin: "0 0 10px 0", color: "#333", fontSize: "1.5rem", fontWeight: "bold", textTransform: "uppercase"
                }}>
                    {title}
                </h2>

                <p style={{
                    margin: "0 0 30px 0", color: "#666", fontSize: "1rem", lineHeight: "1.5"
                }}>
                    {message}
                </p>

                {/* Botones */}
                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>

                    {/* Botón Cancelar (Solo visible si es tipo 'danger' confirmación) */}
                    {type === 'danger' && (
                        <button
                            onClick={onCancel}
                            style={{
                                padding: "12px 30px", borderRadius: "30px", border: "1px solid #ddd",
                                backgroundColor: "white", color: "#666", fontSize: "0.9rem",
                                fontWeight: "600", cursor: "pointer", transition: "all 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f9f9f9"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                        >
                            Cancelar
                        </button>
                    )}

                    {/* Botón Acción Principal */}
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: "12px 40px", borderRadius: "30px", border: "none",
                            backgroundColor: primaryColor, color: "white", fontSize: "0.9rem",
                            fontWeight: "600", cursor: "pointer", boxShadow: `0 5px 15px ${primaryColor}40`,
                            transition: "transform 0.1s", flex: type === 'danger' ? 'none' : 1
                        }}
                        onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
                        onMouseUp={(e) => e.target.style.transform = "scale(1)"}
                    >
                        {type === 'danger' ? 'Sí, Eliminar' : 'ACEPTAR'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FeedbackModal;