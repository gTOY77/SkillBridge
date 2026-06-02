# SkillBridge

A micro freelance marketplace platform designed exclusively for university students, enabling them to offer and hire academic/digital support services securely.

## Contributors
- **Iffat Ara Mina**
- **Avisheek Pal Joy**
- **Ahmed Rawnak Ishrak Bhuban**
- **Md. Abu Shifat**

## Project Overview
SkillBridge bridges the gap between students seeking academic assistance and those with specialized skills. The platform supports secure project posting, bidding, real-time messaging, project tracking, and payment simulation—all within a student-focused ecosystem with role-based access control (Client, Expert, Admin).

## Tech Stack

### Frontend Technologies
- **React**: v19.2.0 - UI library for single-page applications
- **React Router DOM**: v7.13.1 - Client-side routing
- **Vite**: v7.3.1 - Build tool and dev server
- **Axios**: v1.13.6 - HTTP client for API communication
- **Socket.io-client**: v4.8.3 - Real-time bidirectional communication
- **Lucide React**: v1.14.0 - Icon library
- **Framer Motion**: v12.38.0 - Animation library
- **React Dropzone**: v15.0.0 - File upload component
- **Emoji Picker React**: v4.19.1 - Emoji selection component

### Backend Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: v4.22.1 - Backend web framework
- **Socket.io**: v4.8.3 - Real-time engine
- **Mongoose**: v9.2.3 - MongoDB ODM
- **JSON Web Token (jsonwebtoken)**: v9.0.3 - Authentication
- **bcryptjs**: v3.0.3 - Password hashing
- **CORS**: v2.8.6 - Cross-origin resource sharing
- **dotenv**: v17.3.1 - Environment variable management
- **Multer**: v2.1.1 - File upload middleware
- **Nodemailer**: v8.0.7 - Email sending
- **Stripe**: v22.1.0 - Payment processing library (simulated)
- **Crypto-js**: v4.2.0 - Encryption utilities

### Database & Storage
- **MongoDB Atlas**: Cloud-hosted NoSQL database
- **MongoDB Node.js Driver**: v7.1.0

### DevOps & Tools
- **ESLint**: v9.39.1 - Code linting
- **@vitejs/plugin-react**: v5.1.1 - Vite React plugin

## Core Features

### User Roles & Authentication
- Role-based access control (Client, Expert, Admin)
- Secure JWT-based authentication
- Email OTP verification
- Password hashing with bcryptjs

### Client Features
- Post projects with detailed requirements
- Browse and filter expert profiles
- Review and accept/reject bids
- Real-time messaging with experts
- Track project progress
- Simulated payment workflow
- Transaction history
- Real-time notifications

### Expert Features
- Browse available projects
- Place bids on projects
- Manage personal profile and skills
- Real-time messaging with clients
- Mark projects as complete
- Earnings tracking
- Transaction history
- Real-time notifications

### Admin Features
- User management
- Project moderation
- Report handling
- System monitoring

### Real-Time Features
- Instant messaging
- Live notifications
- Dashboard counter updates
- Project status sync

### Payment System
- Multi-step payment simulation workflow
- Payment method selection
- Immutable transaction audit trail
- Dual notifications (client & expert)
- Dynamic earnings stats
- Payment history tables

## System Architecture
SkillBridge follows a modern 3-tier architecture:

1. **Frontend**: React SPA served by Vite, communicating via REST APIs and Socket.io
2. **Backend**: Express.js server with RESTful endpoints and Socket.io integration
3. **Database**: MongoDB Atlas with Mongoose ODM for data modeling

## Local Environment Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## Usage Guidelines
1. Register as either a Client or Expert
2. Complete your profile and add skills (if Expert)
3. Clients: Post projects and review bids
4. Experts: Browse projects and place bids
5. Once a bid is accepted, use the real-time chat to collaborate
6. Experts: Mark projects as complete when done
7. Clients: Process payment for completed projects

## License
ISC
