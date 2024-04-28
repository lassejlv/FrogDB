async function fetcher(
  url: string,
  username: string,
  password: string,
  options?: RequestInit
) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      // Basic auth
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });

  return response;
}

export default fetcher;
