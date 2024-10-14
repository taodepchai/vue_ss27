<template>
  <div>
    <h2>Nhân viên</h2>
    <button @click="showAddForm = true">Thêm mới nhân viên</button>

    <input
      v-model="searchQuery"
      placeholder="Tìm kiếm theo email"
      @input="searchEmployee"
    />

    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Họ và tên</th>
          <th>Ngày sinh</th>
          <th>Email</th>
          <th>Địa chỉ</th>
          <th>Trạng thái</th>
          <th>Chức năng</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(employee, index) in filteredEmployees" :key="employee.id">
          <td>{{ index + 1 }}</td>
          <td>{{ employee.name }}</td>
          <td>{{ employee.dob }}</td>
          <td>{{ employee.email }}</td>
          <td>{{ employee.address }}</td>
          <td>
            <span
              :class="{ active: employee.status, inactive: !employee.status }"
            >
              {{ employee.status ? "Đang hoạt động" : "Ngừng hoạt động" }}
            </span>
          </td>
          <td>
            <button @click="toggleStatus(employee)">
              {{ employee.status ? "Chặn" : "Bỏ chặn" }}
            </button>
            <button @click="editEmployee(employee)">Sửa</button>
            <button @click="deleteEmployee(employee.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showAddForm || showEditForm">
      <h3>{{ showAddForm ? "Thêm mới nhân viên" : "Sửa nhân viên" }}</h3>
      <form @submit.prevent="saveEmployee">
        <input v-model="employeeForm.name" placeholder="Họ và tên" required />
        <input
          v-model="employeeForm.dob"
          type="date"
          placeholder="Ngày sinh"
          required
        />
        <input
          v-model="employeeForm.email"
          type="email"
          placeholder="Email"
          required
        />
        <input v-model="employeeForm.address" placeholder="Địa chỉ" required />
        <button type="submit">{{ showAddForm ? "Thêm" : "Lưu" }}</button>
        <button @click="cancelForm">Hủy</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

const searchQuery = ref("");
const showAddForm = ref(false);
const showEditForm = ref(false);
const employeeForm = ref({
  name: "",
  dob: "",
  email: "",
  address: "",
  status: true,
});
const currentEmployeeId = ref(null);

const filteredEmployees = computed(() =>
  store.getters.filteredEmployees(searchQuery.value)
);

const loadEmployees = async () => {
  await store.dispatch("fetchEmployees");
};

const saveEmployee = async () => {
  if (showAddForm.value) {
    await store.dispatch("addEmployee", employeeForm.value);
  } else {
    await store.dispatch("updateEmployee", {
      ...employeeForm.value,
      id: currentEmployeeId.value,
    });
  }
  resetForm();
};

const editEmployee = (employee) => {
  currentEmployeeId.value = employee.id;
  employeeForm.value = { ...employee };
  showEditForm.value = true;
  showAddForm.value = false;
};

const deleteEmployee = async (employeeId) => {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    await store.dispatch("deleteEmployee", employeeId);
  }
};

const toggleStatus = async (employee) => {
  await store.dispatch("updateEmployee", {
    ...employee,
    status: !employee.status,
  });
};

const resetForm = () => {
  employeeForm.value = {
    name: "",
    dob: "",
    email: "",
    address: "",
    status: true,
  };
  showAddForm.value = false;
  showEditForm.value = false;
  currentEmployeeId.value = null;
};

const cancelForm = () => {
  resetForm();
};

onMounted(() => {
  loadEmployees();
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
  text-align: left;
}
button {
  margin-right: 5px;
  padding: 5px 10px;
}
.active {
  color: green;
}
.inactive {
  color: red;
}
</style>
