# NovelBound - React Native E-Learning App

A comprehensive mobile learning application built with React Native and TypeScript, featuring AI-powered essay evaluation, vocabulary learning, gamification, and exam preparation.

---

## 📱 Features

### ✅ **Authentication**
- Email/Password sign up and sign in
- Firebase Authentication integration
- Secure session management
- Auto-login on app restart
- Account deletion with full data cleanup

### ✅ **Onboarding**
- Beautiful splash screen
- 3-page swipeable intro/tutorial
- First-time user detection

### ✅ **Home Dashboard**
- Dynamic greeting (Good morning/afternoon/evening)
- Avatar with user initials
- Level & XP progress card (purple gradient with glow animation)
- **Today's Plan** section:
  - AI-powered Word of the Day (via Groq LLM)
  - Play Recommended Game card
- Quick Access feature grid (5 items)
- Recent Activity list (last 3 essay submissions)
- Bottom tab navigation (Home, Exam Prep, Games, Profile)

### ✅ **Essay Writing & AI Evaluation**
- Clean writing pad with serif typography
- Category-based word limits
- PDF file upload support (up to 2 files, max 100KB each)
- State & Grade preference selection (PSSA aligned)
- Real-time AI-powered feedback via OpenRouter
- Comprehensive scoring on 5 PSSA domains:
  - Focus
  - Content
  - Organization
  - Style
  - Conventions
- Personalized strengths and improvement suggestions
- Grade calculation (A to F)
- Progress tracking and streak updates
- Badge unlock animations

### ✅ **Games Hub (Playground)**
- Recommended game card based on recent essay performance
- 6 mini-games:
  - **Stay on Topic** — Focus domain
  - **Jumbled Story** — Organization domain
  - **Word Swap** — Style domain
  - **Bug Catcher** — Conventions domain
  - **Detail Detective** — Content domain (AI-powered via Groq)
  - **Boss Battle** — All domains (weekly challenge)
- XP rewards and badge unlocks per game
- Best score tracking per game

### ✅ **Exam Preparation**
- Dark themed header with safe area support
- Tab switcher (PSSA ELA | Placeholder Exam)
- Circular progress ring showing overall completion
- Section checklist with status indicators (complete/in-progress/not started)
- Progress bars per section
- Continue → navigates to Essay Writer
- Pull to refresh support

### ✅ **Leaderboard**
- Grade-based and State-based leaderboard tabs
- Top 3 podium with medal display
- Rank 4+ list with XP and essay count
- Current user highlighted
- Pull to refresh

### ✅ **Profile**
- Avatar with photo upload (camera or gallery)
- Editable display name and birthdate
- Stats row (essays, streak, avg score)
- Badge collection with progress
- Recent essays list with score chips
- State & Grade preferences
- Logout and account deletion

### ✅ **Daily Vocabulary**
- AI-generated word of the day via Groq LLM
- Word, part of speech, meaning, and example sentence
- Refreshes every time the app opens
- Tap to retry on error

### ✅ **Gamification**
- XP system with 5 levels:
  - Level 1: Beginner Writer (0–999 XP)
  - Level 2: Word Explorer (1,000–4,999 XP)
  - Level 3: Story Builder (5,000–14,999 XP)
  - Level 4: Essay Master (15,000–29,999 XP)
  - Level 5: Writing Legend (30,000+ XP)
- Badge system (8 badges)
- Daily streak tracking
- Level-up animations

---

## 🏗️ Tech Stack

### **Frontend**
- **React Native 0.73** — Cross-platform mobile framework
- **TypeScript** — Type-safe JavaScript
- **React Navigation** — Stack navigation
- **React Native Reanimated 4** — Animations (glow, progress bar, fade)
- **React Native SVG** — Circular progress ring
- **React Hooks** — State management (useState, useEffect, useCallback)
- **Safe Area Context** — Dynamic island / notch support

### **Backend & Services**
- **Firebase Authentication** — User auth
- **Firebase Cloud Functions (Python 3.11)** — All backend endpoints
- **Firestore** — User data, essays, gamification
- **OpenRouter (Gemma 3n)** — Essay evaluation
- **Groq (LLaMA 3.1 8B)** — Detail Detective game + Daily Vocab
- **Axios** — HTTP client
- **AsyncStorage** — Local preferences cache

### **Architecture**
- **MVVM Pattern** — Model-View-ViewModel
- **Repository Pattern** — Data abstraction layer
- **Custom Hooks** — Reusable business logic
- **TypeScript Interfaces** — Type-safe data models
- **Event Bus (tabEvents, profileEvents)** — Cross-component communication

---

## 📁 Project Structure
for finding the project structure: dir /S /B *.py | findstr /V /I "functions\venv"
```
D:\coding\A2R\a2r-ELA\backend\test.py
D:\coding\A2R\a2r-ELA\backend\elearningapp\main.py
D:\coding\A2R\a2r-ELA\backend\functions\main.py
D:\coding\A2R\a2r-ELA\backend\functions\test_llm.py
D:\coding\A2R\a2r-ELA\backend\functions\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\auth\auth_service.py
D:\coding\A2R\a2r-ELA\backend\functions\auth\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\config\settings.py
D:\coding\A2R\a2r-ELA\backend\functions\config\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\config\rubrics\pa_rubric.py
D:\coding\A2R\a2r-ELA\backend\functions\config\rubrics\rubric_service.py
D:\coding\A2R\a2r-ELA\backend\functions\config\rubrics\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\essay\essay_routes.py
D:\coding\A2R\a2r-ELA\backend\functions\essay\essay_service.py
D:\coding\A2R\a2r-ELA\backend\functions\essay\progress_service.py
D:\coding\A2R\a2r-ELA\backend\functions\essay\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\file\file_routes.py
D:\coding\A2R\a2r-ELA\backend\functions\file\file_service.py
D:\coding\A2R\a2r-ELA\backend\functions\file\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\gamification\game_routes.py
D:\coding\A2R\a2r-ELA\backend\functions\gamification\reward_engine.py
D:\coding\A2R\a2r-ELA\backend\functions\gamification\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\leaderboard\leaderboard_routes.py
D:\coding\A2R\a2r-ELA\backend\functions\leaderboard\leaderboard_service.py
D:\coding\A2R\a2r-ELA\backend\functions\leaderboard\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\llm\evaluator.py
D:\coding\A2R\a2r-ELA\backend\functions\llm\llm_client.py
D:\coding\A2R\a2r-ELA\backend\functions\llm\prompts.py
D:\coding\A2R\a2r-ELA\backend\functions\llm\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\user\user_routes.py
D:\coding\A2R\a2r-ELA\backend\functions\user\user_service.py
D:\coding\A2R\a2r-ELA\backend\functions\user\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\utils\responses.py
D:\coding\A2R\a2r-ELA\backend\functions\utils\validator.py
D:\coding\A2R\a2r-ELA\backend\functions\utils\__init__.py
D:\coding\A2R\a2r-ELA\backend\functions\vocab\vocab_routes.py
D:\coding\A2R\a2r-ELA\backend\functions\vocab\__init__.py
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
│   │   ExamModels.ts
│   │   FileModels.ts
│   │   GameModels.ts
│   │   GamificationModels.ts
│   │   index.ts
│   │   LeaderboardModels.ts
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
│       ExamRepository.ts
│       FileRepository.ts
│       LeaderboardRepository.ts
│       
├───screens
│   ├───auth
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
│   ├───ExamPrep
│   │   │   ExamPrepScreen.tsx
│   │   │   
│   │   ├───components
│   │   │       ExamActionButton.tsx
│   │   │       ExamHeader.tsx
│   │   │       ExamProgressCard.tsx
│   │   │       ExamSectionRow.tsx
│   │   │       ProgressRing.tsx
│   │   │       
│   │   ├───hooks
│   │   │       useExamPrep.ts
│   │   │       
│   │   └───types
│   │           ExamPrepUiState.ts
│   │           
│   ├───home
│   │   │   HomeScreen.tsx
│   │   │   
│   │   ├───components
│   │   │       BadgeCollection.tsx
│   │   │       BottomNavigationBar.tsx
│   │   │       CategorySection.tsx
│   │   │       DailyVocab.tsx
│   │   │       FeatureGrid.tsx
│   │   │       HomeHeader.tsx
│   │   │       ProfileHeader.tsx
│   │   │       ProfileSettingsSection.tsx
│   │   │       RecentActivity.tsx
│   │   │       RecentEssaysList.tsx
│   │   │       StatsRow.tsx
│   │   │       StreakCard.tsx
│   │   │       TodaysPlan.tsx
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
│   ├───Leaderboard
│   │   │   LeaderboardScreen.tsx
│   │   │   
│   │   ├───components
│   │   │       LeaderboardRow.tsx
│   │   │       TabSelector.tsx
│   │   │       TopThreeCard.tsx
│   │   │       
│   │   ├───hooks
│   │   │       useLeaderboard.ts
│   │   │       
│   │   └───types
│   │           LeaderboardUiState.ts
│   │           
│   ├───Playground
│   │       BossBattleGame.tsx
│   │       BugCatcherGame.tsx
│   │       DetailDetectiveGame.tsx
│   │       JumbledStoryGame.tsx
│   │       PlaygroundScreen.tsx
│   │       StayOnTopicGame.tsx
│   │       WordSwapGame.tsx
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

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18+)
- npm or yarn
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- Python 3.11 (for backend)
- Firebase CLI

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd NovelBound
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install iOS dependencies** (macOS only)
```bash
cd ios && pod install && cd ..
```

4. **Setup backend virtual environment**
```bash
cd backend/functions
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

5. **Create `.env` file** in `backend/functions/`:
```dotenv
NB_GROQ_API_KEY=your_groq_api_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=openai/gpt-oss-20b
PSSA_GROQ_API_KEY=your_pssa_groq_api_key
# Optional: defaults to GROQ_MODEL when blank or omitted.
PSSA_GROQ_MODEL=
ENVIRONMENT=development
```

See `backend/functions/.env.example` for optional PSSA round-robin keys. Firebase loads
`functions/.env` during deployment; use `functions/.env.<project-id>` for project-specific
overrides. Change `GROQ_MODEL` to switch the essay/game and default PSSA model without
editing Python code, then redeploy functions.
> ⚠️ Never commit `.env` to Git — add it to `.gitignore`

6. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Email/Password authentication
   - Download `google-services.json` → Place in `android/app/`
   - Download `GoogleService-Info.plist` → Add to iOS project (Xcode)

7. **Deploy backend**
```bash
cd backend
firebase deploy --only functions
```

8. **Run the app**
```bash
# Android
npm run android

# iOS (macOS only)
npm run ios
```

---

## 📦 Key Dependencies

```json
{
  "react": "18.2.0",
  "react-native": "0.73.0",
  "typescript": "^5.3.3",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/native-stack": "^6.9.17",
  "react-native-reanimated": "^4.2.2",
  "react-native-svg": "*",
  "react-native-safe-area-context": "^4.8.2",
  "axios": "^1.6.5",
  "@react-native-async-storage/async-storage": "^1.21.0",
  "@react-native-firebase/app": "^19.0.0",
  "@react-native-firebase/auth": "^19.0.0",
  "@react-native-documents/picker": "*"
}
```

---

## 🔥 Firebase Cloud Functions Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/submit_essay` | Submit essay for AI evaluation |
| GET | `/get_essay_submission` | Get a specific submission |
| GET | `/get_user_submissions` | Get recent submissions |
| GET | `/get_streak` | Get current streak |
| GET | `/get_progress_stats` | Overall progress stats |
| GET | `/get_category_stats` | Category-wise stats |
| POST | `/save_user_preferences` | Save state & grade |
| GET | `/get_user_preferences` | Get state & grade |
| GET | `/get_user_profile` | Get profile data |
| POST | `/update_user_profile` | Update profile fields |
| DELETE | `/delete_account` | Delete account + all data |
| GET | `/get_gamification` | Get XP, level, badges |
| POST | `/submit_game_result` | Submit mini-game score |
| POST | `/detail_detective_evaluate` | AI sentence evaluation |
| POST | `/boss_battle_submit` | Weekly essay challenge |
| GET | `/get_grade_leaderboard` | Grade-based leaderboard |
| GET | `/get_state_leaderboard` | State-based leaderboard |
| GET | `/get_daily_vocab` | AI-generated vocab word |
| POST | `/extract_pdf_text` | Extract text from PDF |
| GET | `/health_check` | Backend health check |

---

## 🎨 Design System

### **Color Palette**
| Name | Hex |
|------|-----|
| Primary Purple | `#6C4DFF` |
| Primary Light | `#8A6CFF` |
| Accent Green | `#22C55E` |
| Accent Blue | `#3B82F6` |
| Accent Orange | `#F97316` |
| Dark Navy | `#1E1B4B` |
| Page Background | `#F8FAFC` |
| Text Primary | `#0F172A` |
| Text Secondary | `#475569` |
| Text Gray | `#94A3B8` |
| Border | `#E2E8F0` |

### **Typography**
- Headers: Bold, 17–24px
- Body: Regular, 13–15px
- Captions: Regular, 11–12px
- Essay text: Georgia/Serif, 16px

### **Animations**
- StreakCard: Glow pulse + progress bar fill on mount
- HomeHeader: Fade in + slide down
- FeatureGrid: Staggered pop-in
- DailyVocab: Fade in on load
- Badge unlock: Spring scale + fade

---

## 🐛 Troubleshooting

### **Build Errors**

**Problem:** `WorkletsError: Failed to create a worklet`
```bash
# Add to babel.config.js:
plugins: ['react-native-reanimated/plugin']
# Then:
npx react-native start --reset-cache
```

**Problem:** `pydantic-core build failed`
Use Python 3.11 — Python 3.14 is not supported by pydantic-core
py -3.11 -m venv venv

**Problem:** `venv\Scripts\activate.bat not found`
```bash
cd backend/functions
py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Problem:** Metro bundler cache issues
```bash
npm start -- --reset-cache
```

---

## 🚧 Roadmap

### **In Progress**
- [ ] Progress screen (Overview, Essays, Games, Streaks tabs)
- [ ] Leaderboard UI redesign with profile photos
- [ ] Profile screen redesign

ExamPrep → CreateCustomTest → TestInstructions → PracticeSession → Results → Main
Quick summary of everything built today:
Backend: settings.py, llm_client.py, prompts.py, pssa/pssa_routes.py, pssa/__init__.py, main.py — 2 new endpoints (generate_pssa_questions, evaluate_pssa_writing) using a separate PSSA_GROQ_API_KEY.
Frontend: navigation/types.ts, api/apiConfig.ts, api/apiService.ts, Practice/types/PracticeSessionUiState.ts, Practice/hooks/usePracticeSession.ts, Practice/PracticeSessionScreen.tsx, navigation/AppNavigator.tsx.
One thing to test carefully when you run it: the backend's MCQ count distribution logic in prompts.py (mcq_count/short_count split based on total count) combined with the frontend's domain-batching in usePracticeSession.ts — since vocabulary and craft_and_structure domains are meant to produce mostly MCQs but the backend prompt still mixes in some short-answer questions per the 80/20-ish split. Want me to tighten that so MCQ-tagged domains return pure MCQ (no short answer mixed in)?

### **Version 1.1** (Planned)
- [ ] Google Sign-In integration
- [ ] Push notifications (streak reminders, feedback ready)
- [ ] Dark mode theme
- [ ] Offline mode support

### **Version 1.2** (Planned)
- [ ] Exam Prep backend integration
- [ ] Progress tracking backend
- [ ] Social sharing of scores
- [ ] Parent/teacher dashboard

### **Version 2.0** (Future)
- [ ] AI tutor chatbot
- [ ] Voice input for essays
- [ ] Handwriting recognition

---

## 🔐 Security

- ✅ Firebase Authentication for secure user management
- ✅ JWT tokens for API authorization
- ✅ HTTPS for all network requests
- ✅ API keys stored in `.env` (never committed to Git)
- ✅ Input validation on both client and server
- ✅ Password strength requirements
- ✅ Account deletion cleans all Firestore data

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: hr@a2rsoftwaresolution.com

---

**Built by A2RSoftwareSolutions using React Native & TypeScript**
