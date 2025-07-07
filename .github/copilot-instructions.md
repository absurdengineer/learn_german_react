<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# DeutschMeister - German A1 Learning PWA - Copilot Instructions

## Project Overview
DeutschMeister is a React Progressive Web App (PWA) for German A1 language learning with a focus on certification preparation. The app uses the 80-20 rule to maximize learning efficiency and provides an engaging, interactive learning experience.

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for responsive design
- React Router for navigation
- Vite PWA plugin for offline capabilities
- Local Storage for progress tracking

## Architecture Patterns
- Component-based architecture with reusable UI components
- Custom hooks for state management and local storage
- Context providers for global state (progress, settings, user data)
- Service layer for data management and persistence
- Mobile-first responsive design

## Key Features to Implement
1. **Daily Study Plans**: 30-day structured learning path
2. **Vocabulary Practice**: Flashcards with spaced repetition
3. **Grammar Exercises**: Interactive lessons and quizzes
4. **Speaking Practice**: Recording and playback features
5. **Writing Practice**: Templates and exercises
6. **Progress Tracking**: Detailed analytics and milestones
7. **Practice Tests**: A1 exam simulation
8. **Offline Support**: PWA capabilities for offline learning

## Code Style Guidelines
- Use TypeScript with strict type checking
- Functional components with hooks
- Tailwind CSS for styling and responsive design
- ESLint and Prettier for code formatting
- Descriptive component and file naming
- Comprehensive error handling
- Accessibility best practices (ARIA labels, keyboard navigation)

## Data Structure
- User progress stored in localStorage
- Vocabulary and grammar data in TypeScript constants
- Progress tracking with detailed metrics
- Offline-first architecture with sync capabilities

## Component Structure
- `/components`: Reusable UI components
- `/pages`: Main application pages
- `/hooks`: Custom React hooks
- `/context`: React context providers
- `/services`: Business logic and data management
- `/data`: Static learning content and vocabulary
- `/types`: TypeScript type definitions
- `/utils`: Helper functions and utilities

## Performance Considerations
- Lazy loading for routes and heavy components
- Optimized images and assets
- Service worker for caching
- Minimal bundle size with tree shaking
- Efficient re-rendering with React.memo and useMemo

## German Language Content
- Focus on A1 level content (500 essential words)
- Grammar essentials (6 key topics)
- Practical conversation scenarios
- Exam-focused practice materials
- Audio pronunciation guides (when possible)

## Testing Strategy
- Unit tests for components and utils
- Integration tests for user flows
- E2E tests for critical paths
- Performance testing for PWA features

Please help generate code that follows these patterns and creates an engaging, effective German learning experience with DeutschMeister!
