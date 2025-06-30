# Improved Tic-Tac-Toe Application

## Overview

This is a full-stack web application featuring an improved Tic-Tac-Toe game with a modern tech stack. The application combines a React frontend with TypeScript, a Node.js Express backend, and PostgreSQL database integration through Drizzle ORM. The game includes both placement and movement phases, creating a more strategic gameplay experience than traditional Tic-Tac-Toe.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **State Management**: Zustand for game state and audio controls
- **3D Graphics**: React Three Fiber with Drei for 3D rendering capabilities
- **Query Management**: TanStack React Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Development**: Hot reload with tsx for development server
- **Build**: esbuild for production bundling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon Database serverless driver

## Key Components

### Game Logic (`client/src/lib/gameLogic.ts`)
- Implements enhanced Tic-Tac-Toe with placement and movement phases
- Each player has 3 numbered tokens (1, 2, 3)
- Placement phase: Players place tokens on the board
- Movement phase: Players move existing tokens to adjacent empty cells
- Win condition checking for rows, columns, and diagonals

### Game Components
- **GameBoard**: Interactive 3x3 grid with click handling
- **Token**: Visual representation of player tokens with numbers
- **GameStatus**: Real-time game state display
- **TicTacToe**: Main game orchestrator component

### UI System
- Comprehensive component library built on Radix UI
- Consistent design system with CSS custom properties
- Responsive design patterns
- Accessibility-first approach

### State Management
- **Game State**: Zustand store for game phase management
- **Audio State**: Separate store for sound controls
- **Local State**: React hooks for component-level state

## Data Flow

### Game Flow
1. **Initialization**: Game starts in "ready" phase
2. **Placement Phase**: Players alternate placing tokens 1-6 (3 each)
3. **Movement Phase**: Players move tokens to adjacent empty cells
4. **Win Detection**: Continuous checking for three-in-a-row
5. **Game End**: Winner declared or restart option

### State Updates
1. User interaction triggers game logic
2. Game state updates through Zustand stores
3. React components re-render based on state changes
4. Audio feedback plays based on game events

### API Communication
- Client-server communication ready for multiplayer features
- Storage interface abstraction for easy database integration
- Type-safe API contracts through shared schemas

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Three Fiber
- **UI Framework**: Radix UI components collection
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **State Management**: Zustand, TanStack React Query
- **Build Tools**: Vite, TypeScript, PostCSS
- **Fonts**: Inter font family via Fontsource

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, Neon Database driver
- **Development**: tsx for TypeScript execution
- **Build**: esbuild for production bundling

### Development Tools
- **Type Checking**: TypeScript compiler
- **Database**: Drizzle Kit for migrations
- **Error Handling**: Replit error modal plugin
- **Code Quality**: ESLint configuration ready

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with automatic restart
- **Database**: Environment variable configuration
- **Assets**: Support for 3D models and audio files

### Production Build
- **Frontend**: Vite production build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Static Serving**: Express serves built frontend
- **Environment**: NODE_ENV=production detection

### Database Setup
- **Schema**: Defined in `shared/schema.ts`
- **Migrations**: Generated in `./migrations` directory
- **Connection**: DATABASE_URL environment variable required
- **Push**: `npm run db:push` for schema updates

### Scripts
- `npm run dev`: Start development servers
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run check`: TypeScript type checking
- `npm run db:push`: Update database schema

## Changelog
- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.