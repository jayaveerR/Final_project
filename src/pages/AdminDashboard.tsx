import React, { useEffect, useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const storedPayments = localStorage.getItem("payments");
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Payment Details</h1>
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
                  <a href={`https://explorer.aptoslabs.com/txn/${p.transactionHash}`} target="_blank" rel="noreferrer">
                    View
                  </a>
                </td>
                <td className="py-2 px-4 border">{new Date(p.date).toLocaleString()}</td>
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
