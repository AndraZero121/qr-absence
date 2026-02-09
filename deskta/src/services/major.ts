import apiClient from './api';


export interface Major {
    id: number;
    name: string;
    code: string;
    description?: string;
}

export const majorService = {
    /**
     * Get all majors
     */
    async getMajors(): Promise<Major[]> {
        const response = await apiClient.get('majors');
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    },

    /**
     * Create a new major
     */
    async createMajor(data: any): Promise<Major> {
        const response = await apiClient.post('majors', data);
        return response.data;
    },

    /**
     * Update a major
     */
    async updateMajor(id: string | number, data: any): Promise<Major> {
        const response = await apiClient.put(`majors/${id}`, data);
        return response.data;
    },

    /**
     * Delete a major
     */
    async deleteMajor(id: string | number): Promise<void> {
        await apiClient.delete(`majors/${id}`);
    }
};
