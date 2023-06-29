import axios from 'axios';
import queryString from 'query-string';
import { PhotoInterface, PhotoGetQueryInterface } from 'interfaces/photo';
import { GetQueryInterface } from '../../interfaces';

export const getPhotos = async (query?: PhotoGetQueryInterface) => {
  const response = await axios.get(`/api/photos${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPhoto = async (photo: PhotoInterface) => {
  const response = await axios.post('/api/photos', photo);
  return response.data;
};

export const updatePhotoById = async (id: string, photo: PhotoInterface) => {
  const response = await axios.put(`/api/photos/${id}`, photo);
  return response.data;
};

export const getPhotoById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/photos/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePhotoById = async (id: string) => {
  const response = await axios.delete(`/api/photos/${id}`);
  return response.data;
};
