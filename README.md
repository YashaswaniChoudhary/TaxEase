# [TaxEase - Smart Tax Assistant 🚀](https://github.com/YashaswaniChoudhary/TaxEase)

TaxEase is an intelligent tax assistant built with the **MERN stack** to simplify tax calculations, minimize errors, and automate tax filing.  

Designed for **Google Girl Hackathon 2025**, this project helps individuals and small businesses with tax compliance by providing:  
✅ **User Authentication**  
✅ **Automated Tax Computations**  
✅ **Future AI-powered Assistance**

---

## 📌 Table of Contents  
- [🌟 Features](#-features)  
- [🛠️ Tech Stack](#️-tech-stack)  
- [⚙️ Setting Up the Project](#️-setting-up-the-project)  
  - [Prerequisites](#prerequisites)  
  - [Clone the Repository](#clone-the-repository)  
  - [Backend Setup](#backend-setup)  
  - [Frontend Setup](#frontend-setup)  
- [🔗 API Endpoints](#-api-endpoints)  
- [📌 Future Improvements](#-future-improvements)  
- [🤝 Contributing](#-contributing)  
- [📄 License](#-license)  
- [📧 Contact & Support](#-contact--support)  

---

## 🌟 Features  
✅ **User Authentication** - Secure login & registration with JWT  
✅ **Tax Calculation** - Automatic tax computation based on income & deductions  
✅ **Deductions & Exemptions** - Identifies possible tax benefits  
✅ **Error Minimization** - Prevents miscalculations in tax filing  
✅ **User Dashboard** - Overview of tax summary & filing status  
✅ **AI-powered Assistance (Future Update)** - Personalized tax suggestions  

---

## 🛠️ Tech Stack  
- **[MongoDB](https://www.mongodb.com/)** - Database for storing user details & tax records  
- **[Express.js](https://expressjs.com/)** - Backend framework to handle API requests  
- **[React.js](https://react.dev/)** - Frontend for an interactive UI  
- **[Node.js](https://nodejs.org/)** - Runtime for executing JavaScript on the server  
- **[Mongoose](https://mongoosejs.com/)** - ODM for MongoDB to manage schemas  
- **[JWT](https://jwt.io/)** - Authentication & security  

---

## ⚙️ Setting Up the Project  

### 1️⃣ Prerequisites  
Ensure you have the following installed:  
- **[Node.js](https://nodejs.org/)**  
- **[MongoDB](https://www.mongodb.com/)**  
- **[Git](https://git-scm.com/)**  
- **[VS Code](https://code.visualstudio.com/)** (Recommended for development)  

## 2️⃣ Clone the Repository  
```bash
git clone https://github.com/YashaswaniChoudhary/TaxEase.git
cd TaxEase
```
## 3️⃣ Backend Setup  
Navigate to the **backend** folder and install dependencies:  
```bash
cd backend
npm install

```env
Create a .env file in the backend folder and add the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
(Replace mongodb_connection with your actual MongoDB connection string.)

Run the backend server:
npm start
The backend should now be running at http://localhost:5000 🎯

## 4️⃣ Frontend Setup
Navigate to the **frontend** folder and install dependencies:
```
cd ../frontend
npm install

```frontend
Run the frontend server:
npm run dev
```
The frontend should now be running at http://localhost:5173 🎯

## 🔗 API Endpoints
📝 Authentication  
Method-Route-Description  
`POST /api/register`	Register a new user  
`POST /api/login`	Authenticate user & return JWT  
`GET /api/profile`	Get user profile (Requires JWT)  
(More APIs will be added as development progresses.)


## 📌 Future Improvements
🚀 AI-powered tax assistant for personalized tax suggestions  
📊 Graphical tax insights to visualize deductions & liabilities  
📑 File upload support for tax documents & receipts

## 🤝 Contributing

Want to help improve TaxEase? Follow these steps:

Fork the repository  
Create a branch (git checkout -b feature-branch)  
Commit your changes (git commit -m "Added new feature")  
Push to GitHub (git push origin feature-branch)  
Open a pull request 🚀

## 📄 License
📜 MIT License - Free to use and modify

## 📧 Contact & Support
💡 Have questions? Reach out via [your email or GitHub discussions]

🔗 GitHub Repository:[TaxEase - A Smart Tax Assistant](https://github.com/YashaswaniChoudhary/TaxEase)
