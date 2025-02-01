const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads/company-logos');

try {
    // Create directories if they don't exist
    fs.mkdirSync(uploadDir, { recursive: true });
    
    // Try to write a test file
    fs.writeFileSync(path.join(uploadDir, 'test.txt'), 'test');
    
    console.log('Upload directory is working correctly at:', uploadDir);
    console.log('Test file created successfully');
    
    // Clean up test file
    fs.unlinkSync(path.join(uploadDir, 'test.txt'));
} catch (error) {
    console.error('Error testing upload directory:', error);
} 