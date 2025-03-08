import React from 'react';
import './details.css'
const Details = ({ loanId, book, user, issueDate, returnDate, payment, penalty, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Loan Details</h2>
        <p id="txt"><strong>Book:  </strong> {book}</p>
        <p id="txt"><strong>User:  </strong> {user}</p>
        <p id="txt"><strong>Issue Date:</strong> {issueDate}</p>
        <p id="txt"><strong>Return Date:</strong> {returnDate}</p>
        <p id="txt"><strong>Payment:</strong> {payment}</p>
        <p id="txt"><strong>Penalty:</strong> {penalty}</p>
      </div>
    </div>
  );
};

export default Details;