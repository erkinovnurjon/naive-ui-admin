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
          @update:value="fetchCourses"
        >
          <template #arrow>
            <i class="flaticon-down-arrow fs-12"></i>
          </template>
        </n-select>
      </div>
      <div class="header-right">
        <n-button
          type="primary"
          @click="router.push('/courses/edit/0')"
          class="me-2"
        >
          <template #icon>
            <i class="flaticon-plus"></i>
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
            <i class="flaticon-search-interface-symbol"></i>
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
          <i class="flaticon-search-interface-symbol fs-4"></i>
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
import { ref, reactive, computed, onMounted, h } from "vue";
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

const actionOptions = [
  {
    label: "Tahrirlash",
    key: "edit",
    icon: () => h(EditIcon, { class: "text-base" }),
  },
  {
    label: "Ko'rish",
    key: "view",
    icon: () => h(EyeIcon, { class: "text-base" }),
  },
  {
    label: "O'chirish",
    key: "delete",
    icon: () => h(DeleteIcon, { class: "text-base" }),
  },
];
const dropdownCourseId = ref<number | null>(null);
const filters = reactive({
  page: 1,
  pageSize: 10,
  search: "",
  sortBy: "",
  orderType: "asc",
  employeeId: null as number | null,
});

const totalCourses = ref(0);
const totalPages = computed(() => {
  return Math.ceil(totalCourses.value / filters.pageSize) || 0;
});

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
            : h(SettingsIcon, { class: "text-blue-600 text-xl" }) // default icon
        ),
        h("div", null, [
          h(
            "a",
            {
              class: "no-underline font-bold text-gray-800 hover:underline",
              onClick: () => editCourse(row.id),
              style: "cursor: pointer",
            },
            row.title
          ),
          h("div", { class: "flex items-center text-gray-500 mt-1 text-sm" }, [
            h(BookIcon, { class: "text-blue-600 mr-2 text-base" }),
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
        h(PersonIcon, { class: "text-blue-600 text-xl" }),
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
                icon: () => h(DotsIcon, { class: "text-gray-600" }),
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
  router.push(`/courses/edit/${id}`);
};

const goVideo = (courseId: number) => {
  router.push(`/courses/view/${courseId}`);
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

// Lifecycle hooks
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

.courses-list-card .course-thumbnail {
  width: 90px;
  height: 60px;
  overflow: hidden;
  border-radius: 6px;
  flex-shrink: 0;
  background-color: #f2f2f2;
}

.courses-list-card .course-thumbnail .thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.courses-list-card .empty-state {
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Naive UI pagination modifier */
.courses-list-card ::v-deep(.n-pagination) {
  margin-top: 20px;
  justify-content: flex-end;
}

.dropdown-menu {
  display: none;
  position: absolute;
  right: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  z-index: 1000;
  min-width: 150px;
}

.dropdown-menu .dropdown-item {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--n-text-color);
  text-decoration: none;
}

.dropdown-menu .dropdown-item:hover {
  background-color: #f5f5f5;
}

/* Dropdown show on hover */
::v-deep(.n-button[text]:hover) .dropdown-menu {
  display: block;
}
</style>
