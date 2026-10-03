const TOKEN_KEY = "emulk_token";
const USER_KEY = "emulk_user";

export const getSession = () => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const username = sessionStorage.getItem(USER_KEY);
  return token ? { token, username } : null;
};

export const saveSession = ({ token, username }) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, username);
};

export const clearSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const session = getSession();

  let response;
  try {
    response = await fetch(path, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(session ? { Authorization: `Bearer ${session.token}` } : {})
      },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError("Serverga ulanib bo'lmadi. Internetni tekshiring.", 0);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* bo'sh javob */
  }

  if (!response.ok) {
    throw new ApiError(data?.error || "Kutilmagan xatolik yuz berdi.", response.status);
  }
  return data;
}

export const login = (username, password) =>
  request("/api/login", { method: "POST", body: { username, password } });

export const fetchStats = () => request("/api/stats");

export const searchCitizens = (type, value) =>
  request("/api/search", { method: "POST", body: { type, value } });
