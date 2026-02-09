import apiClient from './api';
import { API_ENDPOINTS, TOKEN_KEY } from '../utils/constants';
import type { LoginRequest, LoginResponse, User } from '../types/api';

export const authService = {
    /**
     * Login user and store token
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>(
            API_ENDPOINTS.AUTH_LOGIN,
            credentials
        );

        const { token } = response.data;

        // Store token in localStorage
        this.setToken(token);

        return response.data;
    },

    /**
     * Logout user and clear token
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post(API_ENDPOINTS.AUTH_LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local data even if API call fails
            this.removeToken();
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_data');
            localStorage.removeItem('selectedRole');
            sessionStorage.clear();
        }
    },

    /**
     * Get current user data
     */
    async getMe(): Promise<User> {
        const response = await apiClient.get<User>(API_ENDPOINTS.ME);
        return response.data;
    },

    /**
     * Get stored token
     */
    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Store token
     */
    setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    },

    /**
     * Remove token
     */
    removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};
