# IMF Gadget API

A secure and fully functional REST API built using **Node.js**, **Express.js**, and **PostgreSQL**, designed for the Impossible Missions Force (IMF) to manage and track high-tech gadgets. Includes secure authentication, gadget inventory features, and fun mission-based functionality like simulated self-destruct.

## Live API
 [https://imf-gadget-api-1oxy.onrender.com](https://imf-gadget-api-1oxy.onrender.com)

##  Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (via Railway)
- **Authentication**: JWT (JSON Web Token)
- **Deployment**: Render (API) + Railway (DB)

---

##  Features

-  Agent registration and login with JWT auth
-  Protected routes for gadget management
-  Create, update, soft-delete (decommission) gadgets
-  Self-destruct endpoint with confirmation code
-  Filter gadgets by status
-  Clean JSON API responses for easy integration

---

##  API Endpoints

###  Auth

- `POST /auth/register` → Register agent  
- `POST /auth/login` → Login & receive JWT

###  Gadgets

> All below routes require `Authorization: Bearer <token>`

- `GET /gadgets` → Get all gadgets with random mission success probability
- `GET /gadgets?status=Available` → Filter by status
- `POST /gadgets` → Add gadget (codename auto-generated)
- `PATCH /gadgets/:id` → Update gadget
- `DELETE /gadgets/:id` → Soft-delete (mark as "Decommissioned")
- `POST /gadgets/:id/self-destruct` → Simulate code-triggered destruction

---

##  Authorization

Use the JWT token from login in request headers:
```http
Authorization: Bearer <your_token_here>
