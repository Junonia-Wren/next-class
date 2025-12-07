// components/BottomNav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Calendar,
    CheckSquare,
    BookOpen
} from "lucide-react";

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        {
            label: "Horario",
            icon: <Calendar size={22} />,
            to: "/dashboardAlumnos",
        },
        {
            label: "Tareas",
            icon: <CheckSquare size={22} />,
            to: "/tareas",
        },
        {
            label: "Asignaturas",
            icon: <BookOpen size={22} />,
            to: "/asignaturas",
        },
    ];

    return (
        <div
            className="d-flex justify-content-around align-items-center shadow-sm"
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                background: "white",
                padding: "0.6rem 0",
                borderTop: "1px solid #eee",
                zIndex: 50,
            }}
        >
            {navItems.map((item) => {
                const active = location.pathname === item.to;

                return (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="text-center text-decoration-none"
                        style={{
                            color: active ? "#007E8C" : "#808080",
                            fontWeight: active ? "600" : "500",
                            fontSize: "0.8rem",
                        }}
                    >
                        <div>{item.icon}</div>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
