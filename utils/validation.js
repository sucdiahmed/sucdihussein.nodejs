const Joi = require('joi');

// Contact form validation
exports.validateContact = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required()
            .messages({
                'string.empty': 'Name is required',
                'string.min': 'Name must be at least 2 characters long',
                'string.max': 'Name cannot exceed 50 characters'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please enter a valid email address'
            }),
        subject: Joi.string().min(2).max(100).required()
            .messages({
                'string.empty': 'Subject is required',
                'string.min': 'Subject must be at least 2 characters long',
                'string.max': 'Subject cannot exceed 100 characters'
            }),
        message: Joi.string().min(10).max(1000).required()
            .messages({
                'string.empty': 'Message is required',
                'string.min': 'Message must be at least 10 characters long',
                'string.max': 'Message cannot exceed 1000 characters'
            })
    });

    return schema.validate(data);
};

// Job posting validation
exports.validateJob = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required()
            .messages({
                'string.empty': 'Job title is required',
                'string.min': 'Job title must be at least 3 characters long',
                'string.max': 'Job title cannot exceed 100 characters'
            }),
        company: Joi.string().min(2).max(50).required()
            .messages({
                'string.empty': 'Company name is required',
                'string.min': 'Company name must be at least 2 characters long',
                'string.max': 'Company name cannot exceed 50 characters'
            }),
        location: Joi.string().required()
            .messages({
                'string.empty': 'Location is required'
            }),
        jobType: Joi.string().valid('full-time', 'part-time', 'contract', 'remote').required()
            .messages({
                'string.empty': 'Job type is required',
                'any.only': 'Please select a valid job type'
            }),
        salary: Joi.string().required()
            .messages({
                'string.empty': 'Salary range is required'
            }),
        description: Joi.string().min(50).required()
            .messages({
                'string.empty': 'Job description is required',
                'string.min': 'Job description must be at least 50 characters long'
            })
    });

    return schema.validate(data);
}; 