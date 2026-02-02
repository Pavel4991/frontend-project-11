import axios from "axios"

const request = async () => {
    const parser = new DOMParser()
    const response = await axios.get('https://lorem-rss.hexlet.app/feed')
    const parsedResponse = parser.parseFromString(response)
    // console.log(response.status)
    // console.log(response.headers)
    // console.log(response.data)
    console.log(parsedResponse)
}

export default request