# GetGoing

GetGoing is a mobile-exclusive productivity companion designed to help users build lasting habits, achieve meaningful goals, and stay consistently motivated through AI-powered coaching, personalized insights, and engaging gamification.

## Overview

GetGoing transforms aspirations into habits, habits into progress, and progress into lasting change. The app combines goal-setting, habit-tracking, task management, and focus tools into one engaging ecosystem with a virtual pet companion that evolves with user progress.

**Key Features:**
- Goal management with milestone breakdowns (Game Plans) & habits (Habit Boosters)
- Habit tracking with streak counters and AI-adjusted frequencies
- Task management with smart scheduling and AI-powered subtask generation
- Focus Timer (Pomodoro-style) with session analytics
- Virtual pet companion that evolves based on user activity
- AI coaching with personalized insights and suggestions
- Seamless offline access ensures productivity anytime, anywhere—even without an internet connection

## AI Integration

The app uses AI for:
- **Goal Planning**: Suggest tag, duration, generate milestones and supporting habits
- **Task Breakdown**: Smart subtask suggestions
- **Scheduling**: Optimal timing based on user patterns
- **Coaching**: Personalized feedback and motivational nudges
- **Adaptation**: Frequency adjustments based on performance

### AI Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │────│   AI Processor  │────│   Response      │
│ (Goals, Habits) │    │   (OpenAI API)  │    │ (Suggestions)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                        ┌─────────────────┐
                        │  Context Store  │
                        │ (User History)  │
                        └─────────────────┘
```

## Monetization Strategy

### Revenue Streams
1. **Freemium Model**
   - Free: Basic habit tracking, limited AI interactions
   - Premium: Advanced AI coaching, unlimited features

2. **Subscription Tiers**
   - **Basic**: $4.99/month - Advanced AI coaching
   - **Pro**: $9.99/month - Team features, advanced analytics
   - **Enterprise**: Custom pricing - Team management, reporting

3. **In-App Purchases**
   - Pet accessories and customizations
   - Premium themes and UI elements
   - Additional focus timer sounds

### Revenue Integration
- **RevenueCat**: Cross-platform subscription management
- **Native Store Billing**: iOS App Store, Google Play Store

## Tech Stack

### Frontend & Mobile
- **Framework**: React Native with Expo Development Builds (TypeScript)
- **Required Native Modules**: 
  - expo-sqlite (database)
  - expo-notifications (push notifications)
  - expo-task-manager (background tasks)
  - expo-file-system (file operations)
  - expo-media-library (media handling)
- **State Management**: React Query
- **Navigation**: Expo Router
- **UI Components**: Tamagui
- **Local Storage**: SQLite with expo-sqlite
- **Offline Support**: React Query with background sync

### Backend & API
- **Runtime**: Node.js (Use Supabase fully for backend - DB, Auth, Storage, Edge Functions)
- **Database**: PostgreSQL (primary), Redis (caching) via Supabase
- **Authentication**: Supabase Auth
- **API Architecture**: RESTful API with WebSocket for real-time features (Consider tRPC → it reduces boilerplate, works beautifully with TypeScript, and cuts dev time)

### AI & Analytics
- **AI Provider**: OpenAI API (GPT-4) or Anthropic Claude
- **Analytics**: Mixpanel or PostHog
- **Error Tracking**: Sentry
- **Performance Monitoring**: Expo Application Services (EAS)
- **AI Integration**: Smart suggestions, sentiment analysis, behavioral pattern recognition

### Cloud Infrastructure
- **Hosting**: Vercel (backend) or Railway
- **Database Hosting**: Supabase 
- **File Storage**: Supabase Storage
- **CDN**: Integrated with hosting provider

### Monetization & Payments
- **Subscription Management**: RevenueCat React Native SDK
- **Payment Processing**: Native store billing via RevenueCat
- **In-App Purchases**: RevenueCat (modern replacement for deprecated expo-in-app-purchases)

### DevOps & Deployment
- **CI/CD**: GitHub Actions with Expo EAS
- **App Distribution**: Expo EAS Submit
- **Code Quality**: ESLint, Prettier, Husky
- **Testing**: Jest, React Native Testing Library

### Development Build Setup
- **Build Service**: Expo EAS Build
- **Development Client**: Custom development build with required native modules
- **Testing**: Physical devices required for push notifications and in-app purchases
- **Prebuild**: Use `expo prebuild` to generate native code when needed

### Push Notifications
- **Service**: Expo Notifications
- **Scheduling**: Background tasks with Expo TaskManager
- **Configuration**: Push notification credentials configured in development build

## Project Structure

```
src/
├── components/
│   ├── goals/          # Goal creation and management
│   ├── habits/         # Habit tracking components
│   ├── tasks/          # Task management
│   ├── focus-timer/    # Pomodoro timer functionality
│   ├── virtual-pet/    # Pet companion features
│   ├── quick-notes/    # Note-taking with smart conversions
│   └── ai-coaching/    # AI suggestions and insights
├── pages/
│   ├── Home/           # Today's Focus dashboard
│   ├── Journey/        # Management hub for goals/habits/tasks
│   ├── Insights/       # Progress visualization and AI feedback
│   ├── Pet/            # Virtual pet interface
│   └── More/           # Notes, settings, additional tools
├── services/
│   ├── ai/             # AI coaching and suggestions
│   ├── storage/        # Data persistence and sync
│   └── notifications/  # Reminders and nudges
└── utils/
    ├── gamification/   # XP system and pet evolution
    └── analytics/      # Progress tracking and metrics
```

## Core User Flows

### Onboarding (< 3 minutes)
1. Welcome screen with feature carousel
2. Choose starting point: Goal, Habit, or Task
3. AI-assisted setup wizard
4. Virtual pet introduction
5. Navigation tour

### Daily Usage
1. **Home**: View Today's Focus dashboard
2. **Complete**: Check off habits, tasks, and milestones
3. **Focus**: Use timer for distraction-free work
4. **Progress**: Pet evolves based on activity

### Weekly Review
1. **Insights**: Review progress charts and AI feedback
2. **Adjust**: Modify goals and habits based on performance
3. **Plan**: Set focus for the upcoming week

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- EAS CLI (for building): `npm install -g eas-cli`
- iOS Simulator / Android Emulator or physical device
- Expo account (create at expo.dev)

### Installation
```bash
# Install dependencies
npm install

# Login to Expo (if not already logged in)
eas login

# Configure EAS Build
eas build:configure

# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Install development build on device
# Then start development server
npx expo start --dev-client
```

### Key Configuration Files
- `app.json` - Expo configuration with native modules
- `eas.json` - EAS Build configuration
- `metro.config.js` - Metro bundler configuration
- `babel.config.js` - Babel configuration for React Native

### Native Module Requirements
The app requires a custom development build due to native modules:
- Database operations (expo-sqlite)
- Push notifications (expo-notifications)
- Background tasks (expo-task-manager)
- File system access (expo-file-system)
- Media library access (expo-media-library)

### Testing Strategy
- **Unit Testing**: Jest, React Native Testing Library
- **Device Testing**: Required for native features (notifications, payments, camera)
- **Development Build Testing**: EAS Build for internal distribution
- **E2E Testing**: Detox (optional for comprehensive testing)

## Deployment

### Development Builds
```bash
# iOS development build
eas build --profile development --platform ios

# Android development build
eas build --profile development --platform android
```

### Production Builds
```bash
# iOS production build
eas build --profile production --platform ios

# Android production build  
eas build --profile production --platform android
```

### App Store Submission
```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details
