# 🌌 Codeforces – Local Business Discovery Platform

Welcome to **Codeforces**, a collaborative project built for **CSC443 – Project 1**.  
This web application allows users to **discover, review, and explore** local businesses in a beautifully designed, Aurora-themed environment.

---

## 🚀 Overview

**Codeforces** enables users to:

- Browse and search for local businesses by name, category, or rating.
- Read and submit reviews for businesses.
- Add new businesses through a responsive form.
- Filter and sort businesses dynamically.
- Enjoy an elegant **Aurora gradient design**, smooth animations, and a **dark/light theme toggle**.
- Experience full interactivity using React Hooks and Context API.

---

## 🧠 Tech Stack

| Layer                  | Technology       |
| :--------------------- | :--------------- |
| **Frontend Framework** | React (Vite)     |
| **Styling**            | Tailwind CSS     |
| **Animations**         | Framer Motion    |
| **Icons**              | Lucide React     |
| **Routing**            | React Router     |
| **State Management**   | Context API      |
| **Deployment**         | Vercel / Netlify |
| **Build Tool**         | Vite             |

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally:

1️⃣ Clone the repository  
git clone https://github.com/yourusername/codeforces-localreviews.git  
cd codeforces-localreviews

2️⃣ Install dependencies  
npm install

# or

pnpm install

3️⃣ Run the development server  
npm run dev

4️⃣ Open the app  
Visit http://localhost:5173 in your browser.

---

## 🌍 Deployment

You can deploy this project easily using:

- Vercel (recommended): https://vercel.com/new
- Netlify: https://app.netlify.com/start
- GitHub Pages (via gh-pages)

Make sure your build command is:
npm run build  
and your output directory is:
dist

---

## 🧩 Data Entities & Mock Data

This project uses mock data (no backend) to simulate full CRUD functionality.  
All entities and interactions are handled using React Context and useState.

| Entity     | Description                                                                                                         |
| :--------- | :------------------------------------------------------------------------------------------------------------------ |
| Users      | Represent people who log in, register, and post reviews.                                                            |
| Businesses | Contain details such as name, description, address, phone, and category. Each business is owned by a specific user. |
| Categories | Define the business type (e.g., Food, Fitness, Services).                                                           |
| Reviews    | Store ratings and comments for each business.                                                                       |

Example of Mock Data (in DataContext.jsx):

const reviewsSeed = [
{ id: "r1", user_id: "u1", business_id: "b1", rating: 5, comment: "Amazing coffee and friendly staff!" },
{ id: "r2", user_id: "u2", business_id: "b1", rating: 4, comment: "Nice croissants and chill vibe." },
{ id: "r3", user_id: "u2", business_id: "b2", rating: 3, comment: "Good gym but too crowded." },
];

These reviews load automatically on startup and can be filtered or added dynamically through the interface.

---

## ✨ Key Features

✅ Dynamic Aurora Background  
A continuously animated gradient background built with Tailwind and Framer Motion.

✅ Dark/Light Mode  
Persistent theme toggle that adapts the Aurora effect for each mode.

✅ Owner-Only Business Editing  
Businesses can only be edited by the user who created them, ensuring proper ownership logic.

✅ Public Reviews  
Reviews are visible to everyone, regardless of login status.

✅ Fully Responsive  
Every page and component is mobile-friendly and adjusts seamlessly to different viewports.

✅ Futuristic Animations  
Page transitions, card hovers, and smooth content reveals using Framer Motion.

---

## 🧑‍💻 Team Codeforces

| Member  | Contribution                                                                                                             |
| :------ | :----------------------------------------------------------------------------------------------------------------------- |
| Chebli  | Designed the homepage (Aurora animation, hero transitions), implemented dark/light mode logic, and aesthetic components. |
| Nabil   | Developed authentication pages (Login & Register), and implemented the ownership logic for businesses.                   |
| John    | Built the BusinessList and BusinessDetail components, integrated reviews, and optimized responsive design.               |
| Charbel | Connected all routes, handled Context API state, footer logic, and final debugging & deployment setup.                   |

---

## 🧠 Functionality Summary

- Home Page: Dynamic hero with Aurora effects and category animations.
- All Businesses: Displays all business cards with filters and sorting.
- Business Details: Shows detailed info and customer reviews.
- Add/Edit Business: Allows authenticated users to manage their listings.
- Review System: Authenticated users can write reviews visible to everyone.
- Login & Register: Fully functional mock authentication.
- Dark/Light Mode: Smooth persistent theme switching.
- Responsive Design: Mobile, tablet, and desktop layouts supported.

---

## 💾 Data Persistence

Currently, data (users, businesses, reviews) is stored in memory using useState.  
Optional enhancement: enable persistence using localStorage for data retention after refresh.

---

## 🧮 Evaluation Checklist

| Requirement                         | Status |
| ----------------------------------- | ------ |
| React Functional Components & Hooks | ✅     |
| Routing with React Router           | ✅     |
| Context API State Management        | ✅     |
| Tailwind CSS Styling                | ✅     |
| Dynamic Filtering & Search          | ✅     |
| CRUD Simulation                     | ✅     |
| Theme Toggle                        | ✅     |
| Accessibility & Responsiveness      | ✅     |
| Code Quality & Comments             | ✅     |

---

## 📸 Screenshots

Please check the screenshots below:
/screenshots/
├── homepage-light.png
├── homepage-dark.png
├── business-list.png
└── review-section.png

---

## 🏁 Deployment Link

Live Demo: https://local-reviews.vercel.app/
GitHub Repository: https://github.com/chebli2002/local-reviews.git

---

## 🧾 Notes for the Instructor

- All logic and design were implemented from scratch by the Codeforces team.
- No external APIs or databases were used — only mock data.
- The app fulfills CSC443 Project 1 technical and aesthetic criteria, demonstrating modular, animated, and responsive React development.

---

✨ Created with pride by Team Codeforces (Chebli, Nabil, John, Charbel)  
Aurora meets functionality — where beauty and logic collide.
