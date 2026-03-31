import { DataProvider, GetListParams, GetListResponse, BaseRecord } from "@refinedev/core";
import { Subject } from "../types";

const mockSubjects: Subject[] = [
  {
    id: "1",
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "Computer Science",
    description: "A foundational course covering core concepts of computation, algorithms, and programming paradigms.",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "2",
    code: "MATH201",
    name: "Calculus II",
    department: "Mathematics",
    description: "Continuation of Calculus I, exploring integral calculus, sequences, series, and multivariable functions.",
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "3",
    code: "PHY150",
    name: "Classical Mechanics",
    department: "Physics",
    description: "Covers Newton's laws of motion, energy, momentum, rotational dynamics, and gravitational systems.",
    createdAt: "2026-01-10T08:00:00Z",
  },
];

export const dataProvider: DataProvider = {
  getList: async<TData extends BaseRecord>({ resource }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== 'subjects') {
      return { data: [] as TData[], total: 0 };
    }
    return {
      data: mockSubjects as unknown as TData[],
      total: mockSubjects.length,
    }
  },

  getOne: async () => { throw new Error('This function is not present in mock') },
  create: async () => { throw new Error('This function is not present in mock') },
  update: async () => { throw new Error('This function is not present in mock') },
  deleteOne: async () => { throw new Error('This function is not present in mock') },

  getApiUrl: () => '',
}