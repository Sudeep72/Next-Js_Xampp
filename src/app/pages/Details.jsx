import React, { useState, useEffect } from "react";
import useSWR from "swr";

import Toast from "../components/Toast";

const fetcher = (url) => fetch(url).then((res) => res.json());

function Details() {
  const {
    data: invoiceDetails,
    error,
    mutate,
  } = useSWR("/api/details/invoice", fetcher);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    business: "",
    gstNumber: "",
    sgst: "",
    cgst: "",
  });
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "name",
      "address",
      "business",
      "gstNumber",
      "sgst",
      "cgst",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setToast({
          message: "Please enter all fields!",
          type: "alert-error",
        });
        return;
      }
    }

    const method = editId ? "PUT" : "POST";
    const url = "/api/details/invoice";
    const payload = editId ? { id: editId, ...formData } : formData;
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    mutate();
    handleClear();
    setToast({
      message: editId
        ? "Customer updated successfully!"
        : "Customer added successfully!",
      type: "alert-success",
    });
  };

  const handleEdit = (invoice) => {
    setFormData(invoice);
    setEditId(invoice.id);
  };

  const handleDelete = async (id) => {
    await fetch("/api/details/invoice", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    mutate();
    setToast({
      message: "Details deleted successfully!",
      type: "alert-success",
    });
  };

  const handleClear = () => {
    setFormData({
      name: "",
      address: "",
      business: "",
      gstNumber: "",
      sgst: "",
      cgst: "",
    });
    setEditId(null);
    setToast({
      message: "Form cleared!",
      type: "alert-success",
    });
  };

  const handleToastClose = () => {
    setToast({});
  };

  if (error) return <div>Failed to load</div>;
  if (!invoiceDetails)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <>
      <div className="navbar bg-base-100 flex justify-center text-gray-100">
        <div className="my-6">
          <p className="text-3xl">Customer Details</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center text-base">ID</th>
              <th className="text-center text-base">Name</th>
              <th className="text-center text-base">Address</th>
              <th className="text-center text-base">Business</th>
              <th className="text-center text-base">GST Number</th>
              <th className="text-center text-base">SGST</th>
              <th className="text-center text-base">CGST</th>
              <th className="text-center text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceDetails.map((invoice, index) => (
              <tr key={index} className={index % 2 === 0 ? "" : "hover"}>
                <th className="text-center">{invoice.id}</th>
                <td className="text-center">{invoice.name}</td>
                <td className="text-center">{invoice.address}</td>
                <td className="text-center">{invoice.business}</td>
                <td className="text-center">{invoice.gstNumber}</td>
                <td className="text-center">{invoice.sgst}</td>
                <td className="text-center">{invoice.cgst}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEdit(invoice)}
                    className="btn btn-sm btn-secondary mr-2 mb-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="label">
                <span className="label-text">Business</span>
              </label>
              <input
                type="text"
                name="business"
                value={formData.business}
                onChange={handleChange}
                placeholder="Business"
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="label">
                <span className="label-text">GST Number</span>
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="GST Number"
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="label">
                <span className="label-text">SGST</span>
              </label>
              <input
                type="text"
                name="sgst"
                value={formData.sgst}
                onChange={handleChange}
                placeholder="SGST"
                className="input input-bordered w-full"
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4">
              <label className="label">
                <span className="label-text">CGST</span>
              </label>
              <input
                type="text"
                name="cgst"
                value={formData.cgst}
                onChange={handleChange}
                placeholder="CGST"
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button type="submit" className="btn btn-outline btn-primary mr-2">
              {editId ? "Update" : "Add"} Customer
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-outline btn-secondary"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleToastClose}
        />
      )}
    </>
  );
}

export default Details;
