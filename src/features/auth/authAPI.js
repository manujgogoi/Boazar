import axiosInstance from '../../services/Axios';
import {TOKEN_URL} from '../../utils/urls';
import axios from 'axios';

export const loginAPI = async (email, password) => {
  const response = await axiosInstance.post(TOKEN_URL, {email, password});
  return response;
};
