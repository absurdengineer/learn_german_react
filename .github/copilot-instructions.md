<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# DeutschMeister - German A1 Learning PWA - Copilot Instructions

## Project Overview
DeutschMeister is a React Progressive Web App (PWA) for German A1 language learning with a focus on certification preparation. The app uses the 80-20 rule to maximize learning efficiency and provides an engaging, interactive learning experience. Built with Clean Architecture principles and a unified design system.

## Tech Stack
- **React 19** with TypeScript (strict mode)
- **Vite 7** for fast development and optimized builds
- **Tailwind CSS 3.4** with mobile-first responsive design
- **React Router 7** for client-side navigation
- **Vite PWA plugin** for offline capabilities and app installation
- **Local Storage** for progress tracking and data persistence
- **CSV data loading** with async processing for vocabulary content

## Architecture Patterns
- **Clean Architecture** with Domain-Driven Design (DDD) principles
- **Domain Layer**: Business entities and interfaces (User, Vocabulary, Grammar, Test, Progress)
- **Application Layer**: Use cases for business logic (VocabularyUseCases, TestUseCases, UserUseCases)
- **Infrastructure Layer**: Repository implementations with local storage
- **Presentation Layer**: React components organized by pages and reusable UI components
- **Unified Design System**: Consistent UI components (PageHero, NavigationHeader, Cards, Buttons)
- **Custom hooks** for state management and business logic integration
- **Context providers** for global state (AppContext with reducer pattern)
- **Mobile-first responsive design** with standardized breakpoints and spacing

## Key Features to Implement
1. **Daily Study Plans**: 30-day structured learning path ✅ **IMPLEMENTED**
2. **Vocabulary Practice**: Flashcards with spaced repetition ✅ **IMPLEMENTED**
3. **Grammar Exercises**: Interactive lessons and quizzes ✅ **IMPLEMENTED**
4. **Articles Practice**: German articles (der/die/das) learning ✅ **IMPLEMENTED**
5. **Speaking Practice**: Recording and playback features ✅ **IMPLEMENTED**
6. **Writing Practice**: Templates and exercises ✅ **IMPLEMENTED**
7. **Progress Tracking**: Detailed analytics and milestones ✅ **IMPLEMENTED**
8. **Practice Tests**: A1 exam simulation ✅ **IMPLEMENTED**
9. **Offline Support**: PWA capabilities for offline learning ✅ **IMPLEMENTED**

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
- `/src/domain`: Business entities and repository interfaces
- `/src/application`: Use cases for business logic
- `/src/infrastructure`: Repository implementations and external services
- `/src/presentation/pages`: Main application page components
- `/src/presentation/components`: Reusable session and learning components
- `/src/presentation/components/ui`: Unified design system components
- `/src/hooks`: Custom React hooks for state management
- `/src/context`: React context providers and app state management
- `/src/data`: Static learning content, CSV data, and vocabulary
- `/src/types`: TypeScript type definitions
- `/src/utils`: Helper functions and utilities

### Key UI Components (Unified Design System)
- **PageHero**: Consistent page headers with titles and descriptions
- **NavigationHeader**: Standardized navigation for session pages
- **Cards**: Various card types (GradientCard, ProgressCard, QuickActionCard)
- **Buttons**: Consistent button styles and interactions
- **Loading States**: Spinners and skeleton loaders for async content

## Performance Considerations
- Lazy loading for routes and heavy components
- **Async CSV loading** for vocabulary data with loading indicators
- Optimized images and assets
- Service worker for caching
- Minimal bundle size with tree shaking
- Efficient re-rendering with React.memo and useMemo
- **Mobile-first responsive design** with optimized breakpoints
- **Standardized spacing and typography** for consistent performance

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

## Technology Specifications

### React 19 Implementation
- **Functional Components**: Use React.FC type annotation and hooks pattern
- **TypeScript Strict Mode**: Enable all strict type checking options
- **Hook Usage**: Prefer built-in hooks (useState, useEffect, useCallback, useMemo)
- **Custom Hooks**: Create reusable logic in `/src/hooks/` with clear naming (useApp, useVocabulary)
- **Context API**: Use reducer pattern for complex state management (AppContext)
- **Error Boundaries**: Implement for robust error handling in production

### Vite 7 Configuration
- **Build Optimization**: Tree shaking, code splitting, and bundle analysis
- **Development Server**: Hot module replacement and fast refresh
- **PWA Plugin**: Service worker generation and offline caching strategies
- **TypeScript**: Strict type checking integration with Vite build pipeline
- **Environment Variables**: Use import.meta.env for configuration
- **Asset Handling**: Optimize images, fonts, and static resources

### Tailwind CSS 3.4 Design System
- **Mobile-First**: Start with mobile styles, add responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- **Design Tokens**: Use consistent spacing (4, 6, 8, 12, 16, 24, 32), colors, and typography
- **Component Classes**: Create reusable utility combinations for common patterns
- **Responsive Grid**: Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` pattern
- **Typography Scale**: Consistent text sizes (`text-sm`, `text-base`, `text-lg`, `text-xl`)
- **Color Palette**: Semantic colors for learning states (success, warning, error, info)

## Clean Architecture Implementation

### Domain Layer (`/src/domain/`)
```typescript
// Entities: Core business objects
export interface User {
  id: string;
  name: string;
  level: string;
  preferences: UserPreferences;
}

export interface Vocabulary {
  id: string;
  german: string;
  english: string;
  category: VocabularyCategory;
  difficulty: number;
  gender?: Gender;
}

// Repository Interfaces: Define data access contracts
export interface VocabularyRepository {
  findByCategory(category: string): Promise<Vocabulary[]>;
  findByDifficulty(level: number): Promise<Vocabulary[]>;
  save(vocabulary: Vocabulary): Promise<void>;
}
```

### Application Layer (`/src/application/`)
```typescript
// Use Cases: Business logic orchestration
export class VocabularyUseCases {
  constructor(private vocabularyRepo: VocabularyRepository) {}
  
  async getPracticeWords(category: string, count: number): Promise<Vocabulary[]> {
    const words = await this.vocabularyRepo.findByCategory(category);
    return this.selectRandomWords(words, count);
  }
}
```

### Infrastructure Layer (`/src/infrastructure/`)
```typescript
// Repository Implementations: Data access implementations
export class VocabularyRepositoryImpl implements VocabularyRepository {
  async findByCategory(category: string): Promise<Vocabulary[]> {
    // CSV loading, localStorage, or API calls
    return this.loadFromCSV(category);
  }
}
```

### Presentation Layer (`/src/presentation/`)
```typescript
// Pages: Route components with business logic integration
// Components: Reusable UI with props interface
// UI: Design system components with consistent styling
```

## Data Management Best Practices

### CSV Data Loading
```typescript
// Async loading with proper error handling
export const loadVocabularyData = async (): Promise<Vocabulary[]> => {
  try {
    const response = await fetch('/data/vocabulary.csv');
    const csvText = await response.text();
    return parseCSVToVocabulary(csvText);
  } catch (error) {
    console.error('Failed to load vocabulary:', error);
    throw new VocabularyLoadError('Unable to load vocabulary data');
  }
};
```

### Local Storage Pattern
```typescript
// Type-safe storage with error handling
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage failed:', error);
    }
  }
};
```

### Progress Tracking System
```typescript
export interface Progress {
  userId: string;
  sessionId: string;
  activity: ActivityType;
  score: number;
  timeSpent: number;
  completedAt: Date;
  mistakes: Mistake[];
}
```

## UI/UX Design Patterns

### Unified Component System
```typescript
// PageHero: Consistent page headers
interface PageHeroProps {
  title: string;
  description: string;
  icon?: string;
  gradient?: string;
}

// NavigationHeader: Session navigation
interface NavigationHeaderProps {
  title: string;
  progress?: number;
  onExit: () => void;
  showProgress?: boolean;
}
```

### Responsive Design Standards
- **Container Padding**: `px-4 sm:px-6` for consistent horizontal spacing
- **Vertical Spacing**: `pt-8 pb-8` for main content areas
- **Grid Layouts**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` for card grids
- **Typography**: `text-2xl sm:text-3xl lg:text-4xl` for responsive headings
- **Interactive Elements**: Minimum 44px touch targets for mobile

### Loading States and Error Handling
```typescript
// Loading patterns
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<T[]>([]);

// Error boundaries for components
class ErrorBoundary extends React.Component {
  // Implement error catching and fallback UI
}
```

## Performance Optimization

### React Performance
- **Memoization**: Use React.memo for expensive components
- **Callback Optimization**: useCallback for event handlers passed to children
- **Effect Dependencies**: Careful dependency arrays in useEffect
- **State Batching**: Group related state updates
- **Lazy Loading**: React.lazy for route-based code splitting

### Bundle Optimization
- **Tree Shaking**: Import only used functions from libraries
- **Code Splitting**: Route-based and component-based splitting
- **Asset Optimization**: Compress images, use WebP format
- **Caching Strategy**: Leverage service worker for offline functionality

### Memory Management
- **Cleanup**: Remove event listeners and intervals in useEffect cleanup
- **Reference Management**: Avoid memory leaks in long-running sessions
- **Large Data Sets**: Implement pagination or virtualization for lists

## Testing Strategy

### Unit Testing
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { VocabularyCard } from './VocabularyCard';

test('displays vocabulary word correctly', () => {
  const mockWord = { german: 'Hund', english: 'dog', id: '1' };
  render(<VocabularyCard word={mockWord} />);
  expect(screen.getByText('Hund')).toBeInTheDocument();
});
```

### Integration Testing
- **User Flows**: Test complete learning sessions
- **Data Flow**: Verify state management across components
- **Error Scenarios**: Test error handling and recovery

### E2E Testing
- **Critical Paths**: Study plan completion, vocabulary practice
- **PWA Features**: Installation, offline functionality
- **Performance**: Loading times, responsiveness

## Accessibility Standards

### WCAG 2.1 Compliance
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 ratio for text
- **Focus Management**: Visible focus indicators and logical tab order

### German Learning Accessibility
- **Audio Controls**: Clear play/pause/repeat buttons
- **Text Sizing**: Configurable font sizes for different learners
- **Language Support**: Screen reader compatibility with German words
- **Progress Indicators**: Clear completion status and next steps

## Development Workflow

### Code Quality
- **ESLint Rules**: Strict TypeScript and React best practices
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for linting and testing
- **Conventional Commits**: Standardized commit message format

### Git Workflow
- **Feature Branches**: One feature per branch with descriptive names
- **Pull Requests**: Code review and automated testing
- **Semantic Versioning**: Clear version management for releases

### Deployment Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Environment Variables**: Separate configs for dev/staging/production
- **Performance Monitoring**: Bundle size analysis and runtime monitoring

Please follow these technical specifications when implementing features, ensuring consistency with the established architecture and maintaining high code quality standards!
