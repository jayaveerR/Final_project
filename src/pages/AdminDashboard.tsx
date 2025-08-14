import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const navigate = useNavigate();

  // On mount, check wallet and load data
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (!savedAddress) {
      navigate("/admin");
    } else {
      setWalletAddress(savedAddress);
    }

    const storedPayments = localStorage.getItem("payments");
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    }
  }, [navigate]);

  // Disconnect wallet
  const handleDisconnect = async () => {
    try {
      if (window.aptos) {
        await window.aptos.disconnect();
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
    localStorage.removeItem("walletAddress");
    navigate("/admin");
  };

  // Clear all payment data
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all payment records?")) {
      localStorage.removeItem("payments");
      setPayments([]);
    }
  };

  return (
    <div className="p-6">
      {/* Header with wallet info */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Payment Details</h1>
        {walletAddress && (
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg shadow">
            <span className="font-mono text-sm">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
            </span>
            <button
              onClick={handleDisconnect}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Disconnect
            </button>
            <button
              onClick={handleClearData}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Clear All Data
            </button>
          </div>
        )}
      </div>

      {/* Payments table */}
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">S.No</th>
              <th className="py-2 px-4 border">Student Name</th>
              <th className="py-2 px-4 border">College Name</th>
              <th className="py-2 px-4 border">Year</th>
              <th className="py-2 px-4 border">Course</th>
              <th className="py-2 px-4 border">Roll No</th>
              <th className="py-2 px-4 border">Fee Type</th>
              <th className="py-2 px-4 border">Amount (APT)</th>
              <th className="py-2 px-4 border">Transaction Hash</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{p.studentName}</td>
                <td className="py-2 px-4 border">{p.collegeName}</td>
                <td className="py-2 px-4 border">{p.year}</td>
                <td className="py-2 px-4 border">{p.course}</td>
                <td className="py-2 px-4 border">{p.rollNumber}</td>
                <td className="py-2 px-4 border">{p.feeType}</td>
                <td className="py-2 px-4 border">{p.amount}</td>
                <td className="py-2 px-4 border text-blue-600 underline">
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${p.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                </td>
                <td className="py-2 px-4 border">
                  {new Date(p.date).toLocaleString()}
                </td>
                <td className="py-2 px-4 border">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
