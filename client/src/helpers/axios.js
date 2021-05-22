import axios from 'axios'

export const MESSAGE_SERVER_URL = process.env.MESSAGE_SERVER_URL || "http://localhost:5000/"

const axiosGlobal = axios.create({
  baseURL: MESSAGE_SERVER_URL
})

export default axiosGlobal
