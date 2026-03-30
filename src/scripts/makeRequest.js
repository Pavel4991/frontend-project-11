import axios from 'axios'

const makeRequest = async (url) => {
  try {
    const responce = await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    return responce
  }
  catch {
    throw new Error('network_error')
  }
}

export default makeRequest
