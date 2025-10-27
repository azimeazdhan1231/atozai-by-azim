# AtoZAI - AI Tools Directory

## Overview

AtoZAI is a comprehensive AI tools directory application featuring 2,800+ AI tools and resources. The platform enables users to discover, filter, and explore AI tools across various categories with advanced search and filtering capabilities. Built as a modern web application, it provides a premium browsing experience with a focus on data-heavy content presentation and efficient tool discovery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System**
- shadcn/ui component library with Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for type-safe component variant management
- Custom theme system supporting light/dark modes with localStorage persistence

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Local component state with React hooks for UI-specific state
- Query-based architecture with automatic refetching disabled for static catalog data

**Design System**
- Premium design approach balancing modern aesthetics with data-heavy content display
- Dark mode primary, light mode secondary
- Custom color palette with HSL-based theming for consistency
- Typography using Inter (UI/body), Poppins (headings), and JetBrains Mono (technical content)
- Responsive grid layouts optimized for various screen sizes

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- ES Modules throughout the codebase for modern JavaScript standards
- Custom middleware for request logging and error handling

**Data Storage Strategy**
- In-memory storage using JSON files (current implementation)
- Drizzle ORM configured for PostgreSQL (prepared for future database integration)
- Schema-first approach with Zod validation for type safety across client/server boundary

**API Design**
- RESTful endpoints for tools and categories
- Query parameter-based filtering and pagination
- Shared schema validation between client and server using Zod

### Data Architecture

**Tool Schema**
- Core fields: id, name, slug, url, short_description, description
- Categorization: pricing (Free/Paid/Freemium), primary_category, secondary_category, platform_type
- URL-friendly slugs for routing and linking

**Filtering & Search**
- Multi-criteria filtering (pricing, categories, platform type)
- Text search across name, descriptions, and categories
- Server-side pagination with configurable page size
- Total count and pagination metadata for UI rendering

**Categories System**
- Dynamic category extraction from tool data
- Primary and secondary category hierarchies
- Platform type classification for tool discovery

### External Dependencies

**Database (Configured but Not Yet Active)**
- Neon Database (serverless PostgreSQL) via `@neondatabase/serverless`
- Drizzle ORM for type-safe database queries
- Connection pooling via Neon's serverless driver
- Migrations stored in `/migrations` directory

**UI Component Libraries**
- Radix UI primitives for 20+ accessible component patterns
- Embla Carousel for image/content carousels
- CMDK for command palette functionality
- Lucide React for consistent iconography

**Development Tools**
- TypeScript for static type checking across the entire stack
- ESBuild for server bundling in production
- PostCSS with Autoprefixer for CSS processing
- Replit-specific plugins for development environment integration

**Form Management**
- React Hook Form for form state management
- Hookform Resolvers with Zod for schema-based validation
- Integration with shadcn/ui form components

**Utilities**
- clsx and tailwind-merge for conditional className management
- date-fns for date formatting and manipulation
- nanoid for unique ID generation

### Deployment Strategy

**Build Process**
- Client build: Vite bundles React application to `dist/public`
- Server build: ESBuild bundles Express server to `dist/index.js`
- Netlify Functions: Custom build script (`scripts/build-functions.sh`) bundles both tools.ts and categories.ts serverless functions
- Data files: Server data copied from `server/data/` to `dist/data/` during build
- Production mode serves pre-built static files

**Netlify Deployment**
- Serverless functions located in `netlify/functions/`
- Two separate functions: `tools.ts` (handles tool listing and details) and `categories.ts` (handles category data)
- Both functions implement multiple fallback paths for data loading to ensure compatibility across environments
- API routing configured in `netlify.toml` with redirects from `/api/*` to serverless functions
- Build command: `npm run build && bash scripts/build-functions.sh`

**Environment Configuration**
- DATABASE_URL environment variable for PostgreSQL connection
- NODE_ENV for environment-specific behavior
- Vite-specific variables for development features

### Recent Changes (October 2025)

**New Features (Latest)**
- Added "Top AI Agents" page featuring 15 curated free AI agent tools for 2025
  - Includes detailed information about each agent: features, free tier details, categories
  - Responsive grid layout with touch-friendly cards
  - SEO optimized with meta descriptions and Open Graph tags
- Added "Contact" page with multiple contact options
  - WhatsApp integration for quick messaging
  - Validated contact form with React Hook Form and Zod validation
  - Address information (Dhaka 1212, Bangladesh)
  - Success state with confirmation message
  - SEO optimized with meta descriptions and Open Graph tags
- Extended data model with AgentTool and ContactMessage schemas
- Created new API endpoints: `/api/agents` (GET) and `/api/contact` (POST)
- Added corresponding Netlify serverless functions with proper CORS and error handling
- Updated header navigation to include new pages with active state indicators
- All new pages follow responsive design patterns with touch-friendly interactions (min-h-10 buttons, proper spacing)

**UI Improvements**
- Removed clear/cross button from search bar for cleaner interface
- Added scroll-to-top behavior when navigating to tool detail pages
- Fixed category navigation using proper URL parameters (`primary_category`)
- Enhanced footer with developer credit (Azim Eazdhan) and clickable WhatsApp contact button

**Netlify Deployment Fixes**
- Created dedicated `categories.ts` serverless function to properly serve categories data
- Updated both Netlify functions with comprehensive fallback paths for data file loading
- Created custom build script to ensure both serverless functions are properly bundled
- Fixed nested anchor tag issues by consistently using `asChild` prop with wouter Link component
- Added build configuration for new `agents.ts` and `contact.ts` serverless functions
- Updated netlify.toml with redirects for new API endpoints