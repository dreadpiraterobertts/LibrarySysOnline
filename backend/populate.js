const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const {Book} = require('./models'); // Ensure this path is correct

// MongoDB connection details
const mongoUri = 'mongodb+srv://mussieteklu1:EfBKrZHcM5KUJytP@cluster0.xhemv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/library'; // Replace with your MongoDB URI

// Function to read the Excel file and return data
function readExcelFile(filePath) {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
        const sheet = workbook.Sheets[sheetName];
        return xlsx.utils.sheet_to_json(sheet);
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw error; // Re-throw the error to stop execution
    }
}

// Function to populate MongoDB
async function populateDatabase(filePath) {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Read the Excel file
        const data = readExcelFile(filePath);
        console.log(`Read ${data.length} records from the Excel file.`);

        // Process and insert data into MongoDB using insertMany
        await Book.insertMany(data.map(row => ({
            title: row.title === "..." ? "" : row.title || "",
            author: row.author === "..." ? "" : row.author || "",
            year: row.year === "..." ? null : Number(row.year) || null, // Convert to number or set to null
            bar_code: row.bar_code === "..." ? "" : row.bar_code || "",
            location: row.location === "..." ? "" : row.location || "",
            total_copies: row.total_copies === "..." ? 0 : Number(row.total_copies) || 0, // Convert to number or set to 0
            avail_copies: row.avail_copies === "..." ? 0 : Number(row.avail_copies) || 0, // Convert to number or set to 0
        })));
        

        console.log('Database populated successfully!');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Path to your Excel file
const excelFilePath = path.join(__dirname, 'librarydatatwo.xlsx'); // Replace with your file path

// Run the script
populateDatabase(excelFilePath);
