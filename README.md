# Personal Finance Visualizer

A simple, modern web application for tracking personal finances, visualizing expenses, and managing budgets.

## Features
- Add, edit, and delete transactions (amount, date, description, category)
- Transaction list with search and filter
- Monthly expenses bar chart
- Category-wise pie chart
- Dashboard with summary cards (total expenses, category breakdown, most recent transactions)
- Set monthly category budgets
- Budget vs. actual comparison chart
- Simple spending insights
- Responsive design with error states

## Tech Stack
- **Frontend:** Next.js, React, shadcn/ui, Recharts
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)

### Installation
```bash
# Clone the repository
 git clone <your-repo-url>
 cd personal-finance-visualizer

# Install dependencies
 npm install
# or
yarn install
```

### Running Locally
```bash
# Start the backend server
cd server
npm install
npm run dev
# In a new terminal, start the frontend
cd ..
npm run dev
```
- Visit [http://localhost:8080](http://localhost:8080) in your browser.

### Environment Variables
Create a `.env` file in the `server` folder with your MongoDB connection string:
```
MONGO_URI=mongodb://localhost:27017/finflow
```

## Deployment
- Deploy the frontend to Vercel, Netlify, or similar.
- Deploy the backend to Render, Railway, or any Node.js hosting.

## License
MIT

---
**Personal Finance Visualizer** – Track, visualize, and improve your spending with ease.