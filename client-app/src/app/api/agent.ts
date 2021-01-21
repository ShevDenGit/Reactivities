import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { IActivity } from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network error - make sure API is running!');
    }
    const {status, data, config} = error.response;
    if (status === 404) {
        history.push('/notfound')
    }
    if (status === 400 && config.method === "get" && data.errors.hasOwnProperty('id')) {
        history.push('/notfound')
    }
    if (status === 500) {
        toast.error('Server error - check terminal for more info!');
    }
})

const responseBody = (response: AxiosResponse) => response.data

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/Activities'),
    details: (id: string) => requests.get(`/Activities/${id}`),
    create: (activity: IActivity) => requests.post('/Activities', activity),
    update: (activity: IActivity) => requests.put(`/Activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete(`/Activities/${id}`)
}

const agent = {
    Activities
}

export default agent;