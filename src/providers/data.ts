import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { GetOneResponse, HttpError } from "@refinedev/core";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request Failed';

  try {
    const payload = (await response.json()) as { error?: string; message?: string }

    if (payload?.error) message = payload.error;
    else if (payload?.message) message = payload.message;

  } catch {

  }
  return {
    message,
    statusCode: response.status,
    errors: {}
  }
}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : '';
        const value = String(filter.value)

        if (resource === 'subjects') {
          if (field === 'department') params.department = value;
          if (field === 'name' || field === 'code') params.search = value;
        }

        if (resource === 'classes') {
          if (field === 'subject') params.subject = value;
          if (field === 'teacher') params.teacher = value;
          if (field === 'name') params.search = value;
          if (field === 'status') params.status = value;
        }

        if (resource === 'users') {
          if (field === 'role') params.role = value;
          if (field === 'name' || field === 'email') params.search = value;
        }

        if (resource === 'departments') {
          if (field === 'name' || field === 'code') params.search = value;
        }

        if (resource === 'enrollments') {
          if (field === 'classId') params.classId = value;
          if (field === 'studentId') params.studentId = value;
        }
      })

      return params;
    },

    mapResponse: async (response) => {

      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    }
  },
  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const json: GetOneResponse = await response.json();

      return json.data ?? [];
    }
  },
  create: {
    getEndpoint: ({ resource }) => resource,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const json = await response.json();
      return json.data ?? json;
    }
  },
  update: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const json = await response.json();
      return json.data ?? json;
    }
  },
  deleteOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const json = await response.json();
      return json.data ?? json;
    }
  }
}

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options)

export { dataProvider }