import { createContext, useEffect, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to handle API errors consistently
    const handleApiError = (error) => {
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        return error.message || "An unexpected error occurred";
    };

    // Check if user is authenticated and if so, set the user data and connect the socket
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            toast.error("Unauthorized: " + errorMessage);
            // Clear invalid token
            localStorage.removeItem("token");
            setToken(null);
            delete axios.defaults.headers.common["token"];
        } finally {
            setIsLoading(false);
        }
    };

    // Login function to handle user authentication and socket connection
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
                return { success: true };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    // Logout function to handle user logout and socket disconnection
    const logout = async () => {
        try {
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
            setOnlineUsers([]);
            delete axios.defaults.headers.common["token"];
            
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Update profile function to handle profile updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put("/api/auth/update-profile", body);
            if (data.success) {
                setAuthUser(data.user);
                toast.success("Profile updated successfully");
                return { success: true };
            } else {
                const errorMessage = data.message || "Profile update failed";
                toast.error(errorMessage);
                return { success: false, message: errorMessage };
            }
        } catch (error) {
            const errorMessage = handleApiError(error);
            toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    };

    // Connect socket function to handle socket connection and online users update
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        
        try {
            const newSocket = io(backendUrl, {
                query: {
                    userId: userData._id
                }
            });
            
            newSocket.connect();
            setSocket(newSocket);

            newSocket.on("getOnlineUsers", (userIds) => {
                setOnlineUsers(userIds);
            });

            newSocket.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
            });

        } catch (error) {
            console.error("Socket connection failed:", error);
        }
    };

    // Set up axios interceptor for token
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth();
    }, []);

    // Cleanup socket on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
        isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};