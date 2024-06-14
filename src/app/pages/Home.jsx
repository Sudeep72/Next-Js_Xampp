"use client";

import React, { useState, useEffect } from "react";
import useSWR from "swr";

import Toast from "../components/Toast";

const fetcher = (url) => fetch(url).then((res) => res.json());

function Home() {
  const { data: invoiceDetails, error: invoiceError } = useSWR(
    "/api/details/invoice",
    fetcher
  );
  const [loading, setLoading] = useState(true);

  const [selectedName, setSelectedName] = useState("");
  const [details, setDetails] = useState({
    address: "",
    business: "",
    gstNumber: "",
    sgst: "",
    cgst: "",
  });
  const [noOfStocks, setNoOfStocks] = useState(0);
  const [marketPrice, setMarketPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [toast, setToast] = useState({}); // State for managing toast notifications

  useEffect(() => {
    if (invoiceDetails && invoiceDetails.length > 0) {
      setLoading(false);
      const latestInvoice = invoiceDetails[invoiceDetails.length - 1];
      if (latestInvoice && latestInvoice.invoiceNumber) {
        const currentNumber = parseInt(latestInvoice.invoiceNumber.slice(2));
        setInvoiceNumber(`IO${currentNumber + 1}`);
      } else {
        setInvoiceNumber("IO1");
      }
    }
  }, [invoiceDetails]);

  if (invoiceError) return <div>Failed to load invoice details</div>;
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-infinity loading-lg"></span>
      </div>
    );
  }

  const handleNameChange = (e) => {
    const name = e.target.value;
    setSelectedName(name);
    const selectedNameDetails = invoiceDetails.find(
      (nameDetail) => nameDetail["name"] === name
    );
    setDetails({
      address: selectedNameDetails["address"],
      business: selectedNameDetails["business"],
      gstNumber: selectedNameDetails["gstNumber"],
      sgst: selectedNameDetails["sgst"],
      cgst: selectedNameDetails["cgst"],
    });
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const total = noOfStocks * marketPrice;
    const sgst = (total * parseFloat(details.sgst)) / 100;
    const cgst = (total * parseFloat(details.cgst)) / 100;
    const totalWithTax = total + sgst + cgst;
    setTotalPrice(totalWithTax);

    setToast({
      message: "Calculation completed successfully!",
      type: "alert-success",
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/records/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: selectedName,
          address: details.address,
          business: details.business,
          gstNumber: details.gstNumber,
          sgst: details.sgst,
          cgst: details.cgst,
          invoiceNumber: invoiceNumber,
          date: new Date().toISOString().slice(0, 10),
          stocks: noOfStocks,
          marketValue: marketPrice,
          total: totalPrice,
        }),
      });
      if (response.ok) {
        console.log("Record saved successfully!");

        setToast({
          message: "Record saved successfully!",
          type: "alert-success",
        });

        setSelectedName("");
        setDetails({
          address: "",
          business: "",
          gstNumber: "",
          sgst: "",
          cgst: "",
        });
        setNoOfStocks(0);
        setMarketPrice(0);
        setTotalPrice(0);
        setInvoiceNumber(`IO${parseInt(invoiceNumber.slice(2)) + 1}`);
      } else {
        throw new Error("Failed to save record");
      }
    } catch (error) {
      console.error("Error saving record:", error);

      setToast({
        message: "Failed to save record. Please try again!",
        type: "alert-error",
      });
    }
  };

  const handleClear = () => {
    setSelectedName("");
    setDetails({
      address: "",
      business: "",
      gstNumber: "",
      sgst: "",
      cgst: "",
    });
    setNoOfStocks(0);
    setMarketPrice(0);
    setTotalPrice(0);

    setToast({
      message: "Form cleared successfully!",
      type: "alert-success",
    });
  };

  const handleToastClose = () => {
    setToast({});
  };

  return (
    <>
      <div className="navbar bg-base-100 flex justify-center text-gray-100">
        <div className="my-6">
          <p className="text-3xl">Price Calculator</p>
        </div>
      </div>
      <div className="bg-base-900 shadow-lg">
        <form className="card-body" onSubmit={handleCalculate}>
          <div className="flex flex-wrap -mx-2">
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">Name</span>
              </label>
              <select
                className="input input-bordered"
                value={selectedName}
                onChange={handleNameChange}
                required
              >
                <option value="">Select Name</option>
                {invoiceDetails.map((name) => (
                  <option key={name["name"]} value={name["name"]}>
                    {name["name"]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">Address</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={details.address}
                disabled
              />
            </div>
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">Business</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={details.business}
                disabled
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">GST Number</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={details.gstNumber}
                disabled
              />
            </div>
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">SGST</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={details.sgst}
                disabled
              />
            </div>
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">CGST</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={details.cgst}
                disabled
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">Number of Stocks</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={noOfStocks}
                onChange={(e) => setNoOfStocks(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">Market Price</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={marketPrice}
                onChange={(e) => setMarketPrice(parseFloat(e.target.value))}
                required
              />
            </div>
            <div className="form-control w-full md:w-1/3 px-2">
              <label className="label">
                <span className="label-text text-lg">Total Price</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={totalPrice}
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button type="submit" className="btn btn-outline btn-info mr-2">
              Calculate
            </button>
            <button
              type="button"
              className="btn btn-outline btn-error"
              onClick={handleClear}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-outline btn-success ml-2"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
          duration={3000}
        />
      )}
    </>
  );
}

export default Home;
