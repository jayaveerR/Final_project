# 🎓 Student Payment Tracker (Blockchain-Powered)

A decentralized *Student Payment Tracking System* built using *React.js* for the frontend and *Aptos Move* smart contracts for secure blockchain-based payment storage.  
The system allows students to pay tuition, hostel, and bus fees in *APT tokens*, store transaction details immutably, and download verifiable receipts.

---

## 🚀 Project Overview
The *Student Payment Tracker* ensures transparent, tamper-proof, and automated fee management for universities.  
It leverages *Aptos blockchain* to store payment records, enabling both students and administrators to track payments without relying on centralized systems.

---

## ✨ Features

### Core Features
- *Student Sign-In & Wallet Connection* – Secure login with blockchain wallet connect/disconnect.
- *Student Payment Submission* – Pay tuition, hostel, and bus fees in *APT tokens*.
- *Blockchain Storage* – Immutable recording of payments with transaction hashes.
- *PDF Receipt Generation* – Downloadable receipts with payment details.
- *Payment Status Handling* – Success and failure pages with redirection logic.

### Extra Functionalities (Hackathon Judge Impressors)
- 📜 *Transaction History Page* – View all past payments (fetched from blockchain).
- 💳 *Partial Payments* – Support for installment-based payments until dues are cleared.
- 📧 *Email Notifications* – Automatic email with receipt upon successful payment.
- 🛠 *Admin Dashboard* – View all students’ payment histories (restricted to admins).

---

## 🛠 Tech Stack

### Frontend
- *React.js* (no Vite)
- *TailwindCSS* or *Material UI* for styling
- *Aptos Wallet Adapter* for wallet integration

### Backend
- *Node.js* + *Express.js* (API layer)
- *Nodemailer* / *SendGrid* for email notifications
- *PDFKit* / *jspdf* for receipt generation with QR codes

### Blockchain
- *Aptos Move* smart contracts
- Stores student payment records & supports payment verification
- Integrates with Aptos wallet for APT token transactions

---

## 📂 Project Structure
