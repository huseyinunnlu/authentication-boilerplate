# Express.js Authentication API Boilerplate

This is a project could be use as a starting point for APIs that require user authentication (registration and sign on).
Sign on sessions are showcased with protected routes that pass through authentication middleware. API is designed to be
consumed by a SPA.

### WIP:

- CLI for easy setup
- Social auth (Google, Facebook, Twitter, etc.)
- Some refactoring

### Tech Stack

- [Node.js](https://nodejs.org/en) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Node.js framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript superset
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JSON Web Tokens for authentication
- [Yup](https://www.npmjs.com/package/yup) - Schema validation
- [Nodemailer](https://nodemailer.com/) - Email sending
- [Agenda](https://github.com/agenda/agenda) - Job scheduling

## Project Setup

To run project locally:

```bash
# Clone repo
$ git clone https://github.com/huseyinunnlu/authentication-boilerplate.git

# Go to project directory
$ cd authentication-boilerplate

# Install dependencies
$ bun install
```

After installing dependencies, you need to create a `.env` file in the root directory of the project. You can
use `.env.example` file as a template.

```bash
# Copy and rename .env.example file to .env or .env.{envoirement_name}
$ cp .env.example .env
```

After creating `.env` file, you need to set your environment variables.

```bash
PORT=
DB_CONNECTION_URL=
SECRET_KEY=
SMTP_EMAIL_HOST=
SMTP_EMAIL_PORT=
SMTP_EMAIL_USERNAME=
SMTP_EMAIL_PASSWORD=
SMTP_EMAIL_SERVICE=
SMTP_EMAIL_FROM_NAME=
```

And then, you can run the project with the following command:

```bash
# Run project
$ bun dev
```

Other commands:

```bash
# Build project
$ bun build
```

## Overview of the Project

### Project Structure

```
.
├── src
│   ├── clients
│   │   └── emailService.ts # Email service client (Nodemailer)
│   ├── constants
│   │   └── index.ts # Constants
│   │   └── enums.ts # Enums
│   │   └── routeUrls.ts # Url constants for routes
│   ├── controllers
│   │   └── authController.ts # Auth controller
│   ├── databases
│   │   └── index.ts # Database connection
│   ├── jobs
│   │   └── index.ts # Initialize jobs (Agenda)
│   ├── middlewares
│   │   └── auth.ts # Authentication middleware
│   │   └── common.ts # Common middlewares
│   ├── models
│   │   └── registerOtpCode.ts # Register OTP code model to store register OTP codes
│   │   └── user.ts # User model
│   │   └── renewPasswordOtpCode.ts # Renew password OTP code model to store renew password requests OTP codes
│   ├── routes
│   │   └── auth.ts # Auth routes
│   │   └── index.ts # Main router to combine all routes
│   ├── services
│   │   └── authService.ts # Auth service
│   ├── types
│   │   └── index.ts
│   │   └── auth.ts # Auth types
│   │   └── baseRepository.ts # Base repository types
│   │   └── common.ts # Common types 
│   │   └── emailClients.ts # Email service client types
│   │   └── helpers.ts # Helper functions types
│   └── utils
│   │   └── helpers.ts # Helper functions types
│   └── validation
│   │   └── index.ts # Export all Yup validation schemas and custom validation rules
│   │   └── customRules
│   │   │   └── auth.ts # Custom validation rules for auth
│   │   └── schemas
│   │   │   └── auth.ts # Yup validation schemas for auth
│   └── server.ts # Express app
├── .env.example # Example .env file
├── .gitignore
├── .package.json
```

### API Endpoints

- ### Register

Register have three steps. First step is to send OTP code to user's email address. Second step verify OTP code. Third step is register user.

#### Send OTP Code to User's Email Address

```shell
curl --location 'http://localhost:8080/api/auth/createsignuprequest' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "huseyinunnlu@gmail.com"
}'
```

Example response:

```json
{
  "referenceId": "h5prmsVKOggifHEro5uNSntGTcNfk2JyWxWNfukHfJ7zS6fTRPEKN4eW1Q6PYoHt9AjsZvJEB42UbgKOzoJlktCzSdbt7GPv3jj9J71cmxgoT45gZDZNyYwbAFBxk",
  "remainingTime": 299,
  "status": "ok",
  "message": "Email sent"
}
```
Notes:
- That `referenceId` is required for the second step.
- `remainingTime` is the remaining time for OTP code to expire in seconds.


#### Enter OTP Code sent to User's Email Address with referenceId for verify.

```shell 
curl --location 'http://localhost:8080/api/auth/verifysignupotpcode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "huseyinunnlu@gmail.com",
    "otpCode": "814531",
    "referenceId": "BxB9jHu2UkKS0zpcoSJSoU0Xkl4Rul12oNczsSuMaZKf0fWV97bYdyXADjho1hSlJkb0I3TqgqhKqtK0n3oGwaSTwiZdbZcZy7BxsysKe1sGf0O896eW3yXzxRBk4"
}'
```

Example response:

```json
{
  "status": "ok",
  "message": "User verified",
  "data": {
    "email": "example@example.com",
    "referenceId": "rSTw5ltyp8eATl2Jq59h2bUFNU00x5cQmDNlFsXNhahVAR9F38y3oPRcc7NHOJM7HXQM1bUCxw8kLef1QfUXzmjzI2j5QbTG5VGLE1vlSZX8JVc6Qf1UnKY1EkI1y",
    "requestId": "iPWQ9mzpPu5FgyqvyeAiraIFS1VlXbH5PWmkL9BT4GZy3s1InAmOB4Uy3guVyZbx7smSqJ87GCuJD88PnFp84ORgaqa5XT8jnpLfkrxy2aTnLCs6a06uo25rthOU3"
  }
}
```

Notes:
- That `requestId` and `referenceId` is required for the last step.

#### Final step for register user.

```shell
curl --location 'http://localhost:8080/api/auth/sign-up' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Test",
    "lastName": "Test",
    "email": "example@example.com",
    "password": "Test12..",
    "passwordConfirmation": "Test12..",
    "referenceId": "rSTw5ltyp8eATl2Jq59h2bUFNU00x5cQmDNlFsXNhahVAR9F38y3oPRcc7NHOJM7HXQM1bUCxw8kLef1QfUXzmjzI2j5QbTG5VGLE1vlSZX8JVc6Qf1UnKY1EkI1y",
    "requestId": "iPWQ9mzpPu5FgyqvyeAiraIFS1VlXbH5PWmkL9BT4GZy3s1InAmOB4Uy3guVyZbx7smSqJ87GCuJD88PnFp84ORgaqa5XT8jnpLfkrxy2aTnLCs6a06uo25rthOU3"
}'
```

Example response:

```json
{
  "status": "ok",
  "message": "User created",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJUZXN0IiwiZW1haWwiOiI2YWg5eHcydjE1QHBpcm9sc25ldC5jb20iLCJpYXQiOjE3MDQ5OTIzNzIsImV4cCI6MTcwNDk5NTk3Mn0.yki1TAUaNvxd8gUIsyA1imI3IUZNLf9KR6hJRgusdYg"
}
```


- ### Log In

```shell
curl --location 'http://localhost:8080/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "example@example.com",
    "password": "Test12..."
}'
```

Example response:

```json
{
    "status": "ok",
    "message": "Logged in succesfully",
    "user": {
        "firstName": "Test",
        "lastName": "Test",
        "email": "example@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJUZXN0IiwiZW1haWwiOiJodXNleWludW5ubHVAZ21haWwuY29tIiwiaWF0IjoxNzA0OTkyNTQwLCJleHAiOjE3MDU1OTczNDB9.a_XfxArfNR9HOSfjZQCXE1pmNp7DJEndY9aY8prMt2o"
}
```

- ### Verify JWT token

```shell
curl --location 'http://localhost:8080/api/auth/verifyToken?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJUZXN0IiwiZW1haWwiOiJodXNleWludW5ubHVAZ21haWwuY29tIiwiaWF0IjoxNzA0OTkyNTQwLCJleHAiOjE3MDU1OTczNDB9.a_XfxArfNR9HOSfjZQCXE1pmNp7DJEndY9aY8prMt2o
```

Example response:

```json
{
  "status": "ok",
  "message": "Token verified",
  "data": {
    "firstName": "Test",
    "lastName": "Test",
    "email": "huseyinunnlu@gmail.com",
    "iat": 1704992540,
    "exp": 1705597340
  }
}
```
Notes:
- This endpoint can also get token from header or cookie.

```shell
x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJUZXN0IiwibGFzdE5hbWUiOiJUZXN0IiwiZW1haWwiOiJodXNleWludW5ubHVAZ21haWwuY29tIiwiaWF0IjoxNzA0OTkyNTQwLCJleHAiOjE3MDU1OTczNDB9.a_XfxArfNR9HOSfjZQCXE1pmNp7DJEndY9aY8prMt2o
```

- ### Renew Password

Renew password have three steps. First step is to send OTP code to user's email address. Second step is to verify OTP code. Third step is to renew password.

#### Send OTP Code to User's Email Address

```shell
curl --location 'http://localhost:8080/api/auth/sendrenewpasswordotpcode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "example@example.com"
}'
```

Example response:

```json
{
  "referenceId": "h5prmsVKOggifHEro5uNSntGTcNfk2JyWxWNfukHfJ7zS6fTRPEKN4eW1Q6PYoHt9AjsZvJEB42UbgKOzoJlktCzSdbt7GPv3jj9J71cmxgoT45gZDZNyYwbAFBxk",
  "remainingTime": 299,
  "status": "ok",
  "message": "Email sent"
}
```

Notes:
- That `referenceId` is required for the second step.
- `remainingTime` is the remaining time for OTP code to expire in seconds.

#### Enter OTP Code sent to User's Email Address with referenceId for verify.

```shell
curl --location 'http://localhost:8080/api/auth/verifyrenewpasswordotpcode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "example@example.com",
    "otpCode": "292540",
    "referenceId": "h5prmsVKOggifHEro5uNSntGTcNfk2JyWxWNfukHfJ7zS6fTRPEKN4eW1Q6PYoHt9AjsZvJEB42UbgKOzoJlktCzSdbt7GPv3jj9J71cmxgoT45gZDZNyYwbAFBxk"
}'
```

Example response:

```json
{
    "status": "ok",
    "message": "User verified",
    "data": {
        "referenceId": "wDx5sm2yUZPjgsFnP5QewdZ6jQPAl87ElmU8UgddNfYypR6wntNtZL8a51fvpbgxZjBTn0fiX11NXy1fLJkgJ8ht3MxtQBrqInYQ9Ke9BGxq5Wkk1rxQMuSLzfyn4",
        "email": "example@example.com",
        "requestId": "z78hVuAWxILR9fB8dhLWASTumNnm88TXK55983hnSGgNjf8Wkc479iyJcMwxyyT9KPkCda0BVhFA7mSMI3MjrHcTWamm0s6LFqa0JWvsSupqiPmCgcUFWhQb3S8uG"
    }
}
```

Notes:
- That `requestId` and `referenceId` is required for the last step.

#### Final step for renew password.

```shell
curl --location 'http://localhost:8080/api/auth/renewpassword' \
--header 'Content-Type: application/json' \
--data-raw '{
    "referenceId": "KkKzciZ4oX0hHw7fziuuKonNX90uZqEWvRmZzrm5lyPzuuasu0kjzkFTEsfR26bYbuTe6yKuBhHOkeMDaKEnLxG9BG8xsKXJjs2LF0mRWpKy5YFrcO4dLbdPLUZqo",
    "email": "example@example.com",
    "requestId": "4BevKGGwiGIHNHitiTX9yd3FPXtkq2jSYlmHUGMkek7au7eilnVqTqy0oBcW3zVFzfVntWVjOQv02GtLwFftDvePnLhMXVGVuG8ZHqfZhxJVB8Fm327c1UTXDMv4S",
    "password": "Test12...",
    "passwordConfirmation": "Test12..."
}'
```

Example response:

```json
{
  "status": "ok",
  "message": "Password renewed",
  "data": {
    "email": "6ah9xw2v15@pirolsnet.com"
  }
}
```








    











 



 


