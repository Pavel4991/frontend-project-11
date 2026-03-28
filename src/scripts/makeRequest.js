import axios from "axios"

export default async (url) => {    
    try {
        const responce = await axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
        return responce
    } catch {
        throw new Error('network_error')
    }
}