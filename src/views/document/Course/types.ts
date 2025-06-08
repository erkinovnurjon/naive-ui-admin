export interface VideoFile {
  id: number;
  fileName: string;
  fileExtension: string;
  fileSize: number;
  segmentCount: number;
  duration: number;
  videoLessonId?: number;
  playlistId: string;
  originalVideoId: string;
  proccessId: number;
  statusId: number;
  createdDate?: string;
}

export interface VideoLessonMaterial {
  id?: number;
  ownerId: number;
  orderNumber: number;
  fileName: string;
  fileExtension: string;
  fileSize: number;
  fileId: string;
  details: string;
  createdDate?: string;
}

export interface VideoLesson {
  currentIndex?: number;
  title: string | null;
  details: string;
  duration: number;
  orderNumber: number;
  thumbnailId: string | null;
  topicId?: number;
  videoFiles: any;
  videoLessonMaterials: any;
  videoFile?: File | null;
  materialFiles?: File[];
  materialFileIds?: MaterialFileInfo[];
  thumbnailFile?: File | null;
  mediaGroups: MediaGroup[];
  _editIndex?: number | null;
}

export interface MaterialFileInfo {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileExtension: string;
}

export interface MediaGroup {
  videoFile?: any;
  videoFiles?: VideoFile[];
  thumbnailFile?: File | null;
  thumbnailId?: string | null;
  materialFiles?: File[] | null;
  fileId?: string | null;
  originalVideoId?: string | null;
  materialFileIds?: MaterialFileInfo[];
  isVideoUploading?: boolean;
}

export interface LessonTestQuestionAnswer {
  id?: number;
  answerText: string;
  isCorrect: boolean;
  ownerId: number;
  createdAt?: string;
}

export interface QuestionFile {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileExtension: string;
}

export interface LessonTestQuestion {
  id?: number;
  orderNumber?: number;
  questionText: string;
  questionDuration: number;
  ownerId: number;
  thumbnailId?: string | null;
  materialFiles?: File[];
  thumbnailFile?: File | null;
  mediaGroups: MediaGroup[];
  file?: QuestionFile | null;
  lessonTestQuestionAnswers: LessonTestQuestionAnswer[];
}

export interface LessonTest {
  id?: number;
  orderNumber: number;
  title: string | null;
  details: string;
  maxQuestionCount: number;
  submissionLimit: number;
  statusId: number;
  topicId?: number;
  testTypeId: number;
  testThumbnailId: string | null;
  testFileId?: string | null;
  testImageId?: string | null;
  totalDuration: number;
  maxRetryCount?: number | null;
  attemptCount?: number | null;
  canRetry: boolean;
  lessonTestQuestions: LessonTestQuestion[];
  testFile?: File | null;
  testImage?: File | null;
  _editIndex?: number | null | undefined;
}

export interface CourseTopic {
  id?: number;
  title: string | null;
  courseId?: number;
  videoLessons: VideoLesson[];
  lessonTests: LessonTest[];
  lessonReadings?: any;
  lessonPractices?: any;
  lessonResources?: any;
}

export interface CourseData {
  id?: number;
  title?: string | null;
  details?: string | null;
  thumbnailId?: string | null;
  duration?: number;
  employeeId?: number;
  entityName?: string;
  organizationId?: number;
  eduSubjectId?: number;
  statusId?: number;
  languageId?: number | null;
  avarageRating?: number;
  learnerCount?: number;
  state?: string | null;
  topicCount?: number;
  lessonCount?: number;
  testCount?: number;
  createdDate?: string;
  courseTopics?: CourseTopic[];
  courseSyllabuses?: any;
  isSequentialContent?: boolean;
}
