import axios from "axios"


async function Get_user(username) {
    try {
        const response = await axios.get(`localhost:8080/getuser?username=${username}`);
        return response.data.message;
    } catch (error) {
        return error;
    }
}

export default Get_user;