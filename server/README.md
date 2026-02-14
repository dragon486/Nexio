# 🚀 Arlo.ai — AI Lead & Sales Automation Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-61dafb.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6.x-green.svg)

Arlo.ai is a **full-stack AI-powered lead generation and sales automation web application** designed to automate customer acquisition, engagement, follow-ups, and sales workflows using Artificial Intelligence.

The platform helps businesses **capture leads, qualify prospects, automate conversations, schedule follow-ups, and drive conversions** — all without manual sales effort.

---

## ✨ Key Features

- 🤖 **AI Lead Qualification & Scoring** - Automatically evaluate and prioritize leads
- 📨 **Automated Follow-ups & Messaging Workflows** - Set-and-forget communication sequences
- 🧠 **AI-powered Sales Assistant** - Intelligent responses and recommendations
- 📊 **Lead Analytics & Conversion Tracking** - Real-time insights and metrics
- 🔐 **JWT-based Authentication System** - Secure user management
- 🏢 **Multi-tenant Business Accounts** - Support for multiple organizations
- ⚡ **Real-time API-based Automation** - Fast, responsive workflows
- 🌐 **Modern Responsive UI** - Works seamlessly across all devices

---

## 🏗️ Tech Stack

### Frontend
- **React.js** (Vite) - Fast, modern development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT Authentication** - Secure token-based auth
- **REST APIs** - Standard API architecture

### Database
- **MongoDB** - NoSQL database
- **Mongoose ODM** - Object modeling

### AI
- **OpenAI API** - LLMs + Automation Logic

---

## 🧠 System Architecture

```
React (Client) → Express API → MongoDB
                      ↓
                 OpenAI API
```

---

## 📁 Project Structure

```
arlo-ai/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                 # Node.js Backend
    ├── config/            # Configuration files
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    ├── .env             # Environment variables
    ├── package.json
    └── server.js        # Entry point
```

---

## 🔐 Authentication Flow

1. **User Registration** - Create new account
2. **Secure Password Hashing** - Using bcrypt
3. **JWT Token Generation** - Session management
4. **Protected Routes** - Middleware verification
5. **Token-based Session Management** - Stateless authentication

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/arlo-ai.git
cd arlo-ai
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the `server/` directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
```

Start backend server:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

The application should now be running at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000

---

## 🧪 API Testing (Terminal)

### Register User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Adel","email":"adel@test.com","password":"123456"}'
```

### Login User

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"adel@test.com","password":"123456"}'
```

### Access Protected Route

```bash
curl -X GET http://localhost:8000/api/leads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile (protected) |

### Leads Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads |
| POST | `/api/leads` | Create new lead |
| GET | `/api/leads/:id` | Get lead by ID |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

---

## 🎯 Roadmap

- [ ] AI Lead Scoring Engine
- [ ] Automated WhatsApp + Email Messaging
- [ ] CRM Dashboard
- [ ] AI Sales Chatbot
- [ ] Call Scheduling Automation
- [ ] Predictive Conversion Analytics
- [ ] Integration with Zapier/Make
- [ ] Mobile App (React Native)
- [ ] Advanced Analytics Dashboard
- [ ] Team Collaboration Features

---

## 🔒 Security

- ✅ Password hashing using **bcrypt**
- ✅ JWT-based authentication
- ✅ Protected routes middleware
- ✅ Secure environment variable handling
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Rate limiting (planned)

---

## 🏆 Project Goal

To build a **fully autonomous AI-powered sales operations platform** that replaces manual sales workflows, reduces cost, and increases conversion efficiency through intelligent automation.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Adel Muhammed**  
Full Stack + AI Engineer

📧 Email: your-email@example.com  
🔗 LinkedIn: https://www.linkedin.com/in/adel-muhammed-49136a282/ 
💼 GitHub: https://github.com/dragon486

---

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- The open-source community for amazing tools and libraries
- All contributors who help improve this project

---

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact via email
- Join our community discussions

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made by Adel Muhammed

</div>
