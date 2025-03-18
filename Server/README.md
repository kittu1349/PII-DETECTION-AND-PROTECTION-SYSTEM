# User Data Encryption Backend

This project is a backend application built with Express and Node.js that focuses on secure user data encryption. It employs hashing and AES encryption to protect user data before storing it in the database. Users can only access their data after successfully logging in.

## Features

- User registration with encrypted data storage
- Secure login system
- AES encryption for user data
- Hashing for password protection
- Access control to ensure users can only view their own data

## Installation

To set up this project locally, follow these steps:

1. Clone the repository: git clone https://github.com/Ricky-saha/Encryption
2. cd Encryption
3. Install dependencies: npm install
4. Set up environment variables:
   Create a `.env` file in the root directory and add the  variables from the env_sample file:
5. start the server :- npm run dev
   
 ## Usage

After starting the server, you can interact with the API using tools like Postman  Here are some example endpoints:

- `POST /register`: Register a new user
- `POST /login`: Log in a user

Refer to the API documentation for detailed information on request/response formats and authentication requirements.

## Security

This project implements several security measures:

- AES encryption for sensitive user data
- JWT for secure authentication
- HTTPS recommended for production use


