# Delhi Civic Portal — Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

Make sure MongoDB is running locally or use a cloud instance.

**Local MongoDB:**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Cloud MongoDB:**
Use MongoDB Atlas or any cloud provider and get your connection string.

### 3. Configure Environment

The `.env.local` file is already created with default values:

```env
MONGODB_URI=mongodb://localhost:27017/delhi-civic
NEXT_PUBLIC_API_URL=
JWT_SECRET=your-secret-key-change-this-in-production
```

For production, generate a secure JWT secret:
```bash
openssl rand -base64 32
```

### 4. Seed the Database

Populate the database with sample complaints:

```bash
npm run seed
```

This will create 15 realistic sample complaints with various:
- Categories (Water Supply, Roads, Garbage, etc.)
- Statuses (Submitted, Verified, In Progress, Resolved)
- Locations across Delhi
- Timestamps spanning the last 30 days

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Build for Production

```bash
npm run build
npm start
```

## Test Journeys

### Citizen Journey

1. **Homepage** (`/`)
   - View live civic status stats
   - Browse categories with complaint counts
   - See recent complaints feed
   - Click "REPORT A PROBLEM"

2. **Report Issue** (`/report`)
   - **Step 1**: Select category (e.g., WATER SUPPLY)
   - **Step 2**: Choose location (enter area like "Connaught Place")
   - **Step 3**: Add title and description
   - **Step 4**: Choose to submit anonymously or add contact info
   - **Step 5**: Review and submit
   - **Result**: Receive complaint ID (e.g., DL-20491)

3. **Track Complaint** (`/complaints/DL-20491`)
   - View detailed complaint information
   - See visual status timeline
   - Check location and department assignment
   - View resolution notes (if resolved)

4. **Browse Complaints** (`/complaints`)
   - Search by complaint ID
   - Filter by category, status, area
   - View all complaints in cards

5. **Map View** (`/map`)
   - See all complaints on interactive map
   - Filter by category and status
   - Click markers for complaint preview

6. **Area Dashboard** (`/area`)
   - Search for your locality
   - View area-specific stats
   - See recent complaints in your area

### Admin Journey

1. **Admin Dashboard** (`/admin`)
   - View system-wide stats
   - See pending, unassigned, and in-progress counts
   - Navigate to complaint management

2. **Complaint Management** (`/admin/complaints`)
   - View all complaints in sortable table
   - Filter by category, status, priority
   - Click "MANAGE" to open detail view

3. **Update Complaint** (`/admin/complaints/[id]`)
   - View complete complaint details
   - See citizen information (if not anonymous)
   - View audit history
   - Update status (SUBMITTED → VERIFIED → ASSIGNED → IN_PROGRESS → RESOLVED)
   - Change priority (LOW, MEDIUM, HIGH, URGENT)
   - Add update notes
   - Add resolution notes
   - Save changes

## Sample Data

After seeding, you'll have complaints like:

- `DL-...` — Water pipeline burst (Connaught Place)
- `DL-...` — Large pothole causing accidents (Saket)
- `DL-...` — Garbage not collected for 5 days (Dwarka)
- `DL-...` — Blocked drainage causing waterlogging (Rohini)
- `DL-...` — Street lights not working (Vasant Vihar)

Use any of these complaint IDs to test the tracking page.

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run seed       # Seed database with sample data
```

## Project Architecture

### Pages
- `/` — Homepage with stats and live feed
- `/report` — Multi-step complaint submission form
- `/complaints` — Browse and search complaints
- `/complaints/[id]` — Individual complaint detail page
- `/map` — Interactive map view with Leaflet
- `/area` — Area-specific complaint dashboard
- `/admin` — Admin overview (prototype)
- `/admin/complaints` — Admin complaint management
- `/admin/complaints/[id]` — Admin complaint detail with update controls

### API Routes
- `GET /api/complaints` — List complaints with filters
- `POST /api/complaints` — Create new complaint
- `GET /api/complaints/[id]` — Get single complaint
- `PATCH /api/complaints/[id]` — Update complaint (admin)
- `GET /api/stats` — Get global statistics

### Components

**Brutalist Design System:**
- `Button` — Multiple variants with press effect
- `Card` — Hard shadows and borders
- `Input` / `Textarea` — Bold bordered inputs
- `Select` — Styled dropdown
- `Badge` — Status badges with colored dots

**Layout:**
- `Header` — Sticky navigation with mobile menu
- `Footer` — Site links and prototype notice
- `Ticker` — Animated horizontal ticker

**Features:**
- `MapView` — Leaflet integration with complaint markers

## Tech Stack Details

- **Next.js 16.3.5** with App Router and Turbopack
- **React 19.2.8**
- **TypeScript 5**
- **Tailwind CSS 4** with custom design system
- **MongoDB 7.7.0** with native driver
- **Zod 4.6.5** for validation
- **Leaflet 1.9.4** for maps
- **Space Grotesk** + **Space Mono** fonts

## Design Principles

### Brutalist UI
- **No gradients**, no glassmorphism, no excessive rounding
- **Hard shadows** (6px offset)
- **Thick borders** (2px)
- **High contrast** (black on off-white)
- **Bold typography** (uppercase labels, strong hierarchy)
- **Editorial layout** (newspaper/magazine influence)

### Color Palette
- Background: `#F5F5F0` (paper)
- Text: `#111111` (black)
- Accent: `#E03A3E` (Delhi red)
- Muted: `#777777` (gray)

### Typography
- Headlines: Space Grotesk Bold
- Body: Space Grotesk Regular
- Metadata: Space Mono (monospace)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `MONGODB_URI` (use MongoDB Atlas)
   - `JWT_SECRET` (generate secure key)
4. Deploy

The build is optimized and production-ready.

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/delhi-civic
NEXT_PUBLIC_API_URL=https://your-domain.com
JWT_SECRET=<your-secure-32-byte-key>
```

## Important Notes

### Prototype Status
This is clearly marked as a **demonstration portal**. It is NOT officially connected to the Delhi Government. The footer and admin panel both display prominent prototype notices.

### Security Considerations
For production deployment:
- Add proper authentication (NextAuth.js recommended)
- Implement role-based access control (RBAC)
- Add rate limiting to API routes
- Implement CAPTCHA for complaint submission
- Add audit logging for admin actions
- Secure admin routes with middleware
- Validate all user inputs server-side
- Sanitize file uploads
- Use HTTPS only

### Missing Features (Intentional)
These are placeholders for production implementation:
- **Photo Upload**: Currently a UI placeholder; integrate Cloudinary or AWS S3
- **Map Location Picker**: Currently accepts text input; add geocoding API
- **Authentication**: Admin routes are open; add NextAuth.js or similar
- **Email/SMS Notifications**: Not implemented; add Resend, SendGrid, or Twilio
- **Real Department APIs**: Mock integration layer; replace with actual government APIs

## Troubleshooting

### MongoDB Connection Error
```
Error: Please add MONGODB_URI to .env.local
```
**Solution**: Ensure `.env.local` exists with valid `MONGODB_URI`

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**: Kill the process or use a different port:
```bash
npm run dev -- -p 3001
```

### Seed Script Fails
```
MongoServerError: Authentication failed
```
**Solution**: Check MongoDB credentials in `MONGODB_URI`

### Build Warnings
The build may show dynamic rendering warnings for pages using `fetch` with `cache: 'no-store'`. This is expected for real-time data pages.

## Support

This is a demonstration project. For questions or improvements, refer to the codebase documentation.

## License

MIT License — Free to use and modify.
