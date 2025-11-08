import React from 'react'

export default function ProductTable() {
  return (
    <div>
      <table className='table table-primary table-striped mt-3'>
        <thead>
            <tr>
                <th>Codigo de barras</th>
                <th>Descripción</th>
                <th>Marca</th>
                <th>Precio</th>
                <th>Stock</th>
                <th colSpan="2">Opciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>124</td>
                <td>Barritas</td>
                <td>Marinela</td>
                <td>12.00</td>
                <td>100</td>
                <td>
                    <button className="btn btn-warning btn-sm">Editar</button>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm">Eliminar</button>   
                </td>
            </tr>

            <tr>
                <td>125</td>
                <td>Barritas fresa</td>
                <td>Marinela</td>
                <td>12.00</td>
                <td>100</td>
                <td>
                    <button className="btn btn-warning btn-sm">Editar</button>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm">Eliminar</button>   
                </td>
            </tr>
            
            <tr>
                <td>126</td>
                <td>Barritas fresa</td>
                <td>Marinela</td>
                <td>12.00</td>
                <td>100</td>
                <td>
                    <button className="btn btn-warning btn-sm">Editar</button>
                </td>
                <td>
                    <button className="btn btn-danger btn-sm">Eliminar</button>   
                </td>
            </tr>


        </tbody>
      </table>
    </div>
  )
}
