export default async function fetcher(...args) {
  try {
    const response = await fetch(...args);
    const data = await response?.json();

    if (response?.ok) {
      return data;
    }

    const error = new Error(response?.statusText);
    error.response = response;
    error.body = data;

    throw error;
  } catch (error) {
    if (!error.body) {
      error.body = { message: error.message };
    }
    throw error;
  }
}
