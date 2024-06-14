import React, { useState, useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // const closeToast = () => {
  //   setVisible(false);
  //   onClose();
  // };

  if (!visible) return null;

  return (
    <div
      className={`toast toast-top toast-end opacity-100 transform translate-y-0 transition-transform ease-in-out duration-300`}
    >
      <div className={`alert ${type}`}>
        <span>{message}</span>
      </div>
      {/* <button onClick={closeToast} className="btn btn-clear float-right"></button> */}
    </div>
  );
};

export default Toast;
