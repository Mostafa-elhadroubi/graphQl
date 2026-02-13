# 📊 GraphQL Profile – Zone01

## 📌 Overview

This project consists of building a personal profile page using the GraphQL API provided by Zone01.

The application allows authenticated users to log in, fetch their personal data, and display statistics about their academic journey, including XP, project results, and audit ratios. It also includes a statistics section with SVG-based graphs.

This project focuses on learning:

- GraphQL (normal, nested, and argument-based queries)
- JWT authentication & authorization
- Data visualization using SVG
- UI/UX fundamentals
- Hosting a web application

---

## 🔐 Authentication

The application uses the Zone01 authentication endpoint:

https://learn.zone01oujda.ma/api/auth/signin

- Uses Basic Authentication
- Credentials are encoded in Base64 format:
  - username:password
  - or email:password
- Returns a JWT token

The JWT is used for GraphQL requests with:

Authorization: Bearer <JWT>

Invalid credentials display an error message.

A logout feature clears the token and redirects the user to the login page.

---

## 🗄 GraphQL Endpoint

https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql

The project implements:

### Normal Query

```graphql
{
  user {
    id
    login
  }
}
```

### Nested Query

```graphql
{
  result {
    id
    user {
      id
      login
    }
  }
}
```

### Query with Arguments

```graphql
{
  object(where: { id: { _eq: 3323 }}) {
    name
    type
  }
}
```

All three query types are used within the application.

---

## 📊 Profile Sections

The profile page displays:

- Basic user identification
- Total XP earned
- PASS / FAIL project ratio
- Audit ratio

Additional data may also be displayed.

---

## 📈 Statistics (SVG Graphs)

The application includes at least two SVG-based graphs built without external libraries:

1. XP Progress Over Time (Line Chart)
2. PASS / FAIL Ratio (Pie Chart or Bar Chart)

All graphs are created manually using SVG elements.

---

## 🛠 Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- GraphQL
- SVG
- JWT
- Fetch API

---

## 📂 Project Structure

```
/project-root
│
├── index.html
├── login.html
├── styles.css
├── script.js
├── graphql.js
└── README.md
```

---

## 🚀 Hosting

The project is deployed using GitHub Pages or Netlify.

Live Demo:
https://z01graphql.netlify.app/

---

## 🎯 Learning Outcomes

Through this project, I learned:

- How GraphQL differs from REST
- How to perform nested and argument-based queries
- How JWT authentication works
- How to create dynamic SVG data visualizations
- How to deploy a front-end application

---

## 👤 Author

MOSTAFA EL HADROUBI  
Master in Computer Science & Scientific Instrumentation  
Zone01 Student
