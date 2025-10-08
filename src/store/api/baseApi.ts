import axios from 'axios';

const API_BASE_URL = 'https://m312.ru/api/v1/';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // Убираем жестко заданный Content-Type, чтобы axios мог автоматически определять тип контента
});

// Флаг для предотвращения множественных запросов на обновление токена
let isRefreshing = false;
let failedQueue: Array<{ resolve: Function; reject: Function }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor для добавления access токена и настройки заголовков
axiosInstance.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage (zustand persist)
    const accessToken = localStorage.getItem('level_token');
    if (accessToken) {
      try {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }

    // Автоматически определяем Content-Type в зависимости от данных
    if (config.data instanceof FormData) {
      // Для FormData не устанавливаем Content-Type, позволяем браузеру установить его автоматически
      // Это важно для корректной установки boundary
      delete config.headers['Content-Type'];
    } else if (config.data && typeof config.data === 'object') {
      // Для обычных объектов устанавливаем application/json
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor для обработки истекших токенов
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Если токен уже обновляется, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('level_refresh_token');
      if (refreshToken) {
        try {

          if (refreshToken) {
            try {
              // Делаем запрос на обновление токена
              const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
                refresh: refreshToken,
              });

              const { access, refresh } = response.data;

              
              localStorage.setItem('level_token', access);
              localStorage.setItem('level_refresh_token', refresh);

              // Обновляем заголовок в исходном запросе
              originalRequest.headers.Authorization = `Bearer ${access}`;
              
              processQueue(null, access);
              
              return axiosInstance(originalRequest);
            } catch (refreshError) {
              processQueue(refreshError, null);
              
              // Refresh токен тоже истек, очищаем авторизацию
              localStorage.removeItem('level_token');
              window.location.href = '/';
              
              return Promise.reject(refreshError);
            }
          }
        } catch (parseError) {
          console.error('Error parsing auth storage:', parseError);
        }
      }

      // Нет refresh токена, очищаем авторизацию
      localStorage.removeItem('level_token');
      window.location.href = '/';
    }

    isRefreshing = false;
    return Promise.reject(error);
  }
);

export default axiosInstance;