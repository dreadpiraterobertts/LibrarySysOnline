import React, { useState } from "react";
import './return.css'
const Return = ({loanId,user,book}) => {

    const [returnDate, setReturnDate] = useState("");
    const [payment, setPayment] = useState("");
    const [penalty, setPenalty] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch(`https://librarybackend-bixf.onrender.com/loans/${loanId}/return`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            return_date: returnDate,
            payment,
            penalty,
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          setSuccessMessage(result.message || "Book returned successfully.");
          setError(""); // Clear error if success
          setReturnDate("")
          setPayment("")
          setPenalty("")
        } else {
          setError(result.error || "An error occurred");
          setSuccessMessage(""); // Clear success message if error occurs
        }
      } catch (err) {
        setError("An error occurred while processing the return.");
        setSuccessMessage(""); // Clear success message if error occurs
      }
    };
  

  return (
    <div>
        <div className="modal">
          <div className="book-return-form">
            <h2>Return Book</h2>
            <p>Returning Book: {book} <br /> from User: {user}</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="returnDate">Return Date:</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  required
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="payment">Payment:</label>
                <input
                  type="number"
                  id="payment"
                  name="payment"
                  placeholder="Enter payment amount"
                  onChange={(e) => setPayment(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="penalty">Penalty:</label>
                <input
                  type="number"
                  id="penalty"
                  name="penalty"
                  placeholder="Enter penalty amount"
                />
              </div>

              <div className="form-group">
                <button type="submit">Return Book</button>
              </div>
            </form>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
          </div>
        </div>
    </div>
  );
};

export default Return;
