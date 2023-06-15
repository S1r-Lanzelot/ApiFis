export const getApi = async (url, params) => {
  let path = url;

  let query = params;
  if (typeof query === "object") {
    query = new URLSearchParams(params).toString();
  }

  if (query) {
    path += `?${query}`;
  }

  return await handleApiResponse(() => fetch(path));
};

const handleApiResponse = async (apiCall) => {
  let response;
  let result;
  try {
    response = await apiCall();
    result = await response.json();
  } catch (error) {
    console.error(error);
    const httpErr = response?.status ? `HTTP Code: ${response.status}` : "No response";
    throw {
      code: response?.status || 0,
      message: `Sorry, we didn't get a valid response from the server. (${httpErr})`,
      error: `failed request`,
    };
  }

  if (response.status === 200) {
    return result;
  } else if (response.status === 422 && result?.error?.length > 0) {
    throw {
      message: result?.error[0],
      error: "invalid discipline",
    };
  } else if (result.code && result.message && result.error) {
    throw result;
  } else {
    const httpErr = `HTTP Code: ${response.status}`;
    throw {
      code: response.status,
      message: `Sorry, we didn't get a valid response from the server. ${httpErr}`,
      error: "failed request",
    };
  }
};
