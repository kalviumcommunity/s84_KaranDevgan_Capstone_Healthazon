# 🏥 Capstone Project: Healthazon

**Type:** Full-Stack MERN App  
**Theme:** Health-tech – Patient-Doctor Appointment & Consultation Platform

---

## 🚀 Deployment Architecture (Updated)

**New: Single-Server Deployment** ✨  
The application now runs as a consolidated single server that serves both the API and frontend UI from one Node.js/Express process. This simplifies deployment to platforms like Cloud Run, Heroku, or Docker containers.

- **Single Docker Image** — One Dockerfile builds frontend and runs backend
- **Same-Origin API** — Frontend automatically calls `/api` on same server
- **Unified Env Vars** — Single `.env` file for both backend and frontend

**See [SINGLE_SERVER_SETUP.md](SINGLE_SERVER_SETUP.md) for full setup instructions.**

**Deployment Link** : https://healthazon.onrender.com

## ✨ Project Brief

**Healthazon** is a digital health appointment and consultation system that allows patients to:
- Book appointments with doctors (online or offline)
- Upload reports/images
- Consult via video call or in person

**Doctors** can:
- Manage appointments
- Set availability
- Update profiles

The app implements real-world full-stack features:
- Database design
- Authentication (JWT )
- File uploads
- UI design
- Real-time work tracking using GitHub Projects

---

## 🧰 Tech Stack

**Frontend:** React 
**Backend:** Node.js, Express.js  
**Database:** MongoDB (with Mongoose)  
**Auth:** JWT  
**Hosting:** Render (Backend), Netlify (Frontend)  
**Design:** Figma  
**APIs Testing:** Postman and Bruno  
**Version Control:** Git + GitHub Projects (Board, Issues, Milestones)
