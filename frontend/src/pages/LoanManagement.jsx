import React, { useState, useEffect } from "react";
import "./loanmanagement.css";
import Return from "../forms/Return";
import Details from "../forms/Details";

const LoanManagement = () => {
  const [filter, setFilter] = useState("Current");
  const [search, setSearch] = useState("");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [loanId, setLoanId] = useState(null);
  const [book, setBook] = useState(null);  // You can set the book or other relevant data
  const [user, setUser] = useState(null);  // You can set the user info if needed
  const [issueDate,setIssueDate] = useState("")
  const [returnDate,setReturnDate] = useState("")
  const [payment,setPayment] = useState(0)
  const [penalty,setPenalty] = useState(0)
  const [showDetails,setShowDetails] = useState(false)

  const Message = ({message,color}) =>{
    return(
      <p className={color}>{message}</p>
    )
  }
  const checkStatus = (dueDate,returnDate) =>{
    const today =  new Date().toISOString().split("T")[0]
    if(!returnDate && dueDate < today){
      return <Message message={"Over Due"} color={"red"} />
    }else if(returnDate){
      return  <Message message={"Returned"} color={"blue"} />
    }else{
      return  <Message message={"On loan"} color={"green"} />
    }
  }
  

  const fetchLoans = async () => {
    setLoading(true);
    try {
      let endpoint = "/loans";
      if (filter === "Current") endpoint = "/loans/current";
      if (filter === "Overdue") endpoint = "/loans/overdue";
      if (filter === "Returned") endpoint = "/loans/returned";

      const response = await fetch(`http://localhost:5000${endpoint}?search=${search}&page=${currentPage}`);
      const data = await response.json();
      setLoans(data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, [filter, search, currentPage,showReturnForm]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  const returnBook = (id, book, user) => {
    setLoanId(id);
    setBook(book);
    setUser(user);
    setShowReturnForm(true); // This will show the form
  };

  const details = (id , book, user,issue_date,return_date,payment,penalty) =>{
    console.log(
      id,
      book,
      user,
      issue_date,
      return_date,
      payment,
      penalty

    )
    setLoanId(id);
    setBook(book);
    setUser(user);
    setIssueDate(issue_date)
    setReturnDate(return_date)
    setPayment(payment)
    setPenalty(penalty)
    setShowDetails(true)
  }
  return (
    <div className="loan-container">
      <h2 className="loan-title">Loan Table</h2>
      <div className="loan-controls">
        <input
          className="loansearch"
          type="text"
          placeholder="Search user or book"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="Current">Current</option>
          <option value="Overdue">Overdue</option>
          <option value="Returned">Returned</option>
          <option value="LoanHistory">Loan history</option>
        </select>
      </div>

          <table className="loan-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Issuer</th>
                <th>User Name</th>
                <th>Book Title</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {loading ? (
    <tr>
      <td colSpan="9" style={{ textAlign: "center" }}>Loading...</td>
    </tr>
  ) : loans.length > 0 ? (
    loans.map((loan, index) => (
      <tr key={loan._id}>
        <td>{(currentPage - 1) * loansPerPage + index + 1}</td>
        <td>{loan.issuer?.user_name || "Unknown"}</td>
        <td>{loan.user_id?.full_name || "Unknown"}</td>
        <td>{loan.book_id?.title || "Unknown"}</td>
        <td>{new Date(loan.issue_date).toLocaleDateString()}</td>
        <td>{new Date(loan.due_date).toLocaleDateString()}</td>
        <td>{loan.return_date ? new Date(loan.return_date).toLocaleDateString() : "Pending"}</td>
        <td>{checkStatus(loan.due_date, loan.return_date)}</td>
        <td>
          {!loan.return_date ? (
            <button
              className="return-btn"
              onClick={() => returnBook(loan._id, loan.book_id?.title, loan.user_id?.full_name)}
            >
              Return
            </button>
          ):(<button
            id="details-btn"
            onClick={() => details(loan._id, loan.book_id?.title, loan.user_id?.full_name, loan.issue_date,loan.return_date,loan.payment,loan.penalty)}
          >
            Details
          </button>)}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="9" style={{ textAlign: "center" }}>No records found</td>
    </tr>
  )}
</tbody>

          </table>
          <div className="pagination">
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={currentPage === number + 1 ? "active" : ""}
              >
                {number + 1}
              </button>
            ))}
          </div>

          {showReturnForm && (
             <div className="floating-form-overlay" onClick={(e) => e.stopPropagation()}>
               <button className="close-button" onClick={()=>setShowReturnForm(false)}>
                 X
               </button>
               <Return loanId={loanId} book={book} user={user} />
             </div>
          )}
          {showDetails && (
            <div className="floating-form-overlay">
            <button className="close-button" onClick={()=>setShowDetails(false)}>
              X
            </button>
            <Details loanId={loanId} book={book} user={user} issueDate = {issueDate} returnDate ={returnDate} payment={payment} penalty ={penalty} />
          </div>
          )}
    </div>
  );
};

export default LoanManagement;