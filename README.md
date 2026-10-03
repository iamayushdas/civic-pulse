# Delhi Civic — Civic Complaint Portal

A production-quality civic complaint portal with a brutalist, Gen-Z, editorial-style interface for Delhi residents to report civic problems and track their resolution.

## Features

- **Report Complaints**: Multi-step form to report civic issues with location, photos, and details
- **Track Progress**: Real-time tracking with visual timeline and status updates
- **Browse Issues**: Filter and search complaints by category, status, area, and more
- **Map View**: Interactive map showing all civic issues across Delhi
- **Area Dashboard**: Locality-specific civic issue statistics and recent complaints
- **Admin Panel**: Complete complaint management system for administrators
- **Brutalist Design**: Bold, editorial-style UI with high contrast and strong typography

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom brutalist design system)
- **Database**: MongoDB (native driver, no ORM)
- **Validation**: Zod
- **Maps**: Leaflet + OpenStreetMap
- **Icons**: Lucide React
- **Fonts**: Space Grotesk + Space Mono

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB 6+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd civic-pulse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/delhi-civic
JWT_SECRET=your-secret-key-here
```

4. Seed the database with sample data:
```bash
npx tsx scripts/seed.ts
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── report/page.tsx             # Multi-step complaint form
│   ├── complaints/
│   │   ├── page.tsx                # Browse/filter complaints
│   │   └── [id]/page.tsx           # Complaint detail with timeline
│   ├── map/page.tsx                # Interactive map view
│   ├── area/page.tsx               # Area dashboard
│   ├── admin/
│   │   ├── page.tsx                # Admin overview
│   │   └── complaints/
│   │       ├── page.tsx            # Complaint management
│   │       └── [id]/page.tsx       # Complaint admin detail
│   └── api/
│       ├── complaints/route.ts     # GET/POST complaints
│       ├── complaints/[id]/route.ts # GET/PATCH complaint by ID
│       └── stats/route.ts          # Stats API
├── components/
│   ├── brutal/                     # Brutalist UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Ticker.tsx
│   └── map/
│       └── MapView.tsx
├── lib/
│   ├── mongodb.ts                  # MongoDB connection
│   ├── utils.ts                    # Utility functions
│   └── validations/                # Zod schemas
├── types/
│   └── index.ts                    # TypeScript types
└── app/globals.css                 # Brutalist design system
```

## Design System

### Colors
- **Background**: `#F5F5F0` (off-white/paper)
- **Black**: `#111111`
- **White**: `#FFFFFF`
- **Accent**: `#E03A3E` (Delhi red)
- **Muted**: `#777777`

### Typography
- **Headings**: Space Grotesk (bold, uppercase)
- **Body**: Space Grotesk
- **Metadata**: Space Mono (monospace)

### Components
- **Buttons**: Hard shadows, press effect, uppercase text
- **Cards**: 2px borders, 6px offset shadows
- **Inputs**: Bold borders, shadow on focus
- **Badges**: Status-colored dots with borders

## User Journeys

### Citizen Journey
1. Visit homepage → View live stats and recent complaints
2. Click "REPORT A PROBLEM" → Multi-step form
3. Select category → Choose location → Add details → Contact info → Review
4. Submit → Receive complaint ID (e.g., DL-20491)
5. Track complaint → View status timeline and updates
6. Browse area → See locality-specific issues

### Admin Journey
1. Visit `/admin` → Overview dashboard
2. Click "COMPLAINTS" → View all complaints in table
3. Click complaint → Detailed view with all info
4. Update status, priority, assignment
5. Add notes and resolution details
6. Save changes → Complaint updated

## API Routes

### Public APIs

#### GET `/api/complaints`
Query parameters:
- `category`: Filter by category
- `status`: Filter by status
- `area`: Filter by area (partial match)
- `ward`, `pincode`, `department`, `priority`
- `fromDate`, `toDate`: Date range
- `page`, `limit`: Pagination
- `sortBy`, `sortOrder`: Sorting

#### GET `/api/complaints/[id]`
Get single complaint by complaint ID

#### POST `/api/complaints`
Create new complaint (validated with Zod)

#### GET `/api/stats`
Get global statistics

### Admin APIs

#### PATCH `/api/complaints/[id]`
Update complaint status, priority, assignment, resolution

## Deployment

The application is ready for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Important Notes

- **Prototype**: This is clearly marked as a demonstration portal, not officially connected to Delhi Government
- **Security**: Admin routes should be protected with authentication in production
- **Images**: Photo upload is currently a placeholder; integrate with cloud storage (Cloudinary, AWS S3)
- **Maps**: Real location picking should use geocoding APIs
- **Notifications**: Add email/SMS notifications for status updates
- **Rate Limiting**: Add rate limiting to prevent spam submissions

## License

This is a demonstration project. Modify as needed.

## Credits

Built as a prototype civic engagement platform showcasing modern web development with brutalist design principles.
