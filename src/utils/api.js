import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

export class UnauthorizedError extends Error {
  name = 'Unauthorized Error';
}

async function handleServerResponse(res, action) {
  const dataPromise = res.json();
  if (!res.ok) {
    const message = await dataPromise;
    toast.error(message);
    if (res.status === 401 || res.status === 403) {
      throw new UnauthorizedError();
    }
  }
  else{
    if(action != 'recived')
        toast.success(`Successfuly ${action}`);
  }
  return dataPromise;
}

function getAuthHeader(token) {
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

const commonHeaders = {
  'Content-type': 'application/json',
};

export function getApi(resource) {
  function post(body, options = {}) {
    options.body = JSON.stringify(body);
    options.headers = {
      ...options.headers,
      ...getAuthHeader(options.accessToken),
      ...commonHeaders,
    };
    options.method = 'POST';

    return fetch(`${apiUrl}/${resource}`, options).then((res) => handleServerResponse(res, 'added'));
  }

  function get(search = null, id = null, options = {}) {
    let searchStr = '';
    if (search) {
      searchStr = '?';
      searchStr += new URLSearchParams(search).toString();
    }

    options.headers = {
      ...options.headers,
      ...getAuthHeader(options.accessToken),
    };

    id = id !== null && id !== undefined ? `/${id}` : '';

    delete options.accessToken;

    return fetch(`${apiUrl}/${resource}${id}${searchStr}`, options).then(
        (res) => handleServerResponse(res, 'recived')
    );
  }

  function patch(id, body, options = {}) {
    options.body = JSON.stringify(body);
    options.headers = {
      ...options.headers,
      ...getAuthHeader(options.accessToken),
      ...commonHeaders,
    };
    options.method = 'PATCH';

    return fetch(`${apiUrl}/${resource}/${id}`, options).then(
        (res) => handleServerResponse(res, 'updated')
    );
  }

  function remove(id, options = {}) {
    options.method = 'DELETE';
    options.headers = {
      ...options.headers,
      ...getAuthHeader(options.accessToken),
    };

    return fetch(`${apiUrl}/${resource}/${id}`, options).then(
        (res) => handleServerResponse(res, 'deleted')
    );
  }

  return {
    post,
    get,
    patch,
    remove,
  };
}