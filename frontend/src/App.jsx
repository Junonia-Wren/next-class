import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NavBar from './components/NavBar';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';

 function App() {
  return (
    <div>
      <div className="container">
        <div className="row">
          {/*aqui va la barra de navegación*/}
          <NavBar/>
          </div>
          <div className="row">
            <div className="col-lg-5">  
           {/*aqui va formulario de registro*/}
           <ProductForm></ProductForm>
           </div>
          </div>
          <div className="col-lg-7">
            {/*aqui va tabla de los productos*/}
      <ProductTable></ProductTable>
          </div>
        </div>
     
    </div>

  )
}
 export default App 






