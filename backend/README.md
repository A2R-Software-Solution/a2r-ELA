# E-Learning App - Essay Evaluation Backend

AI-powered essay evaluation system built with Firebase Cloud Functions, Python, and OpenRouter.

## 🎯 Features

- ✅ **AI Essay Evaluation** - Powered by NVIDIA Nemotron 3 Nano 30B via OpenRouter
- ✅ **5 Rubric Scoring** - Content, Organization, Language, Grammar, Coherence (20 pts each)
- ✅ **Personalized Feedback** - AI-generated constructive feedback for students
- ✅ **Daily Streak Tracking** - 365-day progress tracking system
- ✅ **Category Support** - Essay Writing, ELA, Math, Science
- ✅ **Secure Authentication** - Firebase Auth integration
- ✅ **Real-time Updates** - Firestore database

---

## 📁 Project Structure

```
backend/
│
├── functions/
│   ├── main.py                     # Entry point
│   │
│   ├── auth/
│   │   └── auth_service.py         # Firebase Auth & token verification
│   │
│   ├── essays/
│   │   ├── essay_routes.py         # API endpoints
│   │   ├── essay_service.py        # Essay submission logic
│   │   └── progress_service.py     # Streak & progress tracking
│   │
│   ├── llm/
│   │   ├── llm_client.py           # OpenRouter API client
│   │   ├── prompts.py              # Evaluation prompts
│   │   └── evaluator.py            # Essay evaluation logic
│   │
│   ├── utils/
│   │   ├── validators.py           # Input validation
│   │   └── responses.py            # API response helpers
│   │
│   ├── config/
│   │   └── settings.py             # Configuration
│   │
│   ├── requirements.txt            # Python dependencies
│   └── __init__.py
│
├── firebase.json                   # Firebase config
├── firestore.rules                 # Security rules
├── firestore.indexes.json          # Database indexes
└── .env.example                    # Environment template
```

---

## 🚀 Quick Start

### 1. Clone and Setup
```bash
cd backend/functions
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# Create .env file
cp .env.example .env

# Add your OpenRouter API key
OPENROUTER_API_KEY=your_api_key_here
```

### 3. Deploy to Firebase
```bash
firebase login
firebase init
firebase deploy
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📡 API Endpoints

### Authentication
All endpoints require Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

### 1. Submit Essay
**POST** `/submit_essay`

```json
{
  "essay_text": "Your essay content here...",
  "category": "essay_writing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Essay submitted and evaluated successfully",
  "data": {
    "submission_id": "abc123",
    "total_score": 85,
    "grade": "B",
    "rubric_scores": {
      "content_and_ideas": 18,
      "organization_and_structure": 17,
      "language_and_vocabulary": 16,
      "grammar_and_mechanics": 17,
      "coherence_and_clarity": 17
    },
    "personalized_feedback": "Great work! Your essay shows...",
    "strengths": ["Clear thesis statement", "Good examples"],
    "areas_for_improvement": ["Add more transitions"],
    "progress": {
      "current_streak": 5,
      "max_streak": 10,
      "total_essays": 23
    }
  }
}
```

### 2. Get Streak
**GET** `/get_streak`

**Response:**
```json
{
  "success": true,
  "data": {
    "current_streak": 5,
    "max_streak": 10,
    "days_until_year": 360,
    "streak_active": true
  }
}
```

### 3. Get Progress Stats
**GET** `/get_progress_stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_essays_submitted": 23,
    "current_streak": 5,
    "max_streak": 10,
    "progress_percentage": 1,
    "category_stats": {
      "essay_writing": {"count": 10, "avg_score": 82},
      "ela": {"count": 8, "avg_score": 78},
      "math": {"count": 3, "avg_score": 85},
      "science": {"count": 2, "avg_score": 80}
    }
  }
}
```

### 4. Get Category Stats
**GET** `/get_category_stats`

### 5. Get Submission
**GET** `/get_essay_submission?submission_id=<id>`

### 6. Get User Submissions
**GET** `/get_user_submissions?limit=10&category=essay_writing`

### 7. Health Check
**GET** `/health_check`

---

## 🎓 Evaluation Rubrics

Each essay is evaluated on 5 criteria (20 points each):

1. **Content & Ideas** (20 pts)
   - Relevance and depth of ideas
   - Originality and creativity
   - Quality of examples

2. **Organization & Structure** (20 pts)
   - Logical flow and coherence
   - Paragraph structure
   - Use of transitions

3. **Language & Vocabulary** (20 pts)
   - Word choice and variety
   - Appropriate vocabulary
   - Precision of language

4. **Grammar & Mechanics** (20 pts)
   - Spelling accuracy
   - Punctuation correctness
   - Sentence structure

5. **Coherence & Clarity** (20 pts)
   - Logical progression
   - Clear expression
   - Reader-friendly presentation

**Total: 100 points**

---

## ⚙️ Configuration

### Word Limits by Category

| Category | Min Words | Max Words |
|----------|-----------|-----------|
| Essay Writing | 50 | 500 |
| ELA | 50 | 400 |
| Math | 30 | 300 |
| Science | 50 | 450 |

### LLM Settings
- **Model**: `nvidia/nemotron-3-nano-30b-a3b:free`
- **Temperature**: 0.3 (evaluation), 0.7 (feedback)
- **Max Tokens**: 1500
- **Timeout**: 60 seconds

---

## 🗄️ Database Schema

### Collections

#### `users/{userId}`
- Basic user profile data

#### `user_progress/{userId}`
```json
{
  "user_id": "string",
  "current_streak": 5,
  "max_streak": 10,
  "total_essays_submitted": 23,
  "last_submission_date": "2024-01-25T10:30:00Z",
  "category_scores": {
    "essay_writing": {
      "count": 10,
      "avg_score": 82,
      "total_score": 820
    }
  }
}
```

#### `essay_submissions/{submissionId}`
```json
{
  "user_id": "string",
  "essay_text": "string",
  "category": "essay_writing",
  "word_count": 234,
  "total_score": 85,
  "grade": "B",
  "rubric_scores": {},
  "personalized_feedback": "string",
  "submitted_at": "2024-01-25T10:30:00Z"
}
```

---

## 🔒 Security

- ✅ Firebase Authentication required
- ✅ Firestore security rules enforced
- ✅ Users can only access their own data
- ✅ API keys stored in environment variables
- ✅ CORS properly configured

---

## 🧪 Testing

### Local Testing with Firebase Emulator
```bash
firebase emulators:start
```

### Unit Tests
```bash
cd functions
pytest
```

---

## 📊 Monitoring

View function logs:
```bash
firebase functions:log
```

Monitor in Firebase Console:
- Functions dashboard
- Firestore usage
- Authentication stats

---

## 🛠️ Tech Stack

- **Backend**: Python 3.11+
- **Framework**: Firebase Cloud Functions
- **Database**: Cloud Firestore
- **Authentication**: Firebase Auth
- **AI**: OpenRouter (NVIDIA Nemotron)
- **Deployment**: Firebase CLI

---

## 📝 Environment Variables

```bash
OPENROUTER_API_KEY=your_key_here
ENVIRONMENT=production
DEBUG=False
```

---

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Follow Python PEP 8 style guide

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Support

For issues or questions:
1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Review Firebase logs
3. Contact the development team

---

## 🎉 Status

**Version**: 1.0.0  
**Status**: Beta - Ready for testing  
**Last Updated**: January 2026

---

Built with ❤️ for students everywhere