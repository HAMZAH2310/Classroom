import { object, string, number, enum as zEnum, array, coerce } from "zod";

export const facultySchema = object({
    name: string().min(2, 'Name must be at least 2 characters'),
    email: string().email(),
    role: zEnum(['admin', 'teacher', 'student']),
    department: string(),
    image: string().optional(),
    imageCldPubId: string().optional(),
});

export const subjectSchema = object({
    name: string().min(3, "Subject name must be at least 3 characters"),
    code: string().min(5, "Subject code must be at least 5 characters"),
    description: string()
        .min(5, "Subject description must be at least 5 characters"),
    department: string()
        .min(2, "Subject department must be at least 2 characters"),
});

const scheduleSchema = object({
    day: string().min(1, "Day is required"),
    startTime: string().min(1, "Start time is required"),
    endTime: string().min(1, "End time is required"),
});

export const classSchema = object({
    name: string()
        .min(2, "Class name must be at least 2 characters")
        .max(50, "Class name must be at most 50 characters"),
    description: string({ required_error: "Description is required" })
        .min(5, "Description must be at least 5 characters"),
    subjectId: coerce
        .number({
            required_error: "Subject is required",
            invalid_type_error: "Subject is required",
        })
        .min(1, "Subject is required"),
    teacherId: string().min(1, "Teacher is required"),
    capacity: coerce
        .number({
            required_error: "Capacity is required",
            invalid_type_error: "Capacity is required",
        })
        .min(1, "Capacity must be at least 1"),
    status: zEnum(["active", "inactive"]),
    bannerUrl: string({ required_error: "Class banner is required" })
        .min(1, "Class banner is required"),
    bannerCldPubId: string({ required_error: "Banner reference is required" })
        .min(1, "Banner reference is required"),
    inviteCode: string().optional(),
    schedules: array(scheduleSchema).optional(),
});

export const enrollmentSchema = object({
    classId: coerce
        .number({
            required_error: "Class ID is required",
            invalid_type_error: "Class ID is required",
        })
        .min(1, "Class ID is required"),
    studentId: string().min(1, "Student ID is required"),
});