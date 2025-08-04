export const login = (
  credentials: { username: string; password: string },
  acceptLanguage: string,
) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Accept-Language': acceptLanguage,
    },
    body: JSON.stringify(credentials),
  });
};
