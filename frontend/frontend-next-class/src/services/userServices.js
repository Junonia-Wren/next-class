import axios from 'axios';

const URL_BASE_API = "http://localhost:3000/api/auth";

const userServices ={

    register(dataUser){
        return axios.post(URL_BASE_API + "/register", dataUser);
    }, 
    login(dataUser){
        return axios.post(URL_BASE_API + "/login", dataUser);
    }
}

export default userServices;