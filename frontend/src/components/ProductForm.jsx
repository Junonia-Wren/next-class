import React from 'react'

export default function ProductForm() {
  return (
    <div>
      <div className="card mt-3">
        <div className="card-body">
            <form action="">
                <div className="row">
                    <div className="col-lg-6">
                        <label htmlFor="txtBarcode" className='form-label'>
                            Código de barras
                        </label>
                        <input type="text" classname="form-control"  id="txtBarcode" name="barcode" />
                    </div>
                    <div className="col-lg-6">
                        <label htmlFor="txtBarcode" className='form-label'>
                            Descripción
                        </label>
                        <input type="text" classname="form-control"  id="txtBarcode" name="barcode" />
                    </div>
                    
                    <div className="col-lg-6">
                        <label htmlFor="txtBarcode" className='form-label'>
                            Marca
                        </label>
                        <input type="text" classname="form-control"  id="txtBarcode" name="barcode" />
                    </div>
                    
                    
                    <div className="col-lg-6">
                        <label htmlFor="txtBarcode" className='form-label'>
                            Categoria
                        </label>
                        <input type="text" classname="form-control"  id="txtBarcode" name="barcode" />
                    </div>
                    
                    <div className="col-lg-6">
                        <label htmlFor="txtBarcode" className='form-label'>
                            Costo
                        </label>
                        <input type="text" classname="form-control"  id="txtBarcode" name="barcode" />
                    </div>
                    
                    <div className="col-lg-6">
                        <label htmlFor="txtBarcode" className='form-label'>
                            Precio
                        </label>
                        <input type="text" classname="form-control"  id="txtBarcode" name="barcode" />
                    </div>
                    
                    <div className="col-lg-6">
                        <label htmlFor="txtBarcode" className='form-label'>
                            Cantidad
                        </label>
                        <input type="text" classname="form-control"  id="txtBarcode" name="barcode" />
                    </div>
                    
                    <div className="col-lg-6">
                        <label htmlFor="txtBarcode" className='form-label'>
                           Fecha de caducidad
                        </label>
                        <input type="text" classname="form-control"  id="txtBarcode" name="barcode" />
                    </div>
                    
                    <div className="row">
                        <div className="colg-lg-4">
                            <button type="submit" className="btn-btn-primary mt-3">Guardar</button>
                        </div>
                    </div>
                    
            

                    
                
    

                </div>
            </form>
        </div>
      </div>
    </div>
  )
}
