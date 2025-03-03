import axios, { AxiosResponse, isAxiosError } from 'axios'

const useFetchData = async <T>(path: string): Promise<T> => {
    axios.defaults.baseURL = process.env.BACKEND_API_URL || 'http://localhost:5000/api'
    return axios
        .get<T>(path)
        .then((response: AxiosResponse<T>) => {
            return response.data as T
        })
        .catch((error: unknown) => {
            if (isAxiosError(error)) {
                console.error(error.response?.data)
            } else {
                console.error(error)
            }
            throw new Error('Failed to fetch data')
        })
}

export default useFetchData
