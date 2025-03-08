const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000; // Use dynamic port

app.use(express.json());
app.use(cors({
  origin: '*',  // Allow requests from anywhere (including Electron)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const {Book} = require('./models.js')
const { User } = require('./models.js'); 
const {Loan} = require('./models.js')
const {Admin} =require('./models.js')



//register admin

app.post('/regadmin',async(req,res)=>{
  const {user_name, password} = req.body

  try{
    const newAdmin = new Admin({
      user_name,
      password,
    });
    await newAdmin.save();
    res.json({ id: newAdmin._id });

  }catch(err){
    res.status(500).json({ error: err.message });
  }
  
})

app.get('/admin' , async(req,res)=>{
  try {
    const admins = await Admin.find()
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  const admin = await Admin.findOne({ user_name });

  if (!admin){
    console.log("User not found")
    return res.json({ success: false, message: "User not found" })
  };

  // Directly compare plain-text passwords (not secure!)
  if (password !== admin.password) {
    console.log("Password incorrect")
    return res.json({ success: false, message: "Wrong password" });
  }

  const token = jwt.sign(
    { id: admin._id, user_name: admin.user_name }, // Include username in the token
    "waterfox",
    { expiresIn: "7d" }
  );
  res.json({ success: true, token , user_name:admin.user_name, id:admin._id });
});

//get all books with search and pagination
app.get('/books', async (req, res) => {
    const { search, page, limit} = req.query;
    const query = {};
  
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
  
    try {
      const books = await Book.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


//get all available books with search and pagination
app.get('/books/available', async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { avail_copies: { $gt: 0 } };
  
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
  
    try {
      const books = await Book.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// add book
app.post('/books', async (req, res) => {
    const { title, author, year, bar_code,location, total_copies } = req.body;

    try {
      const newBook = new Book({
        title,
        author,
        year,
        bar_code,
        location,
        total_copies,
        avail_copies: total_copies
      });
      await newBook.save();
      res.json({ id: newBook._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

//edit a book
app.put('/books/:id', async (req, res) => {
    const { title, author, year, bar_code, location,total_copies } = req.body;
    const bookId = req.params.id;
  
  /*   if (!title || !author || !year || !bar_code || location || total_copies === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    } */
  
    try {
      // Fetch the current book data
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      // Calculate the difference and new available copies
      const difference = total_copies - book.total_copies;
      const newAvailCopies = book.avail_copies + difference;
  
      if (newAvailCopies < 0) {
        return res.status(400).json({ error: 'Cannot subtract more copies than available' });
      }
  
      // Update the book
      book.title = title;
      book.author = author;
      book.year = year;
      book.bar_code = bar_code;
      book.location = location;
      book.total_copies = total_copies;
      book.avail_copies = newAvailCopies;
  
      await book.save();
      res.json({ message: 'Book updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
//delete a book
app.delete('/books/:id', async (req, res) => {
    try {
      await Book.findByIdAndDelete(req.params.id);
      res.json({ message: 'Book deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  // Get All Users with Search and Pagination
app.get('/users', async (req, res) => {
    const { search, page, limit } = req.query;
    const query = {};
  
    // Search by full_name or user_name
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { user_name: { $regex: search, $options: 'i' } }
      ];
    }
  
    try {
      const users = await User.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Add New User
app.post('/users', async (req, res) => {
    const { full_name, user_name, phone_number } = req.body;
  
    // Validate input
    if (!full_name || !phone_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      // Check for existing username
  
      // Create and save the new user
      const newUser = new User({ full_name, user_name, phone_number });
      await newUser.save();
      res.status(201).json({ message: 'User added successfully!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Edit User
app.put('/users/:id', async (req, res) => {
    const { full_name, user_name, phone_number } = req.body;
    const userId = req.params.id;
  
    try {
      // Check for existing username (exclude current user)
      const existingUser = await User.findOne({ user_name, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
  
      // Update user details
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { full_name, user_name, phone_number },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// Delete User
app.delete('/users/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  app.get('/admins', async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};

    // Search by user_name
    if (search) {
        query.user_name = { $regex: search, $options: 'i' };
    }

    try {
        const admins = await Admin.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

  //issue loan
  app.post('/loans', async (req, res) => {
    const {issuer_id, user_id, book_id, due_date } = req.body;
    
    if (!user_id || !book_id || !due_date || !issuer_id) {
      return res.status(400).json({ error: "Missing required fields: user_id, book_id, due_date, issuer_id" });
    }
  
    try {
      // Validate user existence
      const user = await User.findById(user_id);
      if (!user) return res.status(400).json({ error: "User does not exist" });
  
      // Validate book availability
      const book = await Book.findById(book_id);
      if (!book || book.avail_copies <= 0) return res.status(400).json({ error: "Book unavailable or does not exist" });
  
      // Validate admin (issuer) existence
      const admin = await Admin.findById(issuer_id);
      if (!admin) return res.status(400).json({ error: "Admin (issuer) does not exist" });
  
      // Create a loan record
      const loan = new Loan({
        user_id,
        book_id,
        issuer: issuer_id, // Reference to the admin issuing the loan
        issue_date: new Date(),
        due_date,
      });
  
      await loan.save();
  
      // Update book availability
      book.avail_copies -= 1;
      await book.save();
  
      res.json({ success: true, message: "Loan issued successfully!", loan_id: loan._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //return a book
  app.put('/loans/:id/return', async (req, res) => {
    const { return_date, payment , penalty} = req.body;
  
    if (!return_date) {
      return res.status(400).json({ error: "Return date is required." });
    }
  
    try {
      // Check if the loan exists and hasn't been returned
      const loan = await Loan.findById(req.params.id);
      if (!loan) return res.status(404).json({ error: "Loan not found." });
      if (loan.return_date) return res.status(400).json({ error: "This book has already been returned." });
  
      // Update the return_date in the loan document
      loan.return_date = return_date;
      loan.payment = payment
      loan.penalty = penalty
      await loan.save();
  
      // Update book availability
      const book = await Book.findById(loan.book_id);
      book.avail_copies += 1;
      await book.save();
  
      res.json({ message: "Book returned successfully." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all loans with search & pagination
app.get('/loans', async (req, res) => {
    const { search, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const query = {};
  
    // If search query is present, search by user name or book title
    if (search) {
      // Search for user and book separately
      const users = await User.find({ full_name: { $regex: search, $options: "i" } }, "_id");
      const books = await Book.find({ title: { $regex: search, $options: "i" } }, "_id");

      query.$or = [
          { user_id: { $in: users.map(user => user._id) } },
          { book_id: { $in: books.map(book => book._id) } }
      ];
  }
  
    try {
      const loans = await Loan.find(query)
        .populate('user_id', 'full_name')
        .populate('book_id', 'title')
        .populate('issuer', 'user_name')
        .skip(skip)
        .limit(parseInt(limit));
  
      res.json(loans);
    } catch (error) {
      console.error("Error fetching all loans:", error);
      res.status(500).json({ error: "Failed to fetch loans" });
    }
  });
  

  //current loans
  app.get('/loans/current', async (req, res) => {
    const { search, page, limit} = req.query;
    const offset = (page - 1) * limit;
  
    try {
      let query = {
        return_date: null, // Only current loans
      };
  
      if (search) {
        // Search for user and book separately
        const users = await User.find({ full_name: { $regex: search, $options: "i" } }, "_id");
        const books = await Book.find({ title: { $regex: search, $options: "i" } }, "_id");

        query.$or = [
            { user_id: { $in: users.map(user => user._id) } },
            { book_id: { $in: books.map(book => book._id) } }
        ];
    }
  
      const loans = await Loan.find(query)
        .skip(offset)
        .limit(Number(limit))
        .populate('user_id', 'full_name')
        .populate('book_id', 'title')
        .populate('issuer', 'user_name'); // Populate issuer field
  
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //returned loans

  app.get('/loans/returned', async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      let query = { return_date: { $ne: null } }; // Only returned loans
  
      if (search) {
        // Search for user and book separately
        const users = await User.find({ full_name: { $regex: search, $options: "i" } }, "_id");
        const books = await Book.find({ title: { $regex: search, $options: "i" } }, "_id");

        query.$or = [
            { user_id: { $in: users.map(user => user._id) } },
            { book_id: { $in: books.map(book => book._id) } }
        ];
    }
  
      const loans = await Loan.find(query)
        .skip(offset)
        .limit(Number(limit))
        .populate('user_id', 'full_name')
        .populate('book_id', 'title')
        .populate('issuer', 'user_name'); // Populate issuer field
      
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  //overdue loans
  app.get('/loans/overdue', async (req, res) => {
    const { search, page, limit} = req.query;
    const offset = (page - 1) * limit;
  
    const today =  new Date().toISOString().split("T")[0]
    try {
      let query = {
        return_date: null,
        due_date: { $lt: today } // Overdue loans
      };
  
      if (search) {
        // Search for user and book separately
        const users = await User.find({ full_name: { $regex: search, $options: "i" } }, "_id");
        const books = await Book.find({ title: { $regex: search, $options: "i" } }, "_id");

        query.$or = [
            { user_id: { $in: users.map(user => user._id) } },
            { book_id: { $in: books.map(book => book._id) } }
        ];
    }
  
      const loans = await Loan.find(query)
        .skip(offset)
        .limit(Number(limit))
        .populate('user_id', 'full_name')
        .populate('book_id', 'title')
        .populate('issuer', 'user_name'); // Populate issuer field
      
      res.json(loans);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  
  
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
  });