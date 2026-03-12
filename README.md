# ELearning App - React Native

A comprehensive mobile learning application built with React Native and TypeScript, featuring AI-powered essay evaluation, user authentication, and progress tracking.

---

## 📱 Features

### ✅ **Authentication**
- Email/Password sign up and sign in
- Firebase Authentication integration
- Secure session management
- Auto-login on app restart

### ✅ **Onboarding**
- Beautiful splash screen
- 3-page swipeable intro/tutorial
- First-time user detection

### ✅ **Home Dashboard**
- User greeting and profile
- Streak tracking (daily learning streak)
- Category filtering (Essay Writing, ELA, Math, Science)
- Quick access feature grid
- Recent courses display
- Bottom tab navigation (Home, Playground, Inbox, Profile)

### ✅ **Essay Writing & AI Evaluation**
- Rich text editor with word count tracking
- Category-based word limits
- Real-time AI-powered feedback
- Comprehensive scoring on 5 rubrics:
  - Content & Ideas
  - Organization & Structure
  - Language & Vocabulary
  - Grammar & Mechanics
  - Coherence & Clarity
- Personalized strengths and improvement suggestions
- Grade calculation (A+ to F)
- Progress tracking and streak updates

---

## 🏗️ Tech Stack

### **Frontend**
- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library (Stack & Tab navigators)
- **React Hooks** - State management (useState, useEffect, useCallback)

### **Backend & Services**
- **Firebase Authentication** - User authentication
- **Cloud Functions** - AI essay evaluation API
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Local data persistence

### **Architecture**
- **MVVM Pattern** - Model-View-ViewModel
- **Repository Pattern** - Data abstraction layer
- **Custom Hooks** - Reusable business logic
- **TypeScript Interfaces** - Type-safe data models

---

## 📁 Project Structure
for finding the project structure: dir /S /B *.py | findstr /V /I "functions\venv"
```
backend/
└── functions/
    ├── __init__.py
    ├── main.py
    ├── test_llm.py
    │
    ├── auth/
    │   ├── __init__.py
    │   └── auth_service.py
    │
    ├── config/
    │   ├── __init__.py
    │   ├── settings.py
    │   │
    │   └── rubrics/
    │       ├── __init__.py
    │       ├── pa_rubric.py
    │       └── rubric_service.py
    │
    ├── essay/
    │   ├── __init__.py
    │   ├── essay_routes.py
    │   ├── essay_service.py
    │   └── progress_service.py
    │
    ├── file/
    │   ├── __init__.py
    │   ├── file_routes.py
    │   └── file_service.py
    │
    ├── gamification/
    │   ├── __init__.py
    │   ├── game_routes.py
    │   └── reward_engine.py
    │
    ├── llm/
    │   ├── __init__.py
    │   ├── evaluator.py
    │   ├── llm_client.py
    │   └── prompts.py
    │
    ├── user/
    │   ├── __init__.py
    │   ├── user_routes.py
    │   └── user_service.py
    │
    └── utils/
        ├── __init__.py
        ├── responses.py
        └── validator.py
```
```
src
├───api
│   │   apiClient.ts
│   │   apiConfig.ts
│   │   apiService.ts
│   │   
│   └───interceptors
│           AuthInterceptor.ts
│
├───assets
│   └───images
│           signin.png
│           signup.png
│
├───auth
│       AuthRepository.ts
│       FirebaseAuthRepository.ts
│
├───hooks
│       useAuth.ts
│       useEssay.ts
│       useEssayEditor.ts
│       useGame.ts
│
├───models
│   │   EssayModels.ts
│   │   FileModels.ts
│   │   GameModels.ts
│   │   GamificationModels.ts
│   │   index.ts
│   │   Result.ts
│   │
│   └───ui
│           CategoryUiModel.ts
│           CourseUiModel.ts
│           FeatureUiModel.ts
│           ProfileUiModel.ts
│           StreakUiModel.ts
│
├───navigation
│       AppNavigator.tsx
│       types.ts
│
├───repositories
│       EssayRepository.ts
│       FileRepository.ts
│
├───screens
│   ├───auth
│   │   │   .DS_Store
│   │   │   SignInScreen.tsx
│   │   │   SignUpScreen.tsx
│   │   │
│   │   ├───hooks
│   │   │       useSignIn.ts
│   │   │       useSignUp.ts
│   │   │
│   │   └───types
│   │           SignInUiState.ts
│   │           SignUpUiState.ts
│   │
│   ├───Essay
│   │   │   EssayEditorScreen.tsx
│   │   │
│   │   ├───components
│   │   │       CompactSendButton.tsx
│   │   │       EssayWritingPad.tsx
│   │   │       FeedbackDialog.tsx
│   │   │       FilePreviewChip.tsx
│   │   │       FileUploadButton.tsx
│   │   │       InputToolbar.tsx
│   │   │       StateSelectorSheet.tsx
│   │   │
│   │   ├───hooks
│   │   │       useEssayEditor.ts
│   │   │
│   │   └───types
│   │           EssayUiState.ts
│   │
│   ├───home
│   │   │   HomeScreen.tsx
│   │   │
│   │   ├───components
│   │   │       BadgeCollection.tsx
│   │   │       BottomNavigationBar.tsx
│   │   │       CategorySection.tsx
│   │   │       FeatureGrid.tsx
│   │   │       HomeHeader.tsx
│   │   │       ProfileHeader.tsx
│   │   │       ProfileSettingsSection.tsx
│   │   │       RecentCourses.tsx
│   │   │       RecentEssaysList.tsx
│   │   │       StatsRow.tsx
│   │   │       StreakCard.tsx
│   │   │
│   │   ├───hooks
│   │   │       useHome.ts
│   │   │       useProfile.ts
│   │   │
│   │   └───types
│   │           HomeUiState.ts
│   │           ProfileUiState.ts
│   │
│   ├───Intro
│   │       IntroScreen.tsx
│   │
│   ├───Playground
│   │       BugCatcherGame.tsx
│   │       JumbledStoryGame.tsx
│   │       PlaygroundScreen.tsx
│   │
│   └───Splash
│           SplashScreen.tsx
│           SplashScreen.tsx.backup
│
└───utils
        PdfTextExtractor.ts
        PreferencesManager.ts
        profileEvents.ts
        tabEvents.ts
```
---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18+)
- npm or yarn
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

### **Installation**

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd ELearningApp
```

2. **Install dependencies**
```bash
   npm install
```

3. **Install iOS dependencies** (macOS only)
```bash
   cd ios
   pod install
   cd ..
```

4. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Email/Password authentication
   - Download `google-services.json` → Place in `android/app/`
   - Download `GoogleService-Info.plist` → Add to iOS project (Xcode)

5. **Run the app**
```bash
   # Android
   npm run android

   # iOS (macOS only)
   npm run ios
```

---

## 📦 Dependencies

### **Core**
```json
{
  "react": "18.2.0",
  "react-native": "0.73.0",
  "typescript": "^5.3.3"
}
```

### **Navigation**
```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/native-stack": "^6.9.17",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "react-native-screens": "^3.29.0",
  "react-native-safe-area-context": "^4.8.2"
}
```

### **Backend & Storage**
```json
{
  "axios": "^1.6.5",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "@react-native-firebase/app": "^19.0.0",
  "@react-native-firebase/auth": "^19.0.0"
}
```

---

## 🔥 Firebase Configuration

### **Authentication Methods**
- ✅ Email/Password (enabled)
- 🔜 Google Sign-In (future)
- 🔜 Apple Sign-In (future)

### **Cloud Functions Endpoints**
- `POST /submit_essay` - Submit essay for AI evaluation
- `GET /get_streak` - Get user's current streak
- `GET /get_progress_stats` - Get overall progress statistics
- `GET /get_category_stats` - Get category-wise stats
- `GET /health_check` - Backend health check

---

## 🎨 UI/UX Design

### **Color Palette**
- Primary: `#7D55FF` (Purple)
- Background: `#FFFFFF` (White)
- Surface: `#F5F5F5` (Light Gray)
- Text: `#000000` (Black)
- Error: `#FF0000` (Red)

### **Typography**
- Headers: Bold, 18-24px
- Body: Regular, 14-16px
- Captions: Regular, 12px

### **Components**
- Material Design inspired
- Custom cards with rounded corners (12-16px radius)
- Smooth animations and transitions
- Responsive layouts

---

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] User can sign up with email/password
- [ ] User can sign in with existing credentials
- [ ] Intro screens show only on first launch
- [ ] Home screen displays user data correctly
- [ ] Category filtering works
- [ ] Essay submission succeeds
- [ ] AI feedback displays properly
- [ ] Streak updates after essay submission
- [ ] Logout works and redirects to sign in

### **Test Accounts**
```
Email: test@example.com
Password: test123456
```

---

## 📝 API Integration

### **Base URL**
```
https://us-central1-e-learning-app-9d86f.cloudfunctions.net/
```

### **Authentication**
All API requests include Firebase ID token in headers:
```
Authorization: Bearer <firebase-id-token>
```

### **Request/Response Format**
```typescript
// Request
interface EssaySubmissionRequest {
  essay_text: string;
  category: 'essay_writing' | 'ela' | 'math' | 'science';
}

// Response
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
```

---

## 🔐 Security

- ✅ Firebase Authentication for secure user management
- ✅ JWT tokens for API authorization
- ✅ HTTPS for all network requests
- ✅ Secure storage with AsyncStorage
- ✅ Input validation on both client and server
- ✅ Password strength requirements

---

## 🐛 Troubleshooting

### **Build Errors**

**Problem:** `Plugin with id 'com.facebook.react' not found`
```bash
cd android
gradlew clean
cd ..
npm run android
```

**Problem:** `Firebase not initialized`
```bash
# Make sure you have:
npm install @react-native-firebase/app
# And google-services.json in android/app/
```

**Problem:** Metro bundler cache issues
```bash
npm start -- --reset-cache
```

### **Common Issues**

1. **App crashes on startup**
   - Check Firebase configuration
   - Verify `google-services.json` is present

2. **Network errors**
   - Check internet connection
   - Verify API base URL in `apiConfig.ts`

3. **Authentication fails**
   - Verify Firebase Email/Password is enabled
   - Check email format and password length

---

## 🚧 Roadmap

### **Version 1.1** (Planned)
- [ ] Google Sign-In integration
- [ ] Offline mode support
- [ ] Push notifications
- [ ] Dark mode theme

### **Version 1.2** (Planned)
- [ ] Course content playback
- [ ] Quiz module
- [ ] Leaderboard
- [ ] Social sharing

### **Version 2.0** (Future)
- [ ] AI tutor chatbot
- [ ] Voice input for essays
- [ ] Handwriting recognition
- [ ] Parent/teacher dashboard

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- React Native community
- Firebase team
- AI model providers
- Open source contributors

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: hr@a2rsoftwaresolution.com
- Documentation: [Link to docs]

---

## 📊 App Metrics

- **Screens:** 6 (Splash, Intro, Sign In, Sign Up, Home, Essay Editor)
- **Components:** 15+ reusable components
- **API Endpoints:** 6 backend endpoints
- **Code Quality:** TypeScript strict mode enabled
- **Performance:** Optimized with React.memo and useCallback

---

**Built by A2RSoftwareSolutions using React Native & TypeScript**