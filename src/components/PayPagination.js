import React from "react"; 
import { Button } from "reactstrap";

const PayPagination = ({paymentsPerPage, totalPayments, paginate}) => {
    const pageNumbers = [];
    for(let i = 1; i <= Math.ceil(totalPayments / paymentsPerPage); i++ ){
        pageNumbers.push(i);
    }
    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <Button onClick={() => paginate(number)} className="page-link">{number}</Button>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default PayPagination