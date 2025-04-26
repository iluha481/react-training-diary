import axios from "axios"


async function Get_posts(page, limit) {
    try {
        const response = await axios.get(`http://localhost:8080/getposts?page=${page}&limit=${limit}`, {withCredentials: true});
        return response.data;
    } catch (error) {
        return error;
    }
}

export default Get_posts;