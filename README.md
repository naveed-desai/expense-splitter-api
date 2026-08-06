# Group Expense Splitter - Backend

This is the backend for the Group Expense Splitter application, built using Node.js, Express.js, and MongoDB. It provides REST APIs to manage groups, record shared expenses, calculate member balances, and track settlements between members.

## Features

- Create and manage groups
- Add members to groups
- Record shared expenses
- Split expenses equally or by custom percentages
- Automatically calculate member balances
- Record settlements between members
- Validate requests using Joi
- Log HTTP requests with Morgan and application logs with Winston

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Joi
- Morgan
- Winston

## Getting Started

### Install dependencies

```bash
npm install
```

### Create a `.env` file

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense_splitter_db
```

### Run the project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

The server will start on:

```
http://localhost:5000
```

## API Endpoints

### Health

```
GET /api/v1/health
```

### Groups

```
POST /api/v1/groups
GET  /api/v1/groups
GET  /api/v1/groups/:id
POST /api/v1/groups/:groupId/members
GET  /api/v1/groups/:groupId/available-users
```

### Expenses

```
POST /api/v1/groups/:groupId/expenses
GET  /api/v1/groups/:groupId/expenses
```

### Settlements

```
POST /api/v1/groups/:groupId/settlements
GET  /api/v1/groups/:groupId/settlements
```