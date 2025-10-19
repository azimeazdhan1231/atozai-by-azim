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
- Production mode serves pre-built static files

**Environment Configuration**
- DATABASE_URL environment variable for PostgreSQL connection
- NODE_ENV for environment-specific behavior
- Vite-specific variables for development features