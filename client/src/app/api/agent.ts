import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import router from "../router/Routers";

axios.defaults.baseURL = "http://localhost:5000/api/";

// interceptor
// use method has two params:
// 1. OnFulfilled: when status code in 200 range
// 2. OnRejected: when status code outside 200 range
/*
 * axios interceptor has an feature to caught error,
 * so you still see uncaught error in browser console
 * the end of error journey still using component to catch.
 */
axios.interceptors.response.use(
  async (response) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return response; // response is a Promise.resolve()
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        // because validation error and bad request are 400 error.
        // but validation error has data.error.
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            modelStateErrors.push(data.errors[key]); // it will push array of string
          }
          // throw still print on console
          throw modelStateErrors.flat(); // array of array need flatten
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 404:
        toast.error(data.title);
        router.navigate("/not-found");
        break;
      case 500:
        // if we want navigate to other page when we are not
        // within Component, we can use the navigate function.
        // Meanwhile navigate method can pass props.
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }
    // error is a promise, but we use
    // error.response to unwrap promise.
    // So we need to wrap it as Promise.reject()
    // send promise to next pipeline
    return Promise.reject(error.response);
  },
);

// setting REST request method to make code don't repeat.
const requests = {
  get: (url: string) => axios.get(url).then((res) => res.data),

  post: (url: string, body: object) =>
    axios.post(url, body).then((res) => res.data),

  put: (url: string, body: object) =>
    axios.put(url, body).then((res) => res.data),

  delete: (url: string) => axios.delete(url).then((res) => res.data),
};

// specific for Catalog functionality.
const Catalog = {
  list: () => requests.get("products"),
  detail: (id: number) => requests.get(`products/${id}`),
};

// specific for error testing
const TestError = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorized"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

// put all agent here.
const agent = {
  Catalog,
  TestError,
};

export default agent;