import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import './issueloan.css';

const IssueLoan = ({username,id}) => {
  const [userId, setUserId] = useState('');
  const [bookId, setBookId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [issuerId, setIssuerId] = useState(id);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://librarybackend-bixf.onrender.com/users');
        const data = await response.json();
        setUsers(data.map((user) => ({ value: user._id, label: user.full_name })));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await fetch('https://librarybackend-bixf.onrender.com/books');
        const data = await response.json();
        setBooks(data.map((book) => ({ value: book._id, label: book.title })));
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await fetch('https://librarybackend-bixf.onrender.com/admins');
        const data = await response.json();
        setAdmins(data.map((admin) => ({ value: admin._id, label: admin.user_name })));
      } catch (err) {
        console.error("Error fetching admins:", err);
      }
    };
    fetchUsers();
    fetchBooks();
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !bookId || !dueDate || !issuerId) {
      setMessage('Please fill out all fields.');
      return;
    }

    if (window.confirm("Issuing a loan ... do you want to continue?")) {
      try {
        const response = await fetch('https://librarybackend-bixf.onrender.com/loans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ issuer_id: issuerId, user_id: userId, book_id: bookId, due_date: dueDate }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage('Loan created successfully!');
          setUserId('');
          setBookId('');
          setDueDate('');
          setIssuerId('');
        } else {
          setMessage(`Error: ${data.error}`);
        }
      } catch (err) {
        console.error('Error submitting loan:', err);
        setMessage('Error creating loan.');
      }
    }
  };

  return (
    <div className="loan-form-container">
      <h2>Create Loan</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">User</label>
          <Select
            id="userId"
            value={users.find((user) => user.value === userId) || ''}
            onChange={(selectedOption) => setUserId(selectedOption?.value || '')}
            options={users}
            placeholder="Select User"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bookId">Book</label>
          <Select
            id="bookId"
            value={books.find((book) => book.value === bookId) || ''}
            onChange={(selectedOption) => setBookId(selectedOption?.value || '')}
            options={books}
            placeholder="Select Book"
          />
        </div>

        <div className="form-group">
          <label htmlFor="issuerId">Issuer</label>
          <input
            type="text"
            name="issuerId"
            value={username}
            disabled // Make the field non-editable
            placeholder="Issuer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <button className="issue" type="submit">Issue Loan</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default IssueLoan;
