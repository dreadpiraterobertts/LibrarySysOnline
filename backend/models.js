// Import mongoose
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB (Replace the connection string with your MongoDB URI)
mongoose.connect(process.env.MONGO_URI,)
.then(() => {
  console.log('Connected to MongoDB.');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

//admin schema
const adminSchema = new mongoose.Schema({
    user_name:String,
    password:String
})
// Define the Books schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  year: Number,
  bar_code: Number,
  location:String,
  total_copies: {
    type: Number,
    required: true,
  },
  avail_copies: Number,
});

// Define the Users schema
const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: false,
    unique: false,
  },
  phone_number: {
    type: String,
    required: true,
  },
});

// Define the Loans schema
const loanSchema = new mongoose.Schema({
    issuer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Admin',
            required:true,
        },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    issue_date: {
        type: Date,
        required: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
    return_date: Date,
    payment:Number,
    penalty:Number,
    });

// Create models from schemas
const Book = mongoose.model('Book', bookSchema);
const User = mongoose.model('User', userSchema);
const Loan = mongoose.model('Loan', loanSchema);
const Admin = mongoose.model('Admin',adminSchema);

// Export the models for use in other files
module.exports = {
  Book,
  User,
  Loan,
  Admin
};
