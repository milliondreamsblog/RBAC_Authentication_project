
# **Auth System**

An authentication system built with Node.js, Express, MongoDB, and Mongoose. This project provides secure user authentication, including registration, login, and session management.

---

## **Features**

- User registration with email and password
- Secure login with hashed passwords
- MongoDB integration for user data storage
- Session management for user authentication
- Scalable backend architecture
- Error handling and validation

---

## **Technologies Used**

- **Node.js**: Runtime environment for the backend.
- **Express.js**: Lightweight and fast web framework.
- **MongoDB**: NoSQL database for user data.
- **Mongoose**: ODM for MongoDB to interact with the database.

---

## **Getting Started**

### **Prerequisites**
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- A package manager like `npm` or `yarn`

---

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/auth-system.git
   cd auth-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   MONGO_URL = "mongodb+srv://admin:<password>@cluster0.zfd80.mongodb.net/"
   JWT_SECRET = "Hare Krishna"
   JWT_SERECT_ADMIN  = "Hare Krishna"
   ```
   REFER .evn.expample.file

   Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

---

## **Project Structure**

```
auth-system/
├── src/
│   ├── config/
│   │   └── db.js       # Database connection
│   ├── middleware/
│   │   └── auth.js     # Authentication middleware
│   ├── models/
│   │   └── User.js     # User model schema
│   ├── routes/
│   │   └── auth.js     # Routes for authentication
│   ├── app.js          # Express application setup
│   └── server.js       # Application entry point
├── .env                # Environment variables
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

---

## **Usage**

### **Endpoints**
Refer this to access sample run test for all -- https://periodic-sorrel-126.notion.site/Instruction-to-run-the-project-14d81f6e8c9280dea1d2f5f0eddc532e?pvs=4
| Method | Endpoint       | Description            |
|--------|----------------|------------------------|
| POST   | `/api/register` | Register a new user    |
| POST   | `/api/login`    | Login with credentials |
| GET    | `/api/profile`  | Get user profile       |

### **Test the API**
You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [cURL](https://curl.se/)

---

## **Contributing**

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

For any inquiries, reach out to:

- **Name**: Akshat Darshi  
- **Email**: akshatsan23@gmail.com
- **GitHub**: [milliondreamsblog]((https://github.com/milliondreamsblog))
