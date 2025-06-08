<template>
  <div class="p-6">
    <n-card class="shadow-sm">
      <!-- Header section -->
      <template #header>
        <div
          class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <!-- Tab Filters -->
          <div class="flex items-center gap-2">
            <n-button
              :type="filters.employeeTypeId === null ? 'primary' : 'default'"
              @click="tabFilter(null)"
              class="px-4 py-2"
            >
              Hammasi
            </n-button>
            <n-button
              :type="filters.employeeTypeId === 3 ? 'primary' : 'default'"
              @click="tabFilter(3)"
              class="px-4 py-2"
            >
              O'qituvchi
            </n-button>
          </div>

          <!-- Search -->
          <div class="flex-1 max-w-md">
            <n-input
              v-model:value="filters.search"
              placeholder="Qidirish..."
              clearable
              @keydown.enter="handleSearch"
              @clear="handleSearch"
            >
              <template #suffix>
                <n-button
                  text
                  type="primary"
                  @click="handleSearch"
                  class="!p-0"
                >
                  <n-icon>
                    <SearchIcon />
                  </n-icon>
                </n-button>
              </template>
            </n-input>
          </div>
        </div>
      </template>

      <n-spin :show="loading" description="Ma'lumotlar yuklanmoqda...">
        <div class="min-h-96">
          <n-data-table
            v-if="students.length > 0"
            :columns="columns"
            :data="students"
            :loading="loading"
            :bordered="false"
            :single-line="false"
            class="min-h-80"
          />

          <div
            v-else-if="!loading"
            class="flex flex-col items-center justify-center h-64 text-gray-500"
          >
            <n-icon size="48" class="mb-4 opacity-50">
              <SearchIcon />
            </n-icon>
            <p class="text-lg">Ma'lumot topilmadi</p>
          </div>
        </div>
      </n-spin>

      <template #footer>
        <div class="flex justify-between items-center pt-4">
          <div class="text-sm text-gray-500">Jami: {{ totalStudents }} ta</div>
          <n-pagination
            v-model:page="filters.page"
            v-model:page-size="filters.pageSize"
            :item-count="totalStudents"
            :page-sizes="[10, 20, 50, 100]"
            :show-size-picker="true"
            :page-slot="2"
            @update:page="changePage"
            @update:page-size="handlePerPageChange"
          />
        </div>
      </template>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from "vue";
import {
  NCard,
  NInput,
  NButton,
  NDataTable,
  NPagination,
  NDropdown,
  NTag,
  NIcon,
  NSpin,
  useMessage,
  type DataTableColumns,
  type DropdownOption,
} from "naive-ui";
import { Search as SearchIcon } from "@vicons/ionicons5";
import UserService from "@/service/managment/user.service.ts";
import { useRouter } from "vue-router";

interface User {
  id: number;
  fullName: string;
  userName: string;
  employeeType: string;
  roles: string[];
  state: string;
}

const message = useMessage();
const router = useRouter();

const loading = ref(true);
const students = ref<User[]>([]);
const filters = reactive({
  page: 1,
  pageSize: 10,
  search: "",
  sortBy: "",
  orderType: "",
  employeeTypeId: null as number | null,
});

const totalStudents = ref(0);

const columns: DataTableColumns<User> = [
  {
    title: "To'liq nomi",
    key: "fullName",
    sorter: true,
  },
  {
    title: "Foydalanuvchi nomi",
    key: "userName",
    sorter: true,
  },
  {
    title: "O'qituvchi turi",
    key: "employeeType",
    sorter: true,
  },
  {
    title: "Rollar",
    key: "roles",
    width: 200,
    render(row) {
      return h(
        "div",
        { class: "flex flex-wrap gap-1" },
        row.roles?.map((role, idx) =>
          h(
            NTag,
            {
              key: idx,
              type: "info",
              size: "small",
            },
            { default: () => role }
          )
        ) || []
      );
    },
  },
  {
    title: "Holati",
    key: "state",
    width: 120,
    render(row) {
      const getStateConfig = (state: string) => {
        switch (state) {
          case "Active":
            return { type: "success", text: "✅ Faol" };
          case "Inactive":
            return { type: "warning", text: "⚠️ Nofaol" };
          case "Suspended":
            return { type: "error", text: "❌ To'xtatilgan" };
          default:
            return { type: "default", text: "❓ Noma'lum" };
        }
      };

      const config = getStateConfig(row.state);
      return h(
        NTag,
        {
          type: config.type as any,
          size: "small",
        },
        { default: () => config.text }
      );
    },
  },
  {
    title: "Amallar",
    key: "actions",
    width: 100,
    align: "center",
    render(row) {
      return h(
        NDropdown,
        {
          trigger: "click",
          options: getDropdownOptions(row),
          onSelect: (key: string) => handleDropdownSelect(key, row),
        },
        {
          default: () =>
            h(
              NButton,
              {
                text: true,
                type: "primary",
                size: "small",
              },
              {
                default: () => h("span", "⋯"),
              }
            ),
        }
      );
    },
  },
];

const getDropdownOptions = (row: User): DropdownOption[] => [
  {
    label: "✏️ Tahrirlash",
    key: "edit",
    id: row.id,
  },
];

const handleDropdownSelect = (key: string, row: User) => {
  if (key === "edit") {
    goToEditPage(row.id);
  }
};

const goToEditPage = (id: number) => {
  router.push(`/users/edit/${id}`);
};

const GetList = async () => {
  loading.value = true;
  try {
    const data: any = await UserService.GetList(filters);
    students.value = data?.rows || [];
    totalStudents.value = data?.total || 0;
  } catch (error) {
    message.error("Ma'lumotlarni yuklashda xatolik");
    students.value = [];
    totalStudents.value = 0;
  } finally {
    loading.value = false;
  }
};

const tabFilter = (id: number | null) => {
  filters.employeeTypeId = id;
  filters.page = 1;
  GetList();
};

const changePage = (page: number) => {
  filters.page = page;
  GetList();
};

const handlePerPageChange = (pageSize: number) => {
  filters.pageSize = pageSize;
  filters.page = 1;
  GetList();
};

const handleSearch = () => {
  filters.page = 1;
  GetList();
};

onMounted(() => {
  GetList();
});
</script>
