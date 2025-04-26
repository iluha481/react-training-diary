import axios from "axios"


async function Get_user_posts(userid, page, limit) {
    try {
        const response = await axios.get(`localhost:8080/getuserposts?user=${userid}&page=${page}&limit=${limit}`);
        return response.data.message;
    } catch (error) {
        return error;
    }
}

export default Get_user_posts;