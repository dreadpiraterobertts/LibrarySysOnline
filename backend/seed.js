const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { User, Book,Admin } = require('./models'); // Adjust the path if necessary

// MongoDB Connection String
const dbURI = 'mongodb+srv://mussieteklu1:EfBKrZHcM5KUJytP@cluster0.xhemv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/library'; // Replace with your connection string

// Connect to MongoDB
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to generate fake users
const generateFakeUsers = async (numUsers = 10) => {
  const users = [];

  for (let i = 0; i < numUsers; i++) {
    const fullName = faker.person.fullName();
    const userName = faker.person.fullName()
    const phoneNumber = faker.phone.number();

    users.push({
      full_name: fullName,
      user_name: userName,
      phone_number: phoneNumber,
    });
  }

  // Insert fake users into the database
  try {
    await User.insertMany(users);
    console.log(`${numUsers} users added successfully!`);
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

// Function to generate fake books
const generateFakeBooks = async (numBooks = 10) => {
  const books = [];

  for (let i = 0; i < numBooks; i++) {
    const title = faker.lorem.words(3);
    const author = faker.person.fullName();
    const year = faker.date.past(50).getFullYear();
    const barCode = faker.number.int({min:100,max:500});
    const location = faker.lorem.words(5);
    const totalCopies = faker.number.int({min:100,max:500})
    const availCopies = totalCopies

    books.push({
      title,
      author,
      year,
      bar_code: barCode,
      location,
      total_copies: totalCopies,
      avail_copies: availCopies,
    });
  }
  // Insert fake books into the database
  try {
    await Book.insertMany(books);
    console.log(`${numBooks} books added successfully!`);
  } catch (err) {
    console.error('Error seeding books:', err);
  }
};


const generateFakeAdmins = async (numAdmins = 2) =>{
  const admins = []
  for (let i = 0; i < numAdmins; i++) {
    const user_name = faker.lorem.words(3);
    const password = faker.lorem.words(1)

    admins.push({
      user_name,
      password,
    });

    try {
      await Admin.insertMany(admins);
      console.log(`${numAdmins} books added successfully!`);
    } catch (err) {
      console.error('Error seeding books:', err);
    }
}
}

// Seed both users and books
const seedData = async () => {
  await generateFakeUsers(10);  // You can specify the number of users you want
  await generateFakeBooks(10);
  await generateFakeAdmins(2)  // You can specify the number of books you want
  mongoose.connection.close();
};


seedData()
