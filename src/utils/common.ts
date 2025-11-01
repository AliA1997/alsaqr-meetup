import axios, { AxiosResponse, AxiosError } from 'axios';
import { PaginatedResult } from '../models/common';
import { notificationApiClient } from "./notificationApiClient";
import { userApiClient } from "./userApiClient";
import { messageApiClient } from "./messageApiClient";
import { commentApiClient } from "./commentApiClient";
import { locationApiClient } from './locationApiClient';
import { groupsApiClient } from './groupsApiClient';
import { eventsApiClient } from './eventsApiClient';

export const extractQryParams = (request: any, paramsToExtract: string[]): (string | null)[] => {
  const qryParams = new URL(request.url!).searchParams;

  let results = (paramsToExtract ?? []).map((p: string) => {

    let valToReturn: string | null = '';
    if (p === 'currentPage')
      valToReturn = qryParams.get(p) ?? '1'
    else if (p === 'itemsPerPage')
      valToReturn = qryParams.get(p) ?? '25'
    else
      valToReturn = qryParams.get(p);

    return valToReturn;
  });

  return results;
}

export const axiosResponseBody = (res: AxiosResponse) => res.data;

export const axiosRequests = {
  get: <T>(url: string) => axios.get<T>(url).then(axiosResponseBody),
  post: <T>(url: string, body: {}, options?: {}) =>
    axios.post<T>(url, body, options).then(axiosResponseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(axiosResponseBody),
  patch: <T>(url: string, body: {}) => axios.patch<T>(url, body).then(axiosResponseBody),
  del: <T>(url: string) => axios.delete<T>(url).then(axiosResponseBody),
};

axios.interceptors.response.use(
  async (response) => {
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResult(
        response.data,
        JSON.parse(pagination)
      );
      return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
  },
  (error: AxiosError) => {
    const myResponse = error.response as AxiosResponse;
    const modalStateErrors = [];
    if (!myResponse?.status) {
      return Promise.reject("Error");
    }

    switch (myResponse.status) {
      case 400:
        if (
          myResponse.config.method === "get" &&
          myResponse.data.errors.hasOwnProperty("id")
        ) {
          console.log("Not found")
        }
        if (myResponse.data.errors) {
          for (const key in myResponse.data.errors) {
            if (myResponse.data.errors[key]) {
              modalStateErrors.push(
                'Errors'
              );
            }
          }
          throw modalStateErrors.flat();
        } else {
          console.log("Not found, alot of problems.")
        }
        break;
      case 401:

        if (myResponse.data === "invalid_token") {
          console.log("Invalid Token");
        } else {
          console.log("Authorization Error");
        }
        break;
      case 403:
        console.log("Oops their is a problem");
        break;
      case 404:
        console.log("Not found");
        break;
      case 500:
        console.log("Server error")
        break;
      default:
        console.log("A unique issue.")
        break;
    }

    return Promise.reject(error);
  }
);


const agent = {
  commentApiClient,
  groupsApiClient,
  eventsApiClient,
  locationApiClient,
  messageApiClient,
  notificationApiClient,
  userApiClient
};

export function leadingDebounce<F extends (...args: any[]) => any>(
  func: F,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  // alert(timeoutId)
  if (!timeoutId) {
    func();
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    timeoutId = null;
  }, delay);
}

export default agent;