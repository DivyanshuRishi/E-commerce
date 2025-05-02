// import { toast } from "react-hot-toast";
// import { create } from "zustand";
// import axios from "../lib/axios";

// export const useUserStore = create((set, get) => ({
// 	user: null,
// 	loading: false,
// 	checkingAuth: true,

// 	signup: async ({ name, email, password, confirmPassword }) => {
// 		set({ loading: true });

// 		if (password !== confirmPassword) {
// 			set({ loading: false });
// 			return toast.error("Passwords do not match");
// 		}

// 		try {
// 			const res = await axios.post("/auth/signup", { name, email, password });
// 			set({ user: res.data, loading: false });
// 		} catch (error) {
// 			set({ loading: false });
// 			toast.error(error.response.data.message || "An error occurred");
// 		}
// 	},
// 	login: async (email, password) => {
// 		set({ loading: true });

// 		try {
// 			const res = await axios.post("/auth/login", { email, password });

// 			set({ user: res.data, loading: false });
// 		} catch (error) {
// 			set({ loading: false });
// 			toast.error(error.response.data.message || "An error occurred");
// 		}
// 	},

// 	logout: async () => {
// 		try {
// 			await axios.post("/auth/logout");
// 			set({ user: null });
// 		} catch (error) {
// 			toast.error(error.response?.data?.message || "An error occurred during logout");
// 		}
// 	},

// 	checkAuth: async () => {
// 		set({ checkingAuth: true });
// 		try {
// 			const response = await axios.get("/auth/profile");
// 			set({ user: response.data, checkingAuth: false });
// 		} catch (error) {
// 			console.error('Error during authentication check:', error.response ? error.response.data : error.message);
// 			set({ checkingAuth: false, user: null });
// 		}
// 	},
	

// 	refreshToken: async () => {
// 		// Prevent multiple simultaneous refresh attempts
// 		if (get().checkingAuth) return;

// 		set({ checkingAuth: true });
// 		try {
// 			const response = await axios.post("/auth/refresh-token");
// 			set({ checkingAuth: false });
// 			return response.data;
// 		} catch (error) {
// 			set({ user: null, checkingAuth: false });
// 			throw error;
// 		}
// 	},
// }));

// // TODO: Implement the axios interceptors for refreshing access token

// // Axios interceptor for token refresh
// let refreshPromise = null;

// axios.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 		const originalRequest = error.config;
// 		if (error.response?.status === 401 && !originalRequest._retry) {
// 			originalRequest._retry = true;

// 			try {
// 				// If a refresh is already in progress, wait for it to complete
// 				if (refreshPromise) {
// 					await refreshPromise;
// 					return axios(originalRequest);
// 				}

// 				// Start a new refresh process
// 				refreshPromise = useUserStore.getState().refreshToken();
// 				await refreshPromise;
// 				refreshPromise = null;

// 				return axios(originalRequest);
// 			} catch (refreshError) {
// 				// If refresh fails, redirect to login or handle as needed
// 				useUserStore.getState().logout();
// 				return Promise.reject(refreshError);
// 			}
// 		}
// 		return Promise.reject(error);
// 	}
// );







import { toast } from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,

    setAccessToken: (token) => {
        set({ accessToken: token });
        if (token) localStorage.setItem('accessToken', token);
        else localStorage.removeItem('accessToken');
    },
    setRefreshToken: (token) => {
        set({ refreshToken: token });
        if (token) localStorage.setItem('refreshToken', token);
        else localStorage.removeItem('refreshToken');
    },

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });

        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axios.post("/auth/signup", { name, email, password });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },
    login: async (email, password) => {
        set({ loading: true });

        try {
            const res = await axios.post("/auth/login", { email, password });
            set({
                user: res.data.user,
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken,
                loading: false,
            });
            get().setAccessToken(res.data.accessToken);
            get().setRefreshToken(res.data.refreshToken);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null, accessToken: null, refreshToken: null });
            get().setAccessToken(null);
            get().setRefreshToken(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile", {
                headers: {
                    Authorization: `Bearer ${get().accessToken}`,
                },
            });
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            console.error('Error during authentication check:', error.response ? error.response.data : error.message);
            set({ checkingAuth: false, user: null, accessToken: null, refreshToken: null });
            get().setAccessToken(null);
            get().setRefreshToken(null);
        }
    },


    refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().checkingAuth || !get().refreshToken) return;

        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token", {
                refreshToken: get().refreshToken,
            });
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            set({ accessToken: newAccessToken, refreshToken: newRefreshToken, checkingAuth: false });
            get().setAccessToken(newAccessToken);
            get().setRefreshToken(newRefreshToken);
            return newAccessToken;
        } catch (error) {
            set({ user: null, accessToken: null, refreshToken: null, checkingAuth: false });
            get().setAccessToken(null);
            get().setRefreshToken(null);
            toast.error("Session expired, please login again.");
            return Promise.reject(error);
        }
    },
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const userStore = useUserStore.getState();

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // If a refresh is already in progress, wait for it to complete
                if (refreshPromise) {
                    const newAccessToken = await refreshPromise;
                    if (newAccessToken) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axios(originalRequest);
                    }
                    userStore.logout();
                    return Promise.reject(error);
                }

                // Start a new refresh process
                refreshPromise = userStore.refreshToken();
                const newAccessToken = await refreshPromise;
                refreshPromise = null;

                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                } else {
                    userStore.logout();
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                // If refresh fails, redirect to login or handle as needed
                userStore.logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Request interceptor to add the access token to every request
axios.interceptors.request.use(
    (config) => {
        const accessToken = useUserStore.getState().accessToken;
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);