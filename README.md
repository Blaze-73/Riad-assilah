# Riad Guesthouse Website Project

## Overview
A production-quality MERN-stack website for a boutique riad in Asilah, Morocco.  
The site replaces Booking.com, builds trust with international tourists, and uses WhatsApp as the primary booking CTA.  

## Architecture
- **Frontend**: React 18 + Vite, Tailwind CSS, React Router, Framer Motion, react-i18next, axios, react-hook-form, yet-another-react-lightbox.  
- **Backend**: Node.js + Express, MongoDB + Mongoose, JWT auth (bcrypt), Cloudinary SDK, Nodemailer.  
- **Admin Panel**: Protected routes, JWT, CRUD for rooms, testimonials, gallery, and booking inquiries.  

### Key Features
- Hero with full-bleed image, bilingual tagline, sticky WhatsApp CTA.  
- 8 public pages (Hero, About, Rooms, Gallery, Experience, Testimonials, Booking/Contact, Footer).  
- Admin dashboard for managing rooms, images, testimonials, and inquiries.  
- Multilingual (FR/EN/AR) with RTL support via i18next.  
- Mobile-first, responsive design; page load < 2?s on 4G.  

## Project Structure
`
riad-website/
+- client/                # React frontend
¦   +- src/
¦   +- public/
¦   +- index.html
¦   +- vite.config.js
¦   +- ... 
+- server/                # Express backend
¦   +- src/
¦   ¦   +- models/
¦   ¦   +- routes/
¦   ¦   +- controllers/
¦   ¦   +- middleware/
¦   ¦   +- app.js
¦   +- .env.example
¦   +- package.json
+- locales/               # i18n JSON files (fr.json, en.json, ar.json)
+- README.md
+- package.json (root, scripts for both client & server)
`
## Implementation Roadmap
1. **Setup**  
   - Create root package.json with workspaces (client & server).  
   - Initialize git repo and add .gitignore for Node & frontend.  

2. **Backend**  
   - Install Express, Mongoose, JWT, bcrypt, CORS, dotenv, validator.  
   - Define Mongoose models: Room, Inquiry, Testimonial, GalleryImage, Admin.  
   - Implement API routes (inquiries, rooms, testimonials, gallery, auth).  
   - Add Cloudinary integration for image uploads.  
   - Set up Nodemailer for inquiry email notifications.  
   - Create admin middleware (JWT protected) and login/register routes.  

3. **Frontend**  
   - Scaffold Vite + React project.  
   - Integrate Tailwind CSS and configure 	ailwind.config.js.  
   - Set up react-router-dom v6 with routes for all public pages and admin panel.  
   - Create reusable components: Header, Footer, WhatsAppButton, RoomCard, Lightbox, AuthProvider.  
   - Implement i18next with language switcher and RTL handling.  
   - Build each page according to the design spec, using Framer Motion for scroll animations.  
   - Connect to backend via axios services; handle loading & error states.  

4. **Admin Panel**  
   - Protected routes under /admin.  
   - Dashboard listing inquiries and recent rooms.  
   - CRUD modals for rooms, testimonials, gallery images (Cloudinary upload).  
   - Simple status toggles for inquiries (pending / confirmed / cancelled).  

5. **Testing & Optimization**  
   - Write unit tests for key backend controllers (Jest).  
   - Perform Lighthouse audit, optimize images (lazy-load, responsive sizes).  
   - Ensure mobile-first breakpoints, fast loading (<2?s).  

6. **Deployment**  
   - Frontend: Deploy to Vercel (auto-detect Vite).  
   - Backend: Deploy to Railway or Render (Dockerfile optional).  
   - Set up MongoDB Atlas cluster and Cloudinary account; add env variables (MONGODB_URI, CLOUDINARY_URL, etc.).  

## Getting Started (Locally)
`ash
# Clone repo & install deps
git clone https://github.com/yourusername/riad-website.git
cd riad-website
npm install   # installs root workspaces

# Start both servers (dev mode)
npm run dev    # uses concurrently to run client & server
`
- Frontend runs on http://localhost:5173  
- Backend API on http://localhost:4000  

## Environment Variables
Root .env (not committed):
`
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/riad
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=super_secret_jwt_key
NODE_ENV=development
`
Frontend .env (client):
`
VITE_API_URL=http://localhost:4000/api
`
See the README inside client/ and server/ for full details.

## License
MIT © 2026
