<template>
  <div class="p-6">
    <n-card class="shadow-sm">
      <!-- Header section -->
      <template #header>
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
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
                  <span>🔍</span>
                </n-button>
              </template>
            </n-input>
          </div>

          <n-button
            type="primary"
            @click="goToCreatePage"
            class="bg-blue-500 hover:bg-blue-600"
          >
            <template #icon>
              <n-icon>
                <AddIcon />
              </n-icon>
            </template>
            Yaratish
          </n-button>
        </div>
      </template>

      <div class="min-h-96">
        <n-data-table
          v-if="roles.length > 0"
          :columns="columns"
          :data="roles"
          :loading="loading"
          :bordered="false"
          :single-line="false"
          class="min-h-80"
        />

        <div
          v-else-if="!loading"
          class="flex flex-col items-center justify-center h-64 text-gray-500"
        >
          <span class="text-5xl mb-4 opacity-50">🔍</span>
          <p class="text-lg">Ma'lumot topilmadi</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center pt-4">
          <div class="text-sm text-gray-500">Jami: {{ totalRoles }} ta</div>
          <n-pagination
            v-model:page="filters.page"
            v-model:page-size="filters.pageSize"
            :item-count="totalRoles"
            :page-sizes="[10, 20, 50, 100]"
            :show-size-picker="true"
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
  useMessage,
  useDialog,
  type DataTableColumns,
  type DropdownOption,
} from "naive-ui";
import RoleService from "@/service/managment/role.service";
import { useRouter } from "vue-router";
import { Add as AddIcon } from "@vicons/ionicons5";

interface Role {
  id: number;
  name: string;
  state: string;
}

const message = useMessage();
const dialog = useDialog();
const router = useRouter();

const loading = ref(true);
const roles = ref<Role[]>([]);
const filters = reactive({
  page: 1,
  pageSize: 50,
  search: "",
  sortBy: "",
  orderType: "",
});

const totalRoles = ref(0);

const columns: DataTableColumns<Role> = [
  {
    title: "ID",
    key: "id",
    width: 80,
    sorter: true,
  },
  {
    title: "To'liq nomi",
    key: "name",
    sorter: true,
  },
  {
    title: "Holati",
    key: "state",
    width: 120,
    render(row) {
      return h(
        "span",
        {
          class: [
            "px-2 py-1 text-xs rounded-full",
            row.state === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800",
          ],
        },
        row.state === "active" ? "✅ Faol" : "❌ Nofaol"
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

const getDropdownOptions = (row: Role): DropdownOption[] => [
  {
    label: "✏️ Tahrirlash",
    key: "edit",
    id: row.id,
  },
  {
    label: "🗑️ O'chirish",
    key: "delete",
    id: row.id,
  },
];

const handleDropdownSelect = (key: string, row: Role) => {
  if (key === "edit") {
    goToEditPage(row.id);
  } else if (key === "delete") {
    showDeleteConfirm(row);
  }
};

const goToCreatePage = () => {
  router.push("/role/edit/0");
};

const goToEditPage = (id: number) => {
  router.push(`/role/edit/${id}`);
};

const showDeleteConfirm = (item: Role) => {
  dialog.warning({
    title: "O'chirishni tasdiqlang",
    content: `"${item.name}" rolini o'chirishni xohlaysizmi?`,
    positiveText: "O'chirish",
    negativeText: "Bekor qilish",
    onPositiveClick: () => {
      deleteItem(item);
    },
  });
};

const deleteItem = async (item: Role) => {
  try {
    await RoleService.Delete(item.id);
    message.success("Rol muvaffaqiyatli o'chirildi");
    await GetList();
  } catch (error) {
    message.error("Xatolik yuz berdi");
    console.error("Error deleting role:", error);
  }
};

const GetList = async () => {
  loading.value = true;
  try {
    const data: any = await RoleService.GetList(filters);
    roles.value = data?.rows || [];
    totalRoles.value = data?.total || 0;
  } catch (error) {
    console.error("Error fetching roles:", error);
    message.error("Ma'lumotlarni yuklashda xatolik");
    roles.value = [];
    totalRoles.value = 0;
  } finally {
    loading.value = false;
  }
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

// Lifecycle
onMounted(() => {
  GetList();
});
</script>
