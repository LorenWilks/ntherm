import axios from 'axios';
import Cookies from 'js-cookie';

const csrfToken = Cookies.get('csrftoken');

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'X-CSRF-Token': csrfToken,
    },
  });
  

export default api;
