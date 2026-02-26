# 🩺 MedMate

> A business-driven healthcare networking platform connecting Doctors and Medical Representatives through a structured prescription and commission-based system.

---

## 🌍 Overview

MedMate digitizes healthcare business collaboration by enabling transparent, commission-enabled workflows between doctors and medical representatives. Patients participate strictly for prescription-based purchasing — keeping the platform focused and business-ready.

---

## 🔄 How It Works

1. **Doctor–Rep Networking** — Medical Representatives connect with Doctors and showcase their products.
2. **Prescription Flow** — Doctors create or select patients, generate prescriptions, and attach commission logic.
3. **Patient Purchase** — Patients receive an app link, register, view their prescription, and complete payment.
4. **Commission Distribution** — Stripe processes payment and automatically splits commissions between the Doctor and Admin.

---

## 👥 User Roles

| Role | Responsibilities |
|------|-----------------|
| 🧑‍⚕️ **Doctor** | Connect with reps, discover products, create prescriptions & patients, earn commissions, view analytics |
| 💼 **Medical Rep** | Promote products, connect with doctors, track performance, real-time communication |
| 🧑‍🤝‍🧑 **Patient** | Register via doctor link, purchase prescribed products, track order status |
| 🛠 **Admin** | Manage operations, monitor commissions, access full analytics, oversee all transactions |

> **Note:** Patients cannot create connections, network with doctors, access analytics, or interact beyond prescription purchases.

---

## 🚀 Core Features

- 🔗 **Professional Networking** — Structured Doctor ↔ Medical Rep connection system
- 💊 **Prescription-Based Commerce** — Doctor-controlled patient and prescription workflow
- 💬 **Real-Time Features** — Chat, notifications, and likes via Socket.io
- 📊 **Role-Based Dashboards** — Revenue tracking, order insights, and performance metrics
- 🔐 **Auth & Security** — JWT, Google OAuth, role-based authorization, Zod validation, Winston logging
- 💳 **Payments** — Stripe integration with automated commission distribution

---

## 🏗 Tech Stack

**Frontend**
`React 19` • `Vite` • `Tailwind CSS 4` • `Redux Toolkit` • `React Router 7` • `Recharts` • `Framer Motion` • `Radix UI`

**Backend**
`Node.js` • `Express` • `TypeScript` • `MongoDB` • `Prisma ORM` • `Socket.io` • `Zod` • `Winston`

**Cloud & Integrations**
`AWS S3` • `Cloudinary` • `Google OAuth` • `Stripe`

**Architecture:** Clean Architecture · Feature-based frontend · Modular & scalable

---

## 🧪 Local Development

> Configure `.env` files in both `Backend/` and `Frontend/` before running.

**Backend**
```bash
cd Backend
npm install
npx prisma generate
npm run dev
```

**Frontend**
```bash
cd Frontend
npm install
npm run dev
```

---

## 📌 Key Design Principles

- **Patient side is intentionally minimal** — clean business workflow, no noise
- **Doctor-driven prescription model** — full control over patient and product flow
- **Transparent commissions** — every transaction is tracked and distributed automatically
- **Secure by design** — JWT + OAuth + role-based access at every layer