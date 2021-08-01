import "./CreditorsTable.css";
import React, { useEffect, useState } from "react";

const TABLE_HEADERS = [
  "Creditor",
  "First Name",
  "Last Name",
  "Min Pay%",
  "Balance",
];
const DATA_URL =
  "https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json";

const CreditorsTable = () => {
  const [creditors, setCreditors] = useState([]);
  useEffect(() => {
    fetchData(DATA_URL);
  }, []);

  const [newCreditor, setNewCreditor] = useState({
    creditorName: "",
    firstName: "",
    lastName: "",
    minPaymentPercentage: 0,
    balance: 0,
  });
  const [selectedBalanceSum, setSelectedBalanceSum] = useState(0);
  const [selectedRowSum, setSelectedRowSum] = useState(0);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  return (
    <div className="creditors-container">
      <div className="creditors-table">
        {/* ====== HEADERS ======*/}
        <div className="creditors-table__headers">
          <div className="creditors-table__headers__input-box">
            <input
              type="checkbox"
              id="main-checkbox"
              onClick={handleCheckbox}
            ></input>
          </div>
          {TABLE_HEADERS.map((header, index) => (
            <div className="creditors-table__headers__header" key={index}>
              <span>{header}</span>
            </div>
          ))}
        </div>
        {/* ====== BODY ======*/}
        {creditors.map((creditor, index) => (
          <div className="creditors-table__row" key={creditor.id}>
            <div className="creditors-table__row__input-box">
              <input
                type="checkbox"
                name="row-checkbox"
                id={creditor.id}
                onClick={handleCheckbox}
              ></input>
            </div>
            <div
              className="creditors-table__row__item"
              data-type="creditorName"
            >
              <span>{creditor.creditorName}</span>
            </div>
            <div className="creditors-table__row__item" data-type="firstName">
              <span>{creditor.firstName}</span>
            </div>
            <div className="creditors-table__row__item" data-type="lastName">
              <span>{creditor.lastName}</span>
            </div>
            <div className="creditors-table__row__item">
              <span>{creditor.minPaymentPercentage.toFixed(2)}%</span>
            </div>
            <div className="creditors-table__row__item">
              <span>{creditor.balance.toFixed(2)}</span>
            </div>
          </div>
        ))}
        <div className="creditors-table__input-row">
          <div className="creditors-table__input-row__input">
            <input onChange={handleInput} id="creditorName" type="text"></input>
          </div>
          <div className="creditors-table__input-row__input">
            <input onChange={handleInput} id="firstName" type="text"></input>
          </div>
          <div className="creditors-table__input-row__input">
            <input onChange={handleInput} id="lastName" type="text"></input>
          </div>
          <div className="creditors-table__input-row__input">
            <input
              onChange={handleInput}
              id="minPaymentPercentage"
              type="text"
            ></input>
          </div>
          <div className="creditors-table__input-row__input">
            <input onChange={handleInput} id="balance" type="text"></input>
          </div>
        </div>
      </div>
      {/* ====== ERROR MESSAGE ======*/}
      {showErrorMessage && (
        <div className="creditors-error">
          <span className="creditors-error__message">
            Please enter numbers for Min Pay% and Balance
          </span>
        </div>
      )}
      {/* ====== BUTTONS ======*/}
      <div className="creditors-buttons">
        <button className="creditors-buttons__button" onClick={addDebt}>
          Add Debt
        </button>
        <button
          className="creditors-buttons__button"
          data-type="remove"
          onClick={removeDebt}
        >
          Remove Debt
        </button>
      </div>
      {/* ====== COUNT STATISTICS ======*/}
      <div className="creditors-total-bar">
        <span>Total</span>
        <span>${selectedBalanceSum.toFixed(2)}</span>
      </div>
      <div className="creditors-total-rows">
        <span>Total Row Count: {creditors.length}</span>
        <span>Check Row Count: {selectedRowSum}</span>
      </div>
    </div>
  );

  async function fetchData(fetchUrl) {
    try {
      const response = await fetch(fetchUrl);
      const data = await response.json();
      setCreditors(data);
    } catch (error) {
      console.error("fetchData error: ", error);
    }
  }

  function handleInput(event) {
    let eventVal = event.target.value;
    const eventId = event.target.id;

    if (eventId === "minPaymentPercentage" || eventId === "balance") {
      eventVal = Number(eventVal);
    }

    setNewCreditor({ ...newCreditor, [eventId]: eventVal });
  }

  function addDebt() {
    if (checkInputValidation()) {
      setShowErrorMessage(false);
      const allTextInputs = [...document.getElementsByTagName("input")].filter(
        (input) => input.type === "text"
      );
      allTextInputs.forEach((input) => (input.value = ""));

      setCreditors([
        ...creditors,
        { ...newCreditor, id: Math.floor(Math.random() * 1000) },
      ]);
    } else {
      setShowErrorMessage(true);
    }

    // NOTE: If the API was working, then the below would be how to POST to the API
    // const requestOptions = {
    //   method: "POST",
    //   mode: "no-cors",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: newCreditor,
    // };

    // try {
    //   const response = await fetch(DATA_URL, requestOptions);
    //   const json = await response.json();
    //   console.log("addDebt success: ", json);
    // } catch (error) {
    //   console.error("addDebt error: ", error);
    // }
  }

  function checkInputValidation() {
    return (
      isValidNumber(newCreditor.minPaymentPercentage) &&
      isValidNumber(newCreditor.balance)
    );
  }

  function isValidNumber(number) {
    return !isNaN(number) && typeof number === "number";
  }

  function removeDebt() {
    const allCheckboxes = document.getElementsByName("row-checkbox");
    const allCheckedCheckBoxes = [...allCheckboxes]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => Number(checkbox.id));

    allCheckedCheckBoxes.forEach((id) => {
      creditors.forEach((creditor, index) => {
        if (creditor["id"] === id) {
          const adjustCreditorsArray = creditors;
          adjustCreditorsArray.splice(index, 1);
          setCreditors([...adjustCreditorsArray]);
          setSelectedBalanceSum(0);
          setSelectedRowSum(0);
          document.getElementById("main-checkbox").checked = false;

          // NOTE: If the API was working, this is how to delete from the API
          // async function deleteCreditor() {
          //   try {
          //     await fetch(DATA_URL + creditor["id"], {
          //       method: "DELETE",
          //     });
          //   } catch (error) {
          //     console.error("deleteCreditor error: ", error);
          //   }
          // }
          // deleteCreditor();
        }
      });
    });
  }

  function handleCheckbox(event) {
    if (event.target.id === "main-checkbox") {
      const allCheckboxes = document.getElementsByName("row-checkbox");
      let balanceTotal = selectedBalanceSum;

      allCheckboxes.forEach((checkbox, index) => {
        checkbox.checked = event.target.checked;

        if (event.target.checked) {
          balanceTotal += creditors[index]["balance"];
          setSelectedRowSum(creditors.length);
        } else {
          balanceTotal = 0;
          setSelectedRowSum(0);
        }
      });

      setSelectedBalanceSum(balanceTotal);
    } else {
      const selectedCreditor = creditors.filter(
        (creditor) => creditor["id"] === Number(event.target.id)
      )[0];

      if (event.target.checked) {
        setSelectedBalanceSum(selectedBalanceSum + selectedCreditor["balance"]);
        setSelectedRowSum(selectedRowSum + 1);
      } else {
        setSelectedBalanceSum(selectedBalanceSum - selectedCreditor["balance"]);
        setSelectedRowSum(selectedRowSum - 1);
      }
    }
  }
};

export default CreditorsTable;
