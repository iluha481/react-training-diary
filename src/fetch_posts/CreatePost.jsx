import axios from "axios";


async function Create_post(json) {
    try {
        const response = await axios.post("localhost:8080/createpost", json);
        return response.data.message;
    }catch (error) {
        return error;
    }
};

export default Create_post;