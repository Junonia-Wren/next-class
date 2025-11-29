import app from "./app.js";
import scrip from "./scripts/createAdmin.js"

app.listen(app.get("port"), ()=>{
    console.log("Server listening on port", app.get("port")); 
}); 