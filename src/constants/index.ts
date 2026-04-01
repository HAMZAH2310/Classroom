import { GraduationCap, School } from "lucide-react";

export const USER_ROLES = {
    STUDENT: "student",
    TEACHER: "teacher",
    ADMIN: "admin",
};

export const ROLE_OPTIONS = [
    {
        value: USER_ROLES.STUDENT,
        label: "Student",
        icon: GraduationCap,
    },
    {
        value: USER_ROLES.TEACHER,
        label: "Teacher",
        icon: School,
    },
];

export const DEPARTMENTS = [
    "Informatika",
    "Sistem Informasi",
    "Teknik Komputer",
    "Matematika",
    "Fisika",
    "Kimia",
    "Biologi",
    "Bahasa Inggris",
    "Sejarah",
    "Geografi",
    "Ekonomi",
    "Manajemen",
    "Akuntansi",
    "Teknik Sipil",
    "Teknik Mesin",
    "Teknik Elektro",
    "Psikologi",
    "Sosiologi",
    "Ilmu Politik",
    "Hukum",
] as const;

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes
export const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

const getEnvVar = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const CLOUDINARY_UPLOAD_URL = getEnvVar("VITE_CLOUDINARY_UPLOAD_URL");
export const CLOUDINARY_CLOUD_NAME = getEnvVar("VITE_CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = getEnvVar("VITE_CLOUDINARY_API_KEY");
export const CLOUDINARY_UPLOAD_PRESET = getEnvVar("VITE_CLOUDINARY_UPLOAD_PRESET");
export const BACKEND_BASE_URL = getEnvVar("VITE_BACKEND_URL");

export const BASE_URL = import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

export const teachers = [
    { id: "1", name: "Furina de Fontaine" },
    { id: "2", name: "Neuvillette" },
    { id: "3", name: "Kaedehara Kazuha" },
    { id: "4", name: "Nahida" },
    { id: "5", name: "Raiden Shogun" },
    { id: "6", name: "Zhongli" },
    { id: "7", name: "Wriothesley" },
    { id: "8", name: "Alhaitham" },
    { id: "9", name: "Yae Miko" },
    { id: "10", name: "Jean Gunnhildr" },
    { id: "11", name: "Diluc Ragnvindr" },
    { id: "12", name: "Cyno" },
    { id: "13", name: "Tighnari" },
];

export const subjects = [
    {
        id: 1,
        name: "Mathematics",
        code: "MATH",
    },
    {
        id: 2,
        name: "Computer Science",
        code: "CS",
    },
    {
        id: 3,
        name: "Physics",
        code: "PHY",
    },
    {
        id: 4,
        name: "Chemistry",
        code: "CHEM",
    },
];