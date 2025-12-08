import axiosInstance from '../api/axiosInstance';
import Swal from "sweetalert2";

export const logout = async () => {

    Swal.fire({
        icon: 'question',
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#0f766e',
        cancelButtonColor: '#6b7280'
    }).then((result) => {
        if (result.isConfirmed) {
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    axiosInstance.post(`auth/logout?refreshToken=${refreshToken}`);
                    localStorage.clear();
                    window.location.href = '/login';
                } catch (error) {
                    console.error('Logout error:', error);
                }
            }
        }
    });
};
