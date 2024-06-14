import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { FaFileInvoice } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Toast from "../components/Toast";
import { IoFilter } from "react-icons/io5";
import { RxReset } from "react-icons/rx";

function Record() {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: invoiceDetails, error } = useSWR(
    "/api/records/record",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  const [toast, setToast] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nameOptions, setNameOptions] = useState([]);
  const [inputWidth, setInputWidth] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    if (invoiceDetails) {
      setFilteredRecords(invoiceDetails);
    }
  }, [invoiceDetails]);

  useEffect(() => {
    if (invoiceDetails && nameFilter) {
      const options = Array.from(
        new Set(
          invoiceDetails
            .filter((record) =>
              record.name.toLowerCase().startsWith(nameFilter.toLowerCase())
            )
            .map((record) => record.name.trim())
        )
      );
      console.log("Filtered Options:", options);
      setNameOptions(options);
    } else {
      setNameOptions([]);
    }
  }, [nameFilter, invoiceDetails]);

  const handleDownloadInvoice = (record) => {
    const {
      id,
      date,
      name,
      address,
      business,
      gstNumber,
      sgst,
      cgst,
      stocks,
      MarketValue,
      total,
    } = record;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Draw border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Add title and other text
    doc.setFontSize(20);
    doc.text("Invoice", 14, 22);

    // Invoice Details
    doc.setFontSize(12);
    doc.text(`Invoice No: IOX${id}`, 14, 32);
    doc.text(`Date: ${date}`, 14, 38);
    doc.text(`GST Number: ${gstNumber}`, 14, 44);

    // Pay To
    doc.text("Pay To:", 14, 64);
    doc.text(name + ",", 14, 70);
    doc.text(address, 14, 76);

    // Table Content
    const tableData = [
      ["Business", "Stocks", "Market Value", "Total"],
      [business, stocks, `$${MarketValue}`, `$${stocks * MarketValue}`],
    ];

    // Generate table
    doc.autoTable({
      startY: 90,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: "grid",
    });

    // Subtotal, SGST, CGST, Total
    const finalY = doc.autoTable.previous.finalY;

    doc.setFontSize(10);
    doc.text(`SUBTOTAL: $${stocks * MarketValue}`, 140, finalY + 10);
    doc.text(`SGST: $${sgst}`, 140, finalY + 16);
    doc.text(`CGST: $${cgst}`, 140, finalY + 22);
    doc.text(`TOTAL: $${total}`, 140, finalY + 28);

    // Footer
    doc.text("Thank you for your business!", 14, finalY + 40);

    doc.save(`invoice_IOX${id}.pdf`);

    setToast({
      message: "Invoice downloaded successfully!",
      type: "alert-success",
    });
  };

  const handleToastClose = () => {
    setToast({});
  };

  const handleFilterClick = () => {
    setFilterOpen(!filterOpen);
  };

  const handleFilterApply = () => {
    if (!nameFilter && !dateFilter) {
      setToast({
        message: "No filters applied.",
        type: "alert-error",
      });
      setFilterOpen(false);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      const filtered = invoiceDetails.filter(
        (record) =>
          record.name.toLowerCase().startsWith(nameFilter.toLowerCase()) &&
          record.date.includes(dateFilter)
      );
      if (filtered.length === 0) {
        setToast({
          message: "No data found.",
          type: "alert-error",
        });
        setFilteredRecords(invoiceDetails);
        setIsFiltered(false);
      } else {
        setFilteredRecords(filtered);
        setIsFiltered(true);
      }
      setFilterOpen(false);
      setIsTransitioning(false);
    }, 300);
  };

  const handleResetFilter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setNameFilter("");
      setDateFilter("");
      setFilteredRecords(invoiceDetails);
      setFilterOpen(false);
      setIsFiltered(false);
      setIsTransitioning(false);
    }, 300);
  };

  const handleNameInputChange = (e) => {
    const inputValue = e.target.value.trim().toLowerCase();
    setNameFilter(inputValue);
    setInputWidth(inputRef.current.getBoundingClientRect().width);
  };

  const handleNameOptionClick = (name) => {
    setNameFilter(name);
    setNameOptions([]);
  };

  if (error) return <div>Error loading data.</div>;
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
          <p className="text-3xl">Records</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2 ml-4">
        <div className="flex items-center">
          <button className="hover:text-primary" onClick={handleFilterClick}>
            <IoFilter className="text-xl mr-2" />
          </button>
          {(filterOpen || isFiltered) && (
            <button className="hover:text-primary" onClick={handleResetFilter}>
              <RxReset className="text-xl" />
            </button>
          )}
        </div>
      </div>
      <div
        className={`transition-all duration-300 ease-in-out ${
          filterOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col mb-4 p-4 rounded-lg">
          <div className="flex items-center mb-2 relative">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                placeholder="Name"
                value={nameFilter}
                onChange={handleNameInputChange}
                className="grow"
                ref={inputRef}
              />
            </label>
            {nameOptions.length > 0 && (
              <ul
                className="absolute z-10 bg-base-100 mt-1 rounded-md shadow-lg max-h-60 overflow-auto top-full"
                style={{ width: `${inputWidth}px` }}
              >
                {nameOptions.map((name, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-base-300 cursor-pointer"
                    onClick={() => handleNameOptionClick(name)}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center mb-3">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="grow"
              />
            </label>
          </div>
          <div className="flex justify-start">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleFilterApply}
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      <div
        className={`overflow-x-auto transition-opacity duration-300 ease-in-out ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <table className="table">
          <thead>
            <tr>
              <th className="text-center text-base">Date</th>
              <th className="text-center text-base">Name</th>
              <th className="text-center text-base">Address</th>
              <th className="text-center text-base">Business</th>
              <th className="text-center text-base">GST Number</th>
              <th className="text-center text-base">SGST</th>
              <th className="text-center text-base">CGST</th>
              <th className="text-center text-base">Stocks</th>
              <th className="text-center text-base">Market Value</th>
              <th className="text-center text-base">Total</th>
              <th className="text-center text-base">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td className="text-center">{record.date}</td>
                <td className="text-center">{record.name}</td>
                <td className="text-center">{record.address}</td>
                <td className="text-center">{record.business}</td>
                <td className="text-center">{record.gstNumber}</td>
                <td className="text-center">{record.sgst}</td>
                <td className="text-center">{record.cgst}</td>
                <td className="text-center">{record.stocks}</td>
                <td className="text-center">{record.MarketValue}</td>
                <td className="text-center">{record.total}</td>
                <td className="text-center">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleDownloadInvoice(record)}
                  >
                    <FaFileInvoice />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast.message && (
        <Toast message={toast.message} type={toast.type} onClose={handleToastClose} />
      )}
    </>
  );
}

export default Record;
