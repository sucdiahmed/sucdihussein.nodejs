class AdminReports {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.checkAdminAuth();
        this.loadDashboardData();
        this.loadUsers();
        this.loadJobs();
    }

    checkAdminAuth() {
        if (!auth.isAuthenticated()) {
            window.location.href = '../login.html';
            return;
        }

        const user = auth.getUser();
        if (user.role !== 'admin') {
            window.location.href = '../index.html';
        }
    }

    async loadDashboardData() {
        try {
            const response = await fetch(`${this.baseURL}/admin/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Update statistics
            document.getElementById('totalUsers').textContent = data.totalUsers;
            document.getElementById('activeJobs').textContent = data.activeJobs;
            document.getElementById('totalApplications').textContent = data.totalApplications;
            document.getElementById('newUsers').textContent = data.newUsers;

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            alert('Failed to load dashboard data');
        }
    }

    async loadUsers() {
        try {
            const response = await fetch(`${this.baseURL}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            const users = await response.json();

            if (!response.ok) {
                throw new Error(users.message);
            }

            const usersList = document.getElementById('usersList');
            usersList.innerHTML = users.map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <select class="form-select form-select-sm" 
                                onchange="adminReports.updateUserRole('${user._id}', this.value)">
                            <option value="job_seeker" ${user.role === 'job_seeker' ? 'selected' : ''}>
                                Job Seeker
                            </option>
                            <option value="job_poster" ${user.role === 'job_poster' ? 'selected' : ''}>
                                Job Poster
                            </option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>
                                Admin
                            </option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" 
                                onclick="adminReports.deleteUser('${user._id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading users:', error);
            document.getElementById('usersList').innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger">
                        Failed to load users
                    </td>
                </tr>
            `;
        }
    }

    async loadJobs() {
        try {
            const response = await fetch(`${this.baseURL}/admin/jobs`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            const jobs = await response.json();

            if (!response.ok) {
                throw new Error(jobs.message);
            }

            const jobsList = document.getElementById('jobsList');
            jobsList.innerHTML = jobs.map(job => `
                <tr>
                    <td>${job.title}</td>
                    <td>${job.company}</td>
                    <td>
                        <select class="form-select form-select-sm" 
                                onchange="adminReports.updateJobStatus('${job._id}', this.value)">
                            <option value="active" ${job.status === 'active' ? 'selected' : ''}>
                                Active
                            </option>
                            <option value="inactive" ${job.status === 'inactive' ? 'selected' : ''}>
                                Inactive
                            </option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" 
                                onclick="adminReports.deleteJob('${job._id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error loading jobs:', error);
            document.getElementById('jobsList').innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger">
                        Failed to load jobs
                    </td>
                </tr>
            `;
        }
    }

    async updateUserRole(userId, newRole) {
        try {
            const response = await fetch(`${this.baseURL}/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert('User role updated successfully');
            this.loadUsers();

        } catch (error) {
            console.error('Error updating user role:', error);
            alert(error.message || 'Failed to update user role');
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert('User deleted successfully');
            this.loadDashboardData();
            this.loadUsers();

        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.message || 'Failed to delete user');
        }
    }

    async updateJobStatus(jobId, newStatus) {
        try {
            const response = await fetch(`${this.baseURL}/admin/jobs/${jobId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert('Job status updated successfully');
            this.loadJobs();
            this.loadDashboardData();

        } catch (error) {
            console.error('Error updating job status:', error);
            alert(error.message || 'Failed to update job status');
        }
    }

    async deleteJob(jobId) {
        if (!confirm('Are you sure you want to delete this job?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/admin/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            alert('Job deleted successfully');
            this.loadDashboardData();
            this.loadJobs();

        } catch (error) {
            console.error('Error deleting job:', error);
            alert(error.message || 'Failed to delete job');
        }
    }

    exportUsers() {
        // Implement CSV export for users
        this.exportToCSV('users');
    }

    exportJobs() {
        // Implement CSV export for jobs
        this.exportToCSV('jobs');
    }

    async exportToCSV(type) {
        try {
            const response = await fetch(`${this.baseURL}/admin/export/${type}`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_report.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

        } catch (error) {
            console.error(`Error exporting ${type}:`, error);
            alert(`Failed to export ${type}`);
        }
    }
}

const adminReports = new AdminReports(); 