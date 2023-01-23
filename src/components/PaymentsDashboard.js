import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  const monthName = date.toLocaleString([], { month: "long" });
  return monthName.replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
    letter.toUpperCase()
  );
}

function convertCurrency(amount) {
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function eliminar(month, year) {
  var opcion = window.confirm(
    "Estás Seguro que deseas eliminar el mes " +
      getMonthName(month) +
      " del año " +
      year +
      " completo?"
  );
  if (opcion == true) {
    fetch(`/payment/delete_all/${month}/${year}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Eliminado Correctamente");
          window.location.reload();
        } else {
          alert("Error al Eliminar");
        }
      });
  }
}

const PaymentsDashboard = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = () => {
    fetch("/payment/all")
      .then((res) => res.json())
      .then((res) => setPayments(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col-md-4 offset-md-4">
          <div className="d-grid mx-auto">
            <Link
              to="/create"
              state={{ month: 0, year: 0 }}
              className="btn btn-success"
            >
              <FontAwesomeIcon icon={faCalendarAlt} /> Abrir Mes
            </Link>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        {typeof payments.map === "undefined" ? (
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button className="btn btn-primary" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Loading...
              </button>
            </div>
          </div>
        ) : (
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="table-responsive">
              <table className="table table-hover table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Mes</th>
                    <th scope="col">Año</th>
                    <th scope="col">Pagado</th>
                    <th scope="col">Adeudado</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {payments.map((payment, index) => (
                    <tr key={index}>
                      <td>{getMonthName(payment.month)}</td>
                      <td>{payment.year}</td>
                      <td>{convertCurrency(payment.pagado)}</td>
                      <td>{convertCurrency(payment.adeudado)}</td>
                      <td>
                        <Link
                          to="/editar"
                          state={{ month: payment.month, year: payment.year }}
                          className="btn btn-primary"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Link>
                        &nbsp;
                        <Button
                          color="danger"
                          onClick={() => eliminar(payment.month, payment.year)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsDashboard;
