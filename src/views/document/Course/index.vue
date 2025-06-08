<template>
  <n-card :bordered="false" class="courses-list-card">
    <div class="card-header">
      <div class="header-left">
        <n-select
          v-model:value="filters.employeeId"
          :options="employeeList"
          placeholder="O'qituvchi"
          clearable
          style="width: 250px"
          :render-label="renderLabel"
          @update:value="fetchCourses"
        />
      </div>
      <div class="header-right">
        <n-button
          type="primary"
          @click="router.push('/courses/all/edit/0')"
          class="me-2"
        >
          <template #icon>
            <n-icon><PlusOutline /></n-icon>
          </template>
          Yaratish
        </n-button>

        <n-input
          v-model:value="filters.search"
          placeholder="Qidirish"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <n-icon><SearchOutline /></n-icon>
          </template>
        </n-input>
      </div>
    </div>

    <n-spin :show="loading">
      <n-data-table
        v-if="courses.length"
        :columns="columns"
        :data="courses"
        :bordered="false"
        :remote="true"
        @update:sorter="handleSort"
      />

      <n-empty v-else description="Ma'lumot topilmadi" class="empty-state">
        <template #icon>
          <n-icon><SearchOutline /></n-icon>
        </template>
      </n-empty>

      <n-pagination
        v-model:page="filters.page"
        :page-size="filters.pageSize"
        :item-count="totalCourses"
        @update:page="changePage"
        @update:page-size="handlePerPageChange"
        show-size-picker
        :page-sizes="[10, 20, 50, 100]"
      />
    </n-spin>

    <n-modal
      v-model:show="showDeleteModal"
      preset="dialog"
      title="Kursni o'chirish"
      positive-text="Ha"
      negative-text="Bekor qilish"
      @positive-click="handleConfirmDelete"
    >
      Haqiqatdan ham ushbu kursni o‘chirmoqchimisiz?
    </n-modal>
  </n-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from "vue";
import { useRouter } from "vue-router";
import {
  NButton,
  NCard,
  NDataTable,
  NEmpty,
  NInput,
  NModal,
  NPagination,
  NSelect,
  NSpin,
  NIcon,
  NDropdown,
  useMessage,
  type DataTableColumns,
} from "naive-ui";
import CourseService from "@/service/document/course.service";
import EmployeeService from "@/service/document/employee.service";
import { useAppUrl } from "@/composables/useAppUrl";

import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  SettingsOutline as SettingsIcon,
  EyeOutline as EyeIcon,
  TrashOutline as DeleteIcon,
  PencilOutline as EditIcon,
  EllipsisVerticalOutline as DotsIcon,
  SearchOutline,
  AddOutline as PlusOutline,
} from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();
const { core_cdn } = useAppUrl();

// State
const loading = ref(true);
const courses = ref<any[]>([]);
const employeeList = ref<any[]>([]);
const showDeleteModal = ref(false);
const courseIdToDelete = ref<number | null>(null);

const defaultCourseImage = "/src/assets/images/courses/course-default.jpg";

// Filters
const filters = reactive({
  page: 1,
  pageSize: 10,
  search: "",
  sortBy: "",
  orderType: "asc",
  employeeId: null as number | null,
});

const totalCourses = ref(0);

const renderLabel = (option: any) => {
  return h(
    "span",
    {
      style: {
        color: "#1e90ff",
        fontWeight: "500",
      },
    },
    option.text
  );
};

const actionOptions = [
  {
    label: "Tahrirlash",
    key: "edit",
    icon: () => h(NIcon, { size: 18 }, () => h(EditIcon)),
  },
  {
    label: "Ko'rish",
    key: "view",
    icon: () => h(NIcon, { size: 18 }, () => h(EyeIcon)),
  },
  {
    label: "O'chirish",
    key: "delete",
    icon: () => h(NIcon, { size: 18 }, () => h(DeleteIcon)),
  },
];

const dropdownCourseId = ref<number | null>(null);

const handleDropdownSelect = (key: string) => {
  const id = dropdownCourseId.value;
  if (!id) return;

  switch (key) {
    case "edit":
      editCourse(id);
      break;
    case "view":
      goVideo(id);
      break;
    case "delete":
      deleteCourse(id);
      break;
  }
};

// Columns
const columns: DataTableColumns<any> = [
  {
    title: "Kurs nomi",
    key: "name",
    sorter: true,
    render: (row) =>
      h("div", { class: "flex items-center" }, [
        h(
          "div",
          {
            class:
              "w-[90px] h-[60px] overflow-hidden rounded-md flex-shrink-0 bg-gray-200 mr-3",
          },
          row.thumbnailId
            ? h("img", {
                src: getThumbnailUrl(row),
                alt: "course-image",
                class: "w-full h-full object-cover block",
              })
            : h(NIcon, { size: 24 }, () => h(SettingsIcon))
        ),
        h("div", null, [
          h(
            "a",
            {
              class:
                "no-underline font-bold text-gray-800 hover:underline cursor-pointer",
              onClick: () => editCourse(row.id),
            },
            row.title
          ),
          h("div", { class: "flex items-center text-gray-500 mt-1 text-sm" }, [
            h(NIcon, { size: 16, class: "mr-2 text-blue-600" }, () =>
              h(BookIcon)
            ),
            `Mavzular soni: ${row.topicCount}`,
          ]),
        ]),
      ]),
  },
  {
    title: "O'qituvchi",
    key: "employee",
    sorter: true,
    render: (row) =>
      h("div", { class: "flex items-center gap-2" }, [
        h(NIcon, { size: 18, class: "text-blue-600" }, () => h(PersonIcon)),
        row.employee,
      ]),
  },
  {
    title: "Talabalar soni",
    key: "learnerCount",
    sorter: true,
  },
  {
    title: "Yaratilgan sana",
    key: "createdDate",
    sorter: true,
  },
  {
    title: "",
    key: "actions",
    render: (row) =>
      h(
        NDropdown,
        {
          options: actionOptions,
          onSelect: handleDropdownSelect,
          onClickoutside: () => (dropdownCourseId.value = null),
        },
        {
          default: () =>
            h(
              NButton,
              {
                text: true,
                onClick: () => (dropdownCourseId.value = row.id),
              },
              {
                icon: () => h(NIcon, { size: 18 }, () => h(DotsIcon)),
              }
            ),
        }
      ),
  },
];

// Methods
const getThumbnailUrl = (course: any) => {
  if (course?.thumbnailId) {
    return `${core_cdn.value}/Media/Get?entityName=${
      course?.entityName || "course"
    }&fileId=${course.thumbnailId}`;
  }
  return defaultCourseImage;
};

const fetchCourses = async () => {
  loading.value = true;
  try {
    const data = await CourseService.GetList(filters);
    courses.value = data?.rows || [];
    totalCourses.value = data?.total || 0;
  } catch (error) {
    message.error("Kurslarni yuklashda xatolik yuz berdi");
    courses.value = [];
    totalCourses.value = 0;
  } finally {
    loading.value = false;
  }
};

const fetchEmployeeList = async () => {
  try {
    employeeList.value = await EmployeeService.GetAsSelectlist();
  } catch (error) {
    message.error("O'qituvchilar ro'yxatini yuklashda xatolik");
  }
};

const handleSort = (sorter: any) => {
  if (sorter) {
    filters.sortBy = sorter.columnKey;
    filters.orderType = sorter.order === "ascend" ? "asc" : "desc";
    fetchCourses();
  }
};

const deleteCourse = (id: number) => {
  courseIdToDelete.value = id;
  showDeleteModal.value = true;
};

const handleConfirmDelete = async () => {
  try {
    if (courseIdToDelete.value) {
      await CourseService.Delete(courseIdToDelete.value);
      message.success("Kurs muvaffaqiyatli o'chirildi");
      fetchCourses();
    }
  } catch (error) {
    message.error("Kursni o'chirishda xatolik yuz berdi");
  } finally {
    showDeleteModal.value = false;
    courseIdToDelete.value = null;
  }
};

const editCourse = (id: number) => {
  router.push(`/courses/all/edit/${id}`);
};

const goVideo = (courseId: number) => {
  router.push(`/courses/all/view/${courseId}`);
};

const handleSearch = () => {
  filters.page = 1;
  fetchCourses();
};

const changePage = (page: number) => {
  filters.page = page;
  fetchCourses();
};

const handlePerPageChange = (pageSize: number) => {
  filters.pageSize = pageSize;
  filters.page = 1;
  fetchCourses();
};

onMounted(() => {
  fetchCourses();
  fetchEmployeeList();
});
</script>

<style scoped>
.courses-list-card {
  margin-bottom: 25px;
}

.courses-list-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.courses-list-card .card-header .header-left,
.courses-list-card .card-header .header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.courses-list-card .empty-state {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.courses-list-card ::v-deep(.n-pagination) {
  margin-top: 20px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .courses-list-card .card-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .courses-list-card .card-header .header-right {
    width: 100%;
  }

  .courses-list-card .card-header .header-right .n-input {
    flex-grow: 1;
  }
}
</style>
