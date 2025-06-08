<template>
  <div>
    <n-card class="mb-6" :bordered="false">
      <template #header>
        <n-row gutter="12">
          <n-col :span="6">
            <div
              class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <n-select
                v-model:value="filters.eduGroupId"
                :options="courseGroupOptions"
                placeholder="Guruxni tanlang"
                clearable
                @update:value="changeList"
              />
            </div>
          </n-col>
        </n-row>
      </template>

      <n-data-table
        :columns="columns"
        :data="students"
        :loading="loading"
        :pagination="paginationReactive"
        :bordered="false"
        :single-line="false"
        striped
        class="mt-4"
      />
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed, nextTick, h } from "vue";
import {
  NCard,
  NDataTable,
  NSelect,
  NText,
  NButton,
  NRow,
  NCol,
  NIcon,
  type DataTableColumns,
  useMessage,
} from "naive-ui";
import { Eye } from "@vicons/ionicons5";
import EduGroupService from "@/service/document/edugroup.service";
import CourseService from "@/service/document/course.service";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const courseId = Number(route.params.id);

interface Student {
  fullName: string;
  hemisId: string;
  assignedDate: string;
  eduGroup: string;
  submissionLimit: string;
  status: string;
  attemptId: number;
}

const message = useMessage();

const students = ref<Student[]>([]);
const loading = ref(true);
const courseGroupList = ref<any[]>([]);
const totalCount = ref(0);

const filters = reactive({
  page: 1,
  pageSize: 10,
  search: "",
  sortBy: "",
  orderType: "",
  eduGroupId: null,
  lessonTestId: Number(route.query.lessonTestId) || null,
});

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  onChange: (page: number) => {
    filters.page = page;
    paginationReactive.page = page;
    GetList();
  },
  onUpdatePageSize: (pageSize: number) => {
    filters.pageSize = pageSize;
    paginationReactive.pageSize = pageSize;
    filters.page = 1;
    paginationReactive.page = 1;
    GetList();
  },
  prefix: ({ itemCount }: { itemCount: number }) => `Jami: ${itemCount}`,
});

const courseGroupOptions = computed(() => {
  return courseGroupList.value.map((group) => ({
    label: group.text,
    value: group.value,
  }));
});

const columns = computed<DataTableColumns<Student>>(() => [
  {
    title: "FIO",
    key: "fullName",
    minWidth: 200,
  },
  {
    title: "HEMIS external code",
    key: "hemisId",
    minWidth: 150,
  },
  {
    title: "Topshiriq sanasi",
    key: "assignedDate",
    minWidth: 150,
  },
  {
    title: "Gurux",
    key: "eduGroup",
    minWidth: 120,
  },
  {
    title: "Topshirish imkoniyati",
    key: "submissionLimit",
    minWidth: 150,
  },
  {
    title: "Holati",
    key: "status",
    minWidth: 100,
  },
  {
    title: "Natijalar",
    key: "actions",
    width: 100,
    align: "center",
    render: (row: Student) => {
      if (row.attemptId > 0) {
        return h(
          NButton,
          {
            size: "small",
            type: "primary",
            ghost: true,
            onClick: () => viewStudent(row),
          },
          {
            icon: () => h(NIcon, null, { default: () => h(Eye) }),
          }
        );
      }
      return h(NText, { depth: 3 }, { default: () => "-" });
    },
  },
]);

const fetchCourseGroup = async () => {
  try {
    const response = await EduGroupService.GetCourseGroupAsSelectList(courseId);
    courseGroupList.value = response;
  } catch (error) {
    console.error("Error fetching course groups:", error);
  }
};

const viewStudent = (student: Student) => {
  router.push({
    name: "TestResultViewPage",
    query: {
      attemptId: student.attemptId,
      eduGroupId: filters.eduGroupId,
    },
  });
};

const changeList = async () => {
  await nextTick();
  filters.page = 1;
  paginationReactive.page = 1;
  await GetList();
};

const GetList = async () => {
  loading.value = true;
  try {
    const data = await CourseService.GetStudentsForLessonTest(filters);

    students.value = data?.students?.rows || data?.rows || [];
    totalCount.value = data?.students?.count || data?.count || 0;

    paginationReactive.itemCount = totalCount.value;
  } catch (error) {
    console.error("Error fetching students:", error);
    students.value = [];
    totalCount.value = 0;
    paginationReactive.itemCount = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchCourseGroup();
  message.info("Test natijalari yuklanishi uchun guruh tanlang...");
});
</script>
