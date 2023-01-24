import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faAdd,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import ModalVista from "./ModalVista";
import PayPagination from "./PayPagination";

function convertCurrency(amount) {
  return amount.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const PaymentsMonthCreate = (props) => {
  const location = useLocation();
  const propsData = location.state;
  const [states, setStates] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [typePayments, setTypePayments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [estadoModal1, cambiarEstadoModal1] = useState(false);
  const [estadoModal2, cambiarEstadoModal2] = useState(false);
  const [estadoModal3, cambiarEstadoModal3] = useState(false);
  const [estadoModal4, cambiarEstadoModal4] = useState(false);
  const [estadoModal5, cambiarEstadoModal5] = useState(false);
  const [messageModal, cambiarMessageModal] = useState("");
  const [payment, cambiarPayment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);
  let [month, setMonth] = useState(0);
  let [year, setYear] = useState(0);


  const getStates = () => {
    fetch("/state/all")
      .then((res) => res.json())
      .then((res) => setStates(res.data))
      .catch((err) => console.log(err));
  };

  const getConcepts = () => {
    fetch("/concept/all")
      .then((res) => res.json())
      .then((res) => setConcepts(res.data))
      .catch((err) => console.log(err));
  };

  const getCurrencies = () => {
    fetch("/currency/all")
      .then((res) => res.json())
      .then((res) => setCurrencies(res.data))
      .catch((err) => console.log(err));
  };

  const getTypePayments = () => {
    fetch("/type_payment/all")
      .then((res) => res.json())
      .then((res) => setTypePayments(res.data))
      .catch((err) => console.log(err));
  };

  const getPayments = async (month, year) => {
    fetch(`/payment/list/${month}/${year}`)
      .then((res) => res.json())
      .then((res) => setPayments(res.data))
      .catch((err) => console.log(err));
  };

  function confirmacion(payment) {
    cambiarPayment(payment);
    cambiarEstadoModal2(!estadoModal2);
  }

  function chargeModal(payment) {
    cambiarPayment(payment);
    cambiarEstadoModal4(!estadoModal4);
  }

  function eliminar(result, payment) {
    cambiarEstadoModal2(!estadoModal2);
    if (result === true) {
      fetch(`/payment/delete/${payment.id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            cambiarEstadoModal3(!estadoModal3);
            window.location.reload();
          }
        });
    }
  }

  useEffect(() => {
    if (propsData.month !== 0 && propsData.year !== 0) {
      setMonth(propsData.month);
      setYear(propsData.year);
      getPayments(month, year);
    }
    getStates();
    getConcepts();
    getCurrencies();
    getTypePayments();
  }, [month, propsData.month, propsData.year, year]);

  const onChangeDate = (date) => {
    let data = date.target.value;
    const myArray = data.split("-");
    setMonth(myArray[1]);
    setYear(myArray[0]);
  
    getPayments(myArray[1], myArray[0]);

  };

  async function insertPayment() {
    var formData = document.getElementById("formCreate");
    var id_status = formData["status"].value;
    var id_type_payment = formData["type_payment"].value;
    var id_currency = formData["currency"].value;
    var id_concept = formData["concept"].value;
    var layer = formData["description"].value;

    var max_ammount = formData["max_ammount"].value;
    var min_ammount = formData["min_ammount"].value;
    var other_ammount = formData["other_ammount"].value;
    var month = formData["month"].value;
    var year = formData["year"].value;

    await fetch("/payment/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_concept: parseInt(id_concept),
        id_status: parseInt(id_status),
        id_currency: parseInt(id_currency),
        id_type_payment: parseInt(id_type_payment),
        month: parseInt(month),
        year: parseInt(year),
        layer: layer,
        max_ammount: parseFloat(max_ammount),
        min_ammount: parseFloat(min_ammount),
        other_ammount: parseFloat(other_ammount),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          cambiarEstadoModal1(!estadoModal1);
          window.location.reload();
        } else {
          cambiarEstadoModal1(!estadoModal1);
          cambiarEstadoModal5(!estadoModal5);
          cambiarMessageModal(res.message);
        }
      })
      .catch((err) => console.log(err));
  }

  async function updatePayment() {
    var formData = document.getElementById("formUpdate");
    var id = formData["id"].value;
    var id_status = formData["status"].value;
    var id_type_payment = formData["type_payment"].value;
    var id_currency = formData["currency"].value;
    var id_concept = formData["concept"].value;
    var layer = formData["description"].value;

    var max_ammount = formData["max_ammount"].value;
    var min_ammount = formData["min_ammount"].value;
    var other_ammount = formData["other_ammount"].value;
    var month = formData["month"].value;
    var year = formData["year"].value;

    await fetch(`/payment/update/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_concept: parseInt(id_concept),
        id_status: parseInt(id_status),
        id_currency: parseInt(id_currency),
        id_type_payment: parseInt(id_type_payment),
        month: parseInt(month),
        year: parseInt(year),
        layer: layer,
        max_ammount: parseFloat(max_ammount),
        min_ammount: parseFloat(min_ammount),
        other_ammount: parseFloat(other_ammount),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          cambiarEstadoModal4(!estadoModal4);
          window.location.reload();
        } else {
          cambiarEstadoModal5(!estadoModal5);
          cambiarMessageModal(res.message);
        }
      })
      .catch((err) => console.log(err));
  }


  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  let currentPayments =  payments ? payments.slice(indexOfFirstPayment, indexOfLastPayment) : "";

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    currentPayments = payments ? payments.slice(indexOfFirstPayment, indexOfLastPayment) : "";
  }

  return (
    <>
      <Container>
        <br />
        <Link to="/" className="btn btn-secondary">
          <FontAwesomeIcon icon={faArrowLeft} /> Volver
        </Link>
        &nbsp;
        <Button
          id="btnCreate"
          color="success"
          onClick={() => cambiarEstadoModal1(!estadoModal1)}
        >
          <FontAwesomeIcon icon={faAdd} /> Crear
        </Button>
        <br />
        <br />
        <div className="row form-group mt-3">
          <div className="col-sm-1 d-flex align-items-center">
            <label htmlFor="month-year">Periodo: </label>
          </div>
          <div className="col-sm-3">
            <input
              id="month-year"
              type="month"
              name="month-year"
              className="form-control"
              required
              defaultValue={
                propsData.year + "-" + String(propsData.month).padStart(2, "0")
              }
              disabled={
                payments && payments.length > 0
                  ? true
                  : false
              }
              onChange={(e) => onChangeDate(e)}
            />
          </div>
        </div>

        {/* Modal 1 Creacion*/}
        <ModalVista
          estado={estadoModal1}
          cambiarEstado={cambiarEstadoModal1}
          titulo="Crear Pago"
        >
          <form id="formCreate">
            <input id="month" type="text" value={month}  />
            <input id="year" type="text" value={year}  />
            <div className="row form-group mt-3">
              <div className="col-sm-2 d-flex align-items-center">
                <label htmlFor="status">Estado: </label>
              </div>
              <div className="col-sm-4">
                <select
                  name="status"
                  id="status"
                  className="form-control form-select"
                >
                  {states.map((state, index) => (
                    <option key={index} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-2 d-flex align-items-center">
                <label htmlFor="type_payment">T. Pago: </label>
              </div>
              <div className="col-sm-4">
                <select
                  id="type_payment"
                  name="type_payment"
                  className="form-control form-select"
                >
                  {typePayments.map((tp, index) => (
                    <option key={index} value={tp.id}>
                      {tp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row form-group mt-3">
              <div className="col-sm-2 d-flex align-items-center">
                <label htmlFor="concept">Moneda: </label>
              </div>
              <div className="col-sm-4">
                <select
                  id="currency"
                  name="currency"
                  className="form-control form-select"
                >
                  {currencies.map((currency, index) => (
                    <option key={index} value={currency.id}>
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-2 d-flex align-items-center">
                <label htmlFor="concept">Concepto: </label>
              </div>
              <div className="col-sm-4">
                <select
                  id="concept"
                  name="concept"
                  className="form-control form-select"
                >
                  {concepts.map((concept, index) => (
                    <option key={index} value={concept.id}>
                      {concept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row form-group mt-3">
              <div className="col-sm-3 d-flex align-items-center">
                <label htmlFor="description">Descripcion:</label>
              </div>
              <div className="col-sm-9">
                <input
                  id="description"
                  type="text"
                  name="description"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row form-group mt-3">
              <div className="col-sm-3 d-flex align-items-center">
                <label htmlFor="min_ammount">Minimo:</label>
              </div>
              <div className="col-sm-9">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={0}
                  name="min_ammount"
                  id="min_ammount"
                  className="form-control"
                  onKeyPress={(event) => {
                    return (
                      (event.charCode >= 48 && event.charCode <= 57) ||
                      event.charCode === 44 ||
                      event.charCode === 0
                    );
                  }}
                />
              </div>
            </div>

            <div className="row form-group mt-3">
              <div className="col-sm-3 d-flex align-items-center">
                <label htmlFor="max_ammount">Maximo:</label>
              </div>
              <div className="col-sm-9">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={0}
                  name="max_ammount"
                  id="max_ammount"
                  className="form-control"
                  onKeyPress={(event) => {
                    return (
                      (event.charCode >= 48 && event.charCode <= 57) ||
                      event.charCode === 44 ||
                      event.charCode === 0
                    );
                  }}
                />
              </div>
            </div>

            <div className="row form-group mt-3">
              <div className="col-sm-3 d-flex align-items-center">
                <label htmlFor="other_ammount">Otro:</label>
              </div>
              <div className="col-sm-9">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={0}
                  name="other_ammount"
                  id="other_ammount"
                  className="form-control"
                  onKeyPress={(event) => {
                    return (
                      (event.charCode >= 48 && event.charCode <= 57) ||
                      event.charCode === 44 ||
                      event.charCode === 0
                    );
                  }}
                />
              </div>
            </div>
            <div className="row form-group mt-3">
              <div className="col-sm-6">
                <Button color="primary" onClick={() => insertPayment()}>
                  Agregar
                </Button>
              </div>
              <div className="col-sm-6 d-grid gap-2 d-md-flex justify-content-md-end">
                <Button
                  className="btn btn-danger"
                  onClick={() => cambiarEstadoModal1(!estadoModal1)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </ModalVista>
        {/* Modal 2 Eliminacion*/}
        <ModalVista
          estado={estadoModal2}
          cambiarEstado={cambiarEstadoModal2}
          titulo="Eliminar Pago"
          data={payment}
        >
          <div className="row form-group mt-3">
            <div className="col-sm-12 d-flex align-items-center">
              <label htmlFor="other_ammount">
                ¿Esta seguro que desea eliminarel registrio?
              </label>
            </div>
          </div>
          <div className="row form-group mt-3">
            <div className="col-sm-6">
              <Button
                type="success"
                color="primary"
                onClick={() => eliminar(true, payment)}
              >
                Aceptar
              </Button>
            </div>
            <div className="col-sm-6 d-grid gap-2 d-md-flex justify-content-md-end">
              <Button
                className="btn btn-danger"
                onClick={() => cambiarEstadoModal2(!estadoModal2)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </ModalVista>
        {/* Modal 3 Confirmacion*/}
        <ModalVista
          estado={estadoModal3}
          cambiarEstado={cambiarEstadoModal3}
          titulo="Eliminar Pago"

        >
          <div className="row form-group mt-3">
            <div className="col-sm-12 d-flex align-items-center">
              <label htmlFor="other_ammount">
                ¡Eliminacion realizada con exito!
              </label>
            </div>
          </div>
          <div className="row form-group mt-3">
            <div className="col-sm-12 d-grid gap-2 d-md-flex justify-content-md-end">
              <Button
                className="btn btn-success"
                onClick={() => cambiarEstadoModal3(!estadoModal3)}
              >
                Aceptar
              </Button>
            </div>
          </div>
        </ModalVista>
        {/* Modal 4 Modificacion*/}
        <ModalVista
          estado={estadoModal4}
          cambiarEstado={cambiarEstadoModal4}
          titulo="Modificar Pago"
          data={payment}
        >
          <form id="formUpdate">
            <input id="id" type="text" value={payment.id} hidden />
            <input id="month" type="text" value={propsData.month} hidden />
            <input id="year" type="text" value={propsData.year} hidden />
            <div className="row form-group mt-3">
              <div className="col-sm-2 d-flex align-items-center">
                <label htmlFor="status">Estado: </label>
              </div>
              <div className="col-sm-4">
                <select
                  name="status"
                  id="status"
                  className="form-control form-select"
                >
                  {states.map((state, index) => (
                    <option
                      key={index}
                      value={state.id}
                      selected={payment.id_status === state.id ? true : false}
                    >
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-2 d-flex align-items-center">
                <label htmlFor="type_payment">T. Pago: </label>
              </div>
              <div className="col-sm-4">
                <select
                  id="type_payment"
                  name="type_payment"
                  className="form-control form-select"
                >
                  {typePayments.map((tp, index) => (
                    <option
                      key={index}
                      value={tp.id}
                      selected={
                        payment.id_type_payment === tp.id ? true : false
                      }
                    >
                      {tp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row form-group mt-3">
              <div className="col-sm-2 d-flex align-items-center">
                <label htmlFor="concept">Moneda: </label>
              </div>
              <div className="col-sm-4">
                <select
                  id="currency"
                  name="currency"
                  className="form-control form-select"
                >
                  {currencies.map((currency, index) => (
                    <option
                      key={index}
                      value={currency.id}
                      selected={
                        payment.id_currency === currency.id ? true : false
                      }
                    >
                      {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-sm-2 d-flex align-items-center">
                <label htmlFor="concept">Concepto: </label>
              </div>
              <div className="col-sm-4">
                <select
                  id="concept"
                  name="concept"
                  className="form-control form-select"
                >
                  {concepts.map((concept, index) => (
                    <option
                      key={index}
                      value={concept.id}
                      selected={
                        payment.id_concept === concept.id ? true : false
                      }
                    >
                      {concept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row form-group mt-3">
              <div className="col-sm-3 d-flex align-items-center">
                <label htmlFor="description">Descripcion:</label>
              </div>
              <div className="col-sm-9">
                <input
                  id="description"
                  type="text"
                  name="description"
                  className="form-control"
                  defaultValue={payment.layer}
                />
              </div>
            </div>

            <div className="row form-group mt-3">
              <div className="col-sm-3 d-flex align-items-center">
                <label htmlFor="min_ammount">Minimo:</label>
              </div>
              <div className="col-sm-9">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={payment.min_ammount}
                  name="min_ammount"
                  id="min_ammount"
                  className="form-control"
                  onKeyPress={(event) => {
                    return (
                      (event.charCode >= 48 && event.charCode <= 57) ||
                      event.charCode === 44 ||
                      event.charCode === 0
                    );
                  }}
                />
              </div>
            </div>

            <div className="row form-group mt-3">
              <div className="col-sm-3 d-flex align-items-center">
                <label htmlFor="max_ammount">Maximo:</label>
              </div>
              <div className="col-sm-9">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="max_ammount"
                  id="max_ammount"
                  defaultValue={payment.max_ammount}
                  className="form-control"
                  onKeyPress={(event) => {
                    return (
                      (event.charCode >= 48 && event.charCode <= 57) ||
                      event.charCode === 44 ||
                      event.charCode === 0
                    );
                  }}
                />
              </div>
            </div>

            <div className="row form-group mt-3">
              <div className="col-sm-3 d-flex align-items-center">
                <label htmlFor="other_ammount">Otro:</label>
              </div>
              <div className="col-sm-9">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="other_ammount"
                  id="other_ammount"
                  defaultValue={payment.other_ammount}
                  className="form-control"
                  onKeyPress={(event) => {
                    return (
                      (event.charCode >= 48 && event.charCode <= 57) ||
                      event.charCode === 44 ||
                      event.charCode === 0
                    );
                  }}
                />
              </div>
            </div>
            <div className="row form-group mt-3">
              <div className="col-sm-6">
                <Button color="primary" onClick={() => updatePayment()}>
                  Modificar
                </Button>
              </div>
              <div className="col-sm-6 d-grid gap-2 d-md-flex justify-content-md-end">
                <Button
                  className="btn btn-danger"
                  onClick={() => cambiarEstadoModal4(!estadoModal4)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </form>
        </ModalVista>
        {/* Modal 3 mensajes*/}
        <ModalVista
          estado={estadoModal5}
          cambiarEstado={cambiarEstadoModal5}
        >
          <div className="row form-group mt-3">
            <div className="col-sm-12 d-flex align-items-center">
              <label id="lblResultMessage">
                {messageModal}
              </label>
            </div>
          </div>
          <div className="row form-group mt-3">
            <div className="col-sm-12 d-grid gap-2 d-md-flex justify-content-md-end">
              <Button className="btn btn-success" onClick={() => cambiarEstadoModal5(!estadoModal5)}> Aceptar </Button>
            </div>
          </div>
        </ModalVista>
        <br />

        <PayPagination paymentsPerPage={paymentsPerPage} totalPayments={ payments ? payments.length : 0} paginate={paginate} />

        <div className="table-responsive-sm">
          <Table className="table table-hover table-sm">
            <thead>
              <tr>
                <th hidden id="id">
                  #
                </th>
                <th hidden id="id_status">
                  #
                </th>
                <th hidden id="id_type_payment">
                  #
                </th>
                <th hidden id="id_currency">
                  #
                </th>
                <th hidden id="id_concept">
                  #
                </th>
                <th scope="col">Estado</th>
                <th scope="col">T. Pago</th>
                <th scope="col">Moneda</th>
                <th scope="col">Concepto</th>
                <th scope="col">Descripcion</th>
                <th scope="col">Minimo</th>
                <th scope="col">Total</th>
                <th scope="col">Otro</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              { payments && payments.length > 0 && payments.message !== "No payments found"
                ? currentPayments.map((payment, index) => (
                    <tr
                      key={index}
                      className={
                        payment.id_status === 1
                          ? "table-success"
                          : "table-warning"
                      }
                    >
                      <td hidden id="id">
                        {payment.id}
                      </td>
                      <td hidden id="id_status">
                        {payment.id_status}
                      </td>
                      <td hidden id="id_type_payment">
                        {payment.id_type_payment}
                      </td>
                      <td hidden id="id_currency">
                        {payment.id_currency}
                      </td>
                      <td hidden id="id_concept">
                        {payment.id_concept}
                      </td>
                      <td className="align-middle fs-6">
                        {payment["status.name"]}
                      </td>
                      <td className="align-middle fs-6">
                        {payment["type_payment.name"]}
                      </td>
                      <td className="align-middle fs-6">
                        {payment["currency.name"]}
                      </td>
                      <td className="align-middle fs-6">
                        {payment["concept.name"]}
                      </td>
                      <td className="align-middle fs-6">{payment.layer}</td>
                      <td className="align-middle fs-6">
                        {convertCurrency(payment.min_ammount)}
                      </td>
                      <td className="align-middle fs-6">
                        {convertCurrency(payment.max_ammount)}
                      </td>
                      <td className="align-middle fs-6">
                        {convertCurrency(payment.other_ammount)}
                      </td>
                      <td>
                        <Button
                          color="primary"
                          onClick={() => chargeModal(payment)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        &nbsp;
                        <Button
                          color="danger"
                          onClick={() => confirmacion(payment)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </Table>
        </div>
      </Container>
    </>
  );
};
export default PaymentsMonthCreate;
