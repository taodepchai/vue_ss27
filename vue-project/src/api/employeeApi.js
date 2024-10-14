import axios from "axios";

const API_URL = "http://localhost:3000/employees";

export const getAllEmployees = () => {
  return axios.get(API_URL);
};

export const addEmployee = (employee) => {
  return axios.post(API_URL, employee);
};

export const updateEmployee = (employee) => {
  return axios.put(`${API_URL}/${employee.id}`, employee);
};

export const deleteEmployee = (employeeId) => {
  return axios.delete(`${API_URL}/${employeeId}`);
};
