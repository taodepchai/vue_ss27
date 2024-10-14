import {
  getAllEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/employeeApi";

const employee = {
  state: {
    employees: [],
  },
  getters: {
    allEmployees: (state) => state.employees,
    filteredEmployees: (state) => (searchQuery) => {
      return state.employees.filter((employee) =>
        employee.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
  },
  actions: {
    async fetchEmployees({ commit }) {
      const response = await getAllEmployees();
      commit("setEmployees", response.data);
    },
    async addEmployee({ commit }, employee) {
      const response = await addEmployee(employee);
      commit("newEmployee", response.data);
    },
    async updateEmployee({ commit }, employee) {
      await updateEmployee(employee);
      commit("modifyEmployee", employee);
    },
    async deleteEmployee({ commit }, employeeId) {
      await deleteEmployee(employeeId);
      commit("removeEmployee", employeeId);
    },
  },
  mutations: {
    setEmployees: (state, employees) => (state.employees = employees),
    newEmployee: (state, employee) => state.employees.push(employee),
    modifyEmployee: (state, updatedEmployee) => {
      const index = state.employees.findIndex(
        (employee) => employee.id === updatedEmployee.id
      );
      if (index !== -1) {
        state.employees.splice(index, 1, updatedEmployee);
      }
    },
    removeEmployee: (state, id) => {
      state.employees = state.employees.filter(
        (employee) => employee.id !== id
      );
    },
  },
};

export default employee;
