<template>
  <div class="p-6">
    <n-card class="shadow-sm">
      <!-- Header section -->
      <template #header>
        <div
          class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
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
                  <n-icon>
                    <SearchIcon />
                  </n-icon>
                </n-button>
              </template>
            </n-input>
          </div>

          <!-- Sinxronizatsiya Button -->
          <n-button
            type="primary"
            @click="goToSyncPage"
            class="bg-blue-500 hover:bg-blue-600"
          >
            <template #icon>
              <n-icon>
                <SyncIcon />
              </n-icon>
            </template>
            Sinxronizatsiya
          </n-button>
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
            :page-slot="3"
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
  NProgress,
  NTag,
  NIcon,
  NSpin,
  useMessage,
  type DataTableColumns,
} from "naive-ui";
import { Search as SearchIcon, Sync as SyncIcon } from "@vicons/ionicons5";
import OrganizationService from "@/service/managment/organization.service.ts";
import { useRouter } from "vue-router";

interface Organization {
  id: number;
  fullName: string;
  startAt: string;
  progress: number;
  status: string;
}

const message = useMessage();
const router = useRouter();

const loading = ref(true);
const students = ref<Organization[]>([]);
const filters = reactive({
  page: 1,
  pageSize: 10,
  search: "",
  sortBy: "",
  orderType: "",
});

const totalStudents = ref(0);

const columns: DataTableColumns<Organization> = [
  {
    title: "ID",
    key: "id",
    width: 80,
    sorter: true,
  },
  {
    title: "To'liq nomi",
    key: "fullName",
    sorter: true,
  },
  {
    title: "Boshlanish vaqti",
    key: "startAt",
    sorter: true,
    render(row) {
      return h("span", new Date(row.startAt).toLocaleDateString("uz-UZ"));
    },
  },
  {
    title: "Progress",
    key: "progress",
    width: 180,
    render(row) {
      return h("div", { class: "w-full space-y-2" }, [
        h(
          "div",
          { class: "text-sm font-medium text-center" },
          `${row.progress}%`
        ),
        h("div", { class: "w-full" }, [
          h(NProgress, {
            percentage: row.progress,
            type: "line",
            height: 10,
            color:
              row.progress >= 70
                ? "#52c41a"
                : row.progress >= 40
                ? "#faad14"
                : "#ff4d4f",
            showIndicator: false,
          }),
        ]),
      ]);
    },
  },
  {
    title: "Holati",
    key: "status",
    width: 120,
    render(row) {
      const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
          case "active":
          case "faol":
            return { type: "success", text: "✅ Faol" };
          case "inactive":
          case "nofaol":
            return { type: "warning", text: "⚠️ Nofaol" };
          case "completed":
          case "tugallangan":
            return { type: "info", text: "✔️ Tugallangan" };
          case "pending":
          case "kutilmoqda":
            return { type: "default", text: "⏳ Kutilmoqda" };
          default:
            return { type: "default", text: "❓ Noma'lum" };
        }
      };

      const config = getStatusConfig(row.status);
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
];

const goToSyncPage = () => {
  router.push("/organization/edit/0");
};

const GetList = async () => {
  loading.value = true;
  try {
    const data: any = await OrganizationService.GetList(filters);
    students.value = data?.rows || [];
    totalStudents.value = data?.total || 0;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    message.error("Ma'lumotlarni yuklashda xatolik");
    students.value = [];
    totalStudents.value = 0;
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
