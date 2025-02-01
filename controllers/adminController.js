const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

const adminController = {
    async getDashboardStats(req, res) {
        try {
            // Check if user is admin
            if (!req.user.roles.includes('admin')) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Get counts
            const userCount = await User.countDocuments();
            const jobCount = await Job.countDocuments();
            const applicationCount = await Application.countDocuments();

            // Get recent users
            const recentUsers = await User.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('-password');

            // Get recent jobs
            const recentJobs = await Job.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('postedBy', 'username email');

            // Get recent applications
            const recentApplications = await Application.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('jobId')
                .populate('applicant', 'username email');

            // Get user role distribution
            const userRoles = await User.aggregate([
                {
                    $unwind: '$roles'
                },
                {
                    $group: {
                        _id: '$roles',
                        count: { $sum: 1 }
                    }
                }
            ]);

            res.json({
                success: true,
                stats: {
                    counts: {
                        users: userCount,
                        jobs: jobCount,
                        applications: applicationCount
                    },
                    recentUsers,
                    recentJobs,
                    recentApplications,
                    userRoles
                }
            });
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            res.status(500).json({ 
                message: 'Error fetching dashboard data',
                error: error.message 
            });
        }
    },

    // User Management
    async getUser(req, res) {
        try {
            if (!req.user.roles.includes('admin')) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ success: true, user });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Error fetching user', error: error.message });
        }
    },

    async updateUser(req, res) {
        try {
            if (!req.user.roles.includes('admin')) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const { roles } = req.body;
            if (!roles || !Array.isArray(roles)) {
                return res.status(400).json({ message: 'Invalid roles data' });
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                { roles },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ success: true, user });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Error updating user', error: error.message });
        }
    },

    async deleteUser(req, res) {
        try {
            if (!req.user.roles.includes('admin')) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Error deleting user', error: error.message });
        }
    },

    // Job Management
    async getJob(req, res) {
        try {
            if (!req.user.roles.includes('admin')) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const job = await Job.findById(req.params.id).populate('postedBy', 'username email');
            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            res.json({ success: true, job });
        } catch (error) {
            console.error('Error fetching job:', error);
            res.status(500).json({ message: 'Error fetching job', error: error.message });
        }
    },

    async updateJob(req, res) {
        try {
            if (!req.user.roles.includes('admin')) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const { status } = req.body;
            if (!status || !['active', 'closed'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            const job = await Job.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true }
            ).populate('postedBy', 'username email');

            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            res.json({ success: true, job });
        } catch (error) {
            console.error('Error updating job:', error);
            res.status(500).json({ message: 'Error updating job', error: error.message });
        }
    },

    async deleteJob(req, res) {
        try {
            if (!req.user.roles.includes('admin')) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const job = await Job.findByIdAndDelete(req.params.id);
            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }

            // Also delete related applications
            await Application.deleteMany({ jobId: req.params.id });

            res.json({ success: true, message: 'Job and related applications deleted successfully' });
        } catch (error) {
            console.error('Error deleting job:', error);
            res.status(500).json({ message: 'Error deleting job', error: error.message });
        }
    }
};

module.exports = adminController; 