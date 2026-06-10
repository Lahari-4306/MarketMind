# MarketMind - AI Sales & Marketing Intelligence Platform

A comprehensive AI-powered SaaS application for sales and marketing intelligence, featuring campaign generation, sales pitch creation, lead scoring, market analysis, and business insights.

## Features

- **Campaign Generator** - AI-powered marketing campaign creation
- **Sales Pitch Generator** - Compelling sales pitch generation
- **Lead Scoring** - Intelligent lead qualification and scoring
- **Market Analysis** - Industry and market insights
- **Business Insights** - Strategic business recommendations
- **Dashboard Analytics** - KPI tracking and visualization

## Tech Stack

### Frontend
- React (Vite)
- JavaScript
- React Router
- Axios
- Recharts
- Lucide React

### Backend
- FastAPI
- Python
- SQLAlchemy
- Alembic
- SQLite

### AI
- Groq API (Llama 3.3 70B Versatile)

## Architecture

```
React Frontend --> FastAPI Backend --> Groq API
```

## Security

- JWT Authentication
- Password hashing with bcrypt
- Protected routes
- User data isolation
- Domain guard (restricts AI to sales/marketing topics only)

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run Alembic migrations
alembic upgrade head

# (Optional) Seed demo data
python seed.py

# Start server
uvicorn main:app --reload
```

Backend runs at http://localhost:8000

API Documentation: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at http://localhost:5173

### Demo Credentials

After running `python seed.py`:
- Admin: `admin@marketmind.com` / `password123`
- User: `demo@marketmind.com` / `password123`

## Docker Deployment

```bash
# Build and run all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

```
.
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── routers/
│   │   ├── auth.py
│   │   ├── campaigns.py
│   │   ├── sales_pitches.py
│   │   ├── lead_scores.py
│   │   ├── market_analyses.py
│   │   ├── business_insights.py
│   │   └── dashboard.py
│   ├── services/
│   │   ├── auth_service.py
│   │   └── groq_service.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Campaigns
- `GET /campaigns/` - List campaigns
- `POST /campaigns/` - Create campaign
- `GET /campaigns/{id}` - Get campaign
- `PUT /campaigns/{id}` - Update campaign
- `DELETE /campaigns/{id}` - Delete campaign

### Sales Pitches
- `GET /sales-pitches/` - List pitches
- `POST /sales-pitches/` - Create pitch
- `GET /sales-pitches/{id}` - Get pitch
- `DELETE /sales-pitches/{id}` - Delete pitch

### Lead Scoring
- `GET /lead-scores/` - List leads
- `POST /lead-scores/` - Score lead
- `GET /lead-scores/{id}` - Get lead
- `DELETE /lead-scores/{id}` - Delete lead

### Market Analysis
- `GET /market-analyses/` - List analyses
- `POST /market-analyses/` - Create analysis
- `GET /market-analyses/{id}` - Get analysis
- `DELETE /market-analyses/{id}` - Delete analysis

### Business Insights
- `GET /business-insights/` - List insights
- `POST /business-insights/` - Create insight
- `GET /business-insights/{id}` - Get insight
- `DELETE /business-insights/{id}` - Delete insight

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## Domain Guard

MarketMind is restricted to sales and marketing topics only. Queries about programming, politics, religion, sports, medical, legal, or general knowledge will return a restricted response:

> "I am MarketMind, a specialized Sales and Marketing Intelligence Assistant. I can only answer questions related to sales, marketing, lead generation, campaign strategy, market analysis, and business growth."


