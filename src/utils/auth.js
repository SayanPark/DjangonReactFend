import { useAuthStore } from "../store/auth";
import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
});

export const login = async (identifier, password) => {
    try {
        const payload = identifier.includes("@")
            ? { email: identifier, password }
            : { username: identifier, password };

        const { data, status } = await axios.post("user/token/", payload);

        if (status === 200) {
            setAuthUser(data.access, data.refresh);

            Toast.fire({
                icon: "success",
                title: "خوش آمدید",
            });
        }

        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response?.data?.detail || error.message || " خطا ",
        };
    }
};

export const register = async (full_name, email, password, password2) => {
    try {
        const username = email.split("@")[0];

        const { data } = await axios.post("user/register/", {
            username,
            full_name,
            email,
            password,
            password2,
        });

        await login(email, password);

        Toast.fire({
            icon: "success",
            title: "خوش آمدید",
        });

        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response.data || "خطا",
        };
    }
};

export const logout = (showToast = true) => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    useAuthStore.getState().setUser(null);

    if (showToast) {
        Toast.fire({
            icon: "success",
            title: "شما خارج شدید",
        });
    }
};

export const setUser = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");

    if (!accessToken || !refreshToken) {
        return;
    }

    try {
        if (isAccessTokenExpired(accessToken)) {
            const response = await getRefreshToken(refreshToken);
            setAuthUser(response.access, response.refresh);
        } else {
            setAuthUser(accessToken, refreshToken);
        }
    } catch (error) {
        logout(false);
    }
};

export const setAuthUser = (access_token, refresh_token) => {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    Cookies.set("access_token", access_token, {
        expires: 1,
        path: "/",
        sameSite: "Lax",
        secure: !isLocalhost,
    });

    Cookies.set("refresh_token", refresh_token, {
        expires: 7,
        path: "/",
        sameSite: "Lax",
        secure: !isLocalhost,
    });

    const user = jwtDecode(access_token) ?? null;

    if (user) {
        useAuthStore.getState().setUser(user);
    }
    useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
    const refresh_token = Cookies.get("refresh_token");
    const response = await axios.post("user/token/refresh/", {
        refresh: refresh_token,
    });
    return response.data;
};

export const isAccessTokenExpired = (accessToken) => {
    try {
        const decodedToken = jwtDecode(accessToken);
        return decodedToken.exp < Date.now() / 1000;
    } catch (err) {
        return true;
    }
};

export const createAccount = async (formData) => {
    try {
        const { data, status } = await axios.post("user/register/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (status === 201 || status === 200) {
            return { data, error: null };
        } else {
            return { data: null, error: "خطا در ایجاد حساب کاربری" };
        }
    } catch (error) {
        return {
            data: null,
            error: error.response?.data || error.message || "خطا در ایجاد حساب کاربری",
        };
    }
};

export const sendSignupEmail = async (email) => {
    try {
        const { data, status } = await axios.post("user/send-signup-email/", { email });
        if (status === 200) {
            return { data, error: null };
        } else {
            return { data: null, error: "خطا در ارسال ایمیل تایید" };
        }
    } catch (error) {
        return {
            data: null,
            error: error.response?.data?.detail || error.message || "خطا در ارسال ایمیل تایید",
        };
    }
};

export const updateUserProfile = async (userId, formData) => {
    try {
        const { data, status } = await axios.put(`user/${userId}/profile/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if (status === 200) {
            return { data, error: null };
        } else {
            return { data: null, error: "خطا در به‌روزرسانی پروفایل" };
        }
    } catch (error) {
        return {
            data: null,
            error: error.response?.data || error.message || "خطا در به‌روزرسانی پروفایل",
        };
    }
};
