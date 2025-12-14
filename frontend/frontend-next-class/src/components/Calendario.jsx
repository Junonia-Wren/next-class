import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './Calendario.css'; 

export default function Calendario({ taskDates = [] }) {
    const [value, onChange] = useState(new Date());

    const hasTask = (date) => {
        // 1. Convertimos la fecha que el calendario está pintando a texto LOCAL "YYYY-MM-DD"
        // Usamos getFullYear/Month/Date para respetar la fecha que VES en pantalla
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const calendarDateString = `${year}-${month}-${day}`; 

        return taskDates.some(taskDateStr => {
            if(!taskDateStr) return false;
            
            // 2. Tomamos la fecha de la BD (ISO: "2025-12-09T00:00...")
            // Cortamos los primeros 10 caracteres para obtener "2025-12-09" PURO
            const taskString = taskDateStr.substring(0, 10);

            // 3. Comparamos texto contra texto. Si son iguales, es ese día.
            return taskString === calendarDateString;
        });
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month' && hasTask(date)) {
            return (
                <div className="dot-container">
                    <div className="task-dot"></div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="custom-calendar-container text-center">  
            <Calendar 
                onChange={onChange} 
                value={value} 
                tileContent={tileContent}
                prev2Label={null} 
                next2Label={null}
                prevLabel={"‹"} 
                nextLabel={"›"}
                locale="es-MX"
                formatShortWeekday={(locale, date) => ['D', 'L', 'M', 'M', 'J', 'V', 'S'][date.getDay()]}
            />
        </div>
    );
}