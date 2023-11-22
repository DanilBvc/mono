export const unauthorizedRequest = async (
  url: string,
  method: string,
  body?: object
) => {
  const request: object = body
    ? {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    : {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

  try {
    const response = await fetch(url, request);
    if (response.ok) {
      const responseBody = await response.text();
      return responseBody ? JSON.parse(responseBody) : null;
    } else {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Request failed');
    }
  } catch (err) {
    throw new Error(String(err));
  }
};

export const authorizedRequest = async (
  url: string,
  method: string,
  body?: object,
  tokenType = 'accessToken'
) => {
  const token = localStorage.getItem(tokenType);

  const request: object = body
    ? {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    : {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

  if (!token || token === '') {
    return undefined;
  }
  try {
    const response = await fetch(url, request);
    if (response.ok) {
      const responseBody = await response.text();
      return responseBody ? JSON.parse(responseBody) : null;
    } else {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message || 'Request failed');
    }
  } catch (err) {
    throw new Error(String(err));
  }
};
