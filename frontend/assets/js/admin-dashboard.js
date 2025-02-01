class AdminDashboard {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
        this.statsContainer = document.getElementById('dashboardStats');
        this.recentUsersContainer = document.getElementById('recentUsers');
        this.recentJobsContainer = document.getElementById('recentJobs');
        this.recentApplicationsContainer = document.getElementById('recentApplications');
        this.userRolesContainer = document.getElementById('userRoles');

        this.checkAdminAccess();
        this.loadDashboardData();
    }

    checkAdminAccess() {
        if (!window.auth.isAuthenticated()) {
            window.location.href = '../login.html';
            return;
        }

        const user = window.auth.getUser();
        if (!user.roles.includes('admin')) {
            window.location.href = '../error.html';
            return;
        }
    }

    async loadDashboardData() {
        try {
            const response = await fetch(`${this.baseURL}/admin/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${window.auth.getToken()}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch dashboard data');
            }

            this.displayDashboardData(data.stats);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError(error.message);
        }
    }

    displayDashboardData(stats) {
        // Display counts
        this.statsContainer.innerHTML = `
            <div class="row">
                <div class="col-md-4">
                    <div class="card bg-primary text-white mb-4">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-people me-2"></i>Total Users
                            </h5>
                            <h2>${stats.counts.users || 0}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white mb-4">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-briefcase me-2"></i>Total Jobs
                            </h5>
                            <h2>${stats.counts.jobs || 0}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-info text-white mb-4">
                        <div class="card-body">
                            <h5 class="card-title">
                                <i class="bi bi-file-text me-2"></i>Total Applications
                            </h5>
                            <h2>${stats.counts.applications || 0}</h2>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Display recent users with actions
        this.recentUsersContainer.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0"><i class="bi bi-people me-2"></i>Recent Users</h5>
                    <button class="btn btn-sm btn-primary" onclick="window.adminDashboard.refreshData()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Refresh
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.recentUsers && stats.recentUsers.length > 0 ? 
                                    stats.recentUsers.map(user => `
                                        <tr>
                                            <td>${user?.username || 'N/A'}</td>
                                            <td>${user?.email || 'N/A'}</td>
                                            <td>${user?.roles?.join(', ') || 'N/A'}</td>
                                            <td>${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary me-1" onclick="window.adminDashboard.editUser('${user?._id}')">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" onclick="window.adminDashboard.deleteUser('${user?._id}')">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('') : 
                                    '<tr><td colspan="5" class="text-center">No users found</td></tr>'
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Display recent jobs with actions
        this.recentJobsContainer.innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0"><i class="bi bi-briefcase me-2"></i>Recent Jobs</h5>
                    <button class="btn btn-sm btn-primary" onclick="window.adminDashboard.refreshData()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Refresh
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Company</th>
                                    <th>Posted By</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.recentJobs && stats.recentJobs.length > 0 ? 
                                    stats.recentJobs.map(job => `
                                        <tr>
                                            <td>${job?.title || 'N/A'}</td>
                                            <td>${job?.company || 'N/A'}</td>
                                            <td>${job?.postedBy?.username || 'N/A'}</td>
                                            <td>
                                                <span class="badge bg-${job?.status === 'active' ? 'success' : 'secondary'}">
                                                    ${job?.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary me-1" onclick="window.adminDashboard.editJob('${job?._id}')">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-sm btn-outline-danger" onclick="window.adminDashboard.deleteJob('${job?._id}')">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('') :
                                    '<tr><td colspan="5" class="text-center">No jobs found</td></tr>'
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        // Display user roles distribution with null check
        this.userRolesContainer.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0"><i class="bi bi-pie-chart me-2"></i>User Roles Distribution</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${stats.userRoles && stats.userRoles.length > 0 ? 
                                    stats.userRoles.map(role => `
                                        <tr>
                                            <td>${role?._id || 'N/A'}</td>
                                            <td>${role?.count || 0}</td>
                                        </tr>
                                    `).join('') :
                                    '<tr><td colspan="2" class="text-center">No role data available</td></tr>'
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    showError(message) {
        const alertHtml = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${message || 'Failed to load dashboard data. Please try again later.'}
            </div>
        `;
        
        this.statsContainer.innerHTML = alertHtml;
        this.recentUsersContainer.innerHTML = '';
        this.recentJobsContainer.innerHTML = '';
        this.recentApplicationsContainer.innerHTML = '';
        this.userRolesContainer.innerHTML = '';
    }

    async editUser(userId) {
        try {
            const user = await this.fetchUser(userId);
            if (!user) return;

            const newRole = prompt('Enter new role (job_seeker, job_poster):', user.roles[0]);
            if (!newRole) return;

            const response = await fetch(`${this.baseURL}/admin/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.auth.getToken()}`
                },
                body: JSON.stringify({ roles: [newRole] })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert('User updated successfully');
            this.loadDashboardData();
        } catch (error) {
            console.error('Error updating user:', error);
            alert(error.message);
        }
    }

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`${this.baseURL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${window.auth.getToken()}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert('User deleted successfully');
            this.loadDashboardData();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.message);
        }
    }

    async editJob(jobId) {
        try {
            const job = await this.fetchJob(jobId);
            if (!job) return;

            const newStatus = prompt('Enter new status (active, closed):', job.status);
            if (!newStatus) return;

            const response = await fetch(`${this.baseURL}/admin/jobs/${jobId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.auth.getToken()}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert('Job updated successfully');
            this.loadDashboardData();
        } catch (error) {
            console.error('Error updating job:', error);
            alert(error.message);
        }
    }

    async deleteJob(jobId) {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const response = await fetch(`${this.baseURL}/admin/jobs/${jobId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${window.auth.getToken()}`
                }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert('Job deleted successfully');
            this.loadDashboardData();
        } catch (error) {
            console.error('Error deleting job:', error);
            alert(error.message);
        }
    }

    async refreshData() {
        await this.loadDashboardData();
    }

    async fetchUser(userId) {
        try {
            const response = await fetch(`${this.baseURL}/admin/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${window.auth.getToken()}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data.user;
        } catch (error) {
            console.error('Error fetching user:', error);
            alert(error.message);
            return null;
        }
    }

    async fetchJob(jobId) {
        try {
            const response = await fetch(`${this.baseURL}/admin/jobs/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${window.auth.getToken()}`
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data.job;
        } catch (error) {
            console.error('Error fetching job:', error);
            alert(error.message);
            return null;
        }
    }
}

// Make the instance globally available
window.adminDashboard = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
}); 