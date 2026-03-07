from typing import Dict, Any, Tuple, List
from datetime import datetime
from firebase_admin import firestore
from config.settings import settings


# ─── Badge Definitions ────────────────────────────────────────────────────────
# Single source of truth for all badge metadata and unlock conditions.

BADGE_DEFINITIONS = [
    {
        "id":              "first_essay",
        "name":            "First Steps",
        "description":     "Submit your first essay",
        "icon":            "✍️",
        "condition_type":  "total_essays",
        "condition_value": 1,
    },
    {
        "id":              "essay_5",
        "name":            "Getting Started",
        "description":     "Submit 5 essays",
        "icon":            "📝",
        "condition_type":  "total_essays",
        "condition_value": 5,
    },
    {
        "id":              "essay_10",
        "name":            "Dedicated Writer",
        "description":     "Submit 10 essays",
        "icon":            "📚",
        "condition_type":  "total_essays",
        "condition_value": 10,
    },
    {
        "id":              "perfect_focus",
        "name":            "Laser Focus",
        "description":     "Score 4/4 in Focus on any essay",
        "icon":            "🎯",
        "condition_type":  "domain_perfect",
        "condition_value": "focus",
    },
    {
        "id":              "perfect_essay",
        "name":            "Flawless",
        "description":     "Score 4/4 in all domains on a single essay",
        "icon":            "⭐",
        "condition_type":  "all_domains_perfect",
        "condition_value": 4,
    },
    {
        "id":              "level_2",
        "name":            "Word Explorer",
        "description":     "Reach Level 2",
        "icon":            "🚀",
        "condition_type":  "level",
        "condition_value": 2,
    },
    {
        "id":              "level_3",
        "name":            "Story Builder",
        "description":     "Reach Level 3",
        "icon":            "🏆",
        "condition_type":  "level",
        "condition_value": 3,
    },
    {
        "id":              "xp_500",
        "name":            "XP Grinder",
        "description":     "Earn 500 total XP",
        "icon":            "⚡",
        "condition_type":  "total_xp",
        "condition_value": 500,
    },
    {
        "id":              "grammar_champion",
        "name":            "Grammar Champion",
        "description":     "Complete Bug Catcher with a perfect score",
        "icon":            "🐛",
        "condition_type":  "game_perfect",
        "condition_value": "bug_catcher",
    },
    {
        "id":              "master_navigator",
        "name":            "Master Navigator",
        "description":     "Complete Jumbled Story with a perfect score",
        "icon":            "🧭",
        "condition_type":  "game_perfect",
        "condition_value": "jumbled_story",
    },
]


class RewardEngine:
    """Handles all XP, level, and gamification logic"""

    def __init__(self):
        self._db = None

    @property
    def db(self):
        if self._db is None:
            self._db = firestore.client()
        return self._db

    # ─── Firestore ────────────────────────────────────────────────────────────

    def get_or_create_gamification(self, user_id: str) -> Dict[str, Any]:
        """Get or create gamification document for user"""
        ref = self.db.collection(
            settings.COLLECTION_GAMIFICATION
        ).document(user_id)

        doc = ref.get()

        if doc.exists:
            return doc.to_dict()

        initial = {
            "user_id":                user_id,
            "xp":                     0,
            "level":                  1,
            "level_name":             "Beginner Writer",
            "badges_earned":          [],
            "total_essays_submitted": 0,
            "created_at":             datetime.utcnow(),
            "updated_at":             datetime.utcnow(),
        }
        ref.set(initial)
        print(f"Created gamification doc for user {user_id}")
        return initial

    def save_gamification(
        self,
        user_id: str,
        xp: int,
        level: int,
        level_name: str,
        badges_earned: List[str],
        total_essays_submitted: int,
    ) -> None:
        """Save updated XP, level, badges, and essay count to Firestore"""
        ref = self.db.collection(
            settings.COLLECTION_GAMIFICATION
        ).document(user_id)

        ref.update({
            "xp":                     xp,
            "level":                  level,
            "level_name":             level_name,
            "badges_earned":          badges_earned,
            "total_essays_submitted": total_essays_submitted,
            "updated_at":             datetime.utcnow(),
        })

    # ─── Badge Checking ───────────────────────────────────────────────────────

    def check_badges(
        self,
        already_earned: List[str],
        raw_scores: Dict[str, int],
        new_total_xp: int,
        new_level: int,
        total_essays: int,
        game_scores: Dict[str, int] = None,
    ) -> List[Dict[str, Any]]:
        """
        Check all badge conditions and return newly unlocked badges.
        Only returns badges not already earned — never duplicates.

        Args:
            already_earned: List of badge ids already earned
            raw_scores:     Domain scores from this submission
            new_total_xp:   XP total after this submission
            new_level:      Level after this submission
            total_essays:   Essay count after incrementing

        Returns:
            List of newly unlocked badge dicts
        """
        game_scores = game_scores or {}
        newly_unlocked = []

        for badge in BADGE_DEFINITIONS:
            badge_id       = badge["id"]
            condition_type = badge["condition_type"]
            condition_val  = badge["condition_value"]

            if badge_id in already_earned:
                continue

            unlocked = False

            if condition_type == "total_essays":
                unlocked = total_essays >= condition_val

            elif condition_type == "domain_perfect":
                unlocked = raw_scores.get(condition_val, 0) >= 4

            elif condition_type == "all_domains_perfect":
                unlocked = all(
                    raw_scores.get(domain, 0) >= 4
                    for domain in settings.PSSA_DOMAINS
                )

            elif condition_type == "level":
                unlocked = new_level >= condition_val

            elif condition_type == "total_xp":
                unlocked = new_total_xp >= condition_val
            
            elif condition_type == "game_perfect":
                unlocked = game_scores.get(condition_val, 0) >= 100

            if unlocked:
                print(f"  Badge unlocked: {badge_id} ({badge['name']})")
                newly_unlocked.append({
                    "id":          badge_id,
                    "name":        badge["name"],
                    "description": badge["description"],
                    "icon":        badge["icon"],
                })

        return newly_unlocked
    
    def calculate_game_xp(
        self,
        game_id: str,
        score: int,
        time_taken: int =None,
        lives_remaining: int = None,
    ) -> int:
        """
        Calculate XP earned from a mini-game submission.

    Bug Catcher  (bug_catcher):
        Base: 20 XP
        +10  if score >= 80
        +10  if score == 100
        +10  if lives_remaining == 3 (no lives lost)

    Jumbled Story (jumbled_story):
        Base: 20 XP
        +10  if score >= 80
        +10  if score == 100
        +10  speed bonus if time_taken <= 30 seconds

    Max possible: 50 XP  (matches XP range 20-50 in spec)
    
        """
        xp = 20  # base for any game attempt

        if game_id == "bug_catcher":
            if score >= 80:
                xp += 10
            if score == 100:
                xp += 10
            if lives_remaining is not None and lives_remaining == 3:
                xp += 10

        elif game_id == "jumbled_story":
            if score >= 80:
                xp += 10
            if score == 100:
                xp += 10
            if time_taken is not None and time_taken <= 30:
                xp += 10

        print(f"Game XP earned — game: {game_id}, score: {score}, xp: {xp}")
        return xp

    def build_badge_progress(
        self,
        badges_earned: List[str],
        total_essays: int,
        total_xp: int,
        level: int,
    ) -> List[Dict[str, Any]]:
        """
        Build full badge list with unlock status and progress for the API response.

        Args:
            badges_earned: Badge ids the user has unlocked
            total_essays:  Total essays submitted
            total_xp:      Current XP
            level:         Current level

        Returns:
            List of all badges with unlocked + progress fields
        """
        result = []

        for badge in BADGE_DEFINITIONS:
            badge_id       = badge["id"]
            condition_type = badge["condition_type"]
            condition_val  = badge["condition_value"]
            unlocked       = badge_id in badges_earned

            progress = 0
            total    = 1

            if condition_type == "total_essays":
                progress = min(total_essays, condition_val)
                total    = condition_val

            elif condition_type == "total_xp":
                progress = min(total_xp, condition_val)
                total    = condition_val

            elif condition_type == "level":
                progress = min(level, condition_val)
                total    = condition_val

            elif condition_type in ("domain_perfect", "all_domains_perfect"):
                progress = 1 if unlocked else 0
                total    = 1

            result.append({
                "id":          badge_id,
                "name":        badge["name"],
                "description": badge["description"],
                "icon":        badge["icon"],
                "unlocked":    unlocked,
                "progress":    progress,
                "total":       total,
            })

        return result

    # ─── XP Calculation ───────────────────────────────────────────────────────

    def calculate_xp(self, raw_scores: Dict[str, int]) -> int:
        """
        Calculate XP earned from an essay submission.

        Base:  50 XP for submitting
        Bonus: 25 XP for each domain scored 4/4
        """
        xp = settings.XP_VALUES["essay_base"]

        for domain in settings.PSSA_DOMAINS:
            score = raw_scores.get(domain, 0)
            if score >= 4:
                xp += settings.XP_VALUES["domain_perfect"]
                print(f"  Bonus XP for perfect {domain}: +{settings.XP_VALUES['domain_perfect']}")

        print(f"Total XP earned this submission: {xp}")
        return xp

    # ─── Level Calculation ────────────────────────────────────────────────────

    def get_level_from_xp(self, total_xp: int) -> Tuple[int, str]:
        """Determine level and level name from total XP."""
        current_level = 1
        current_name  = "Beginner Writer"

        for level_num, (min_xp, max_xp, name) in settings.LEVEL_THRESHOLDS.items():
            if min_xp <= total_xp <= max_xp:
                current_level = level_num
                current_name  = name
                break

        return current_level, current_name

    def get_next_level_threshold(self, level: int) -> int:
        """Get the XP needed to reach the next level."""
        next_level = level + 1
        if next_level in settings.LEVEL_THRESHOLDS:
            return settings.LEVEL_THRESHOLDS[next_level][0]
        return settings.LEVEL_THRESHOLDS[level][1]

    # ─── Main Entry Point ─────────────────────────────────────────────────────

    def process_essay_submission(
        self,
        user_id: str,
        raw_scores: Dict[str, int],
        streak_bonus_xp: int = 0,
    ) -> Dict[str, Any]:
        """
        Main function called after every essay submission.

        1. Get current gamification data
        2. Calculate XP from essay scores + streak bonus
        3. Determine new level
        4. Increment essay counter
        5. Check for newly unlocked badges
        6. Save to Firestore
        7. Return rewards dict

        Args:
            user_id:         Firebase user ID
            raw_scores:      Domain raw scores { focus: 1-4, ... }
            streak_bonus_xp: Bonus XP from streak milestone (default 0)
                             Passed in from essay_routes after
                             progress_service returns its value.
        """
        try:
            print(f"Processing gamification for user {user_id}")

            current       = self.get_or_create_gamification(user_id)
            current_xp    = current.get("xp", 0)
            current_level = current.get("level", 1)
            badges_earned = list(current.get("badges_earned", []))
            total_essays  = current.get("total_essays_submitted", 0)

            # XP from essay + streak bonus
            xp_earned = self.calculate_xp(raw_scores)
            if streak_bonus_xp > 0:
                print(f"  Streak bonus XP: +{streak_bonus_xp}")

            new_total_xp     = current_xp + xp_earned + streak_bonus_xp
            new_level, new_level_name = self.get_level_from_xp(new_total_xp)
            level_up         = new_level > current_level
            new_total_essays = total_essays + 1

            if level_up:
                print(f"LEVEL UP! {current_level} -> {new_level} ({new_level_name})")

            newly_unlocked = self.check_badges(
                already_earned=badges_earned,
                raw_scores=raw_scores,
                new_total_xp=new_total_xp,
                new_level=new_level,
                total_essays=new_total_essays,
                game_scores = {}
            )

            badges_earned += [b["id"] for b in newly_unlocked]

            self.save_gamification(
                user_id=user_id,
                xp=new_total_xp,
                level=new_level,
                level_name=new_level_name,
                badges_earned=badges_earned,
                total_essays_submitted=new_total_essays,
            )

            next_threshold = self.get_next_level_threshold(new_level)

            rewards = {
                "xp_earned":             xp_earned,
                "streak_bonus_xp":       streak_bonus_xp,
                "total_xp":              new_total_xp,
                "level":                 new_level,
                "level_name":            new_level_name,
                "level_up":              level_up,
                "next_threshold":        next_threshold,
                "newly_unlocked_badges": newly_unlocked,
            }

            print(f"Rewards: {rewards}")
            return rewards

        except Exception as e:
            print(f"WARNING: Gamification processing failed: {str(e)}")
            return {
                "xp_earned":             0,
                "streak_bonus_xp":       0,
                "total_xp":              0,
                "level":                 1,
                "level_name":            "Beginner Writer",
                "level_up":              False,
                "next_threshold":        1000,
                "newly_unlocked_badges": [],
            }

    # ─── Streak Bonus Application ─────────────────────────────────────────────

    def apply_streak_bonus(
        self,
        user_id: str,
        streak_bonus_xp: int,
    ) -> Dict[str, Any]:
        """
        Apply streak milestone bonus XP after process_essay_submission().

        Called from essay_routes when progress_service returns a non-zero
        streak_bonus_xp. Adds bonus on top of XP already saved, rechecks
        badges (with empty raw_scores since domain badges already ran),
        saves, and returns a partial rewards dict to be merged.

        Args:
            user_id:         Firebase user ID
            streak_bonus_xp: Bonus XP to add

        Returns:
            Partial rewards dict — empty dict if bonus is 0 or call fails
        """
        if streak_bonus_xp <= 0:
            return {}

        try:
            print(f"Applying streak bonus +{streak_bonus_xp} XP for user {user_id}")

            current       = self.get_or_create_gamification(user_id)
            current_xp    = current.get("xp", 0)
            current_level = current.get("level", 1)
            badges_earned = list(current.get("badges_earned", []))
            total_essays  = current.get("total_essays_submitted", 0)

            new_total_xp              = current_xp + streak_bonus_xp
            new_level, new_level_name = self.get_level_from_xp(new_total_xp)
            level_up                  = new_level > current_level

            # Empty raw_scores — domain badges already awarded this submission
            newly_unlocked = self.check_badges(
                already_earned=badges_earned,
                raw_scores={},
                new_total_xp=new_total_xp,
                new_level=new_level,
                total_essays=total_essays,
                game_scores = {}
            )

            badges_earned += [b["id"] for b in newly_unlocked]

            self.save_gamification(
                user_id=user_id,
                xp=new_total_xp,
                level=new_level,
                level_name=new_level_name,
                badges_earned=badges_earned,
                total_essays_submitted=total_essays,
            )

            return {
                "streak_bonus_xp":       streak_bonus_xp,
                "total_xp":              new_total_xp,
                "level":                 new_level,
                "level_name":            new_level_name,
                "level_up":              level_up,
                "next_threshold":        self.get_next_level_threshold(new_level),
                "newly_unlocked_badges": newly_unlocked,
            }

        except Exception as e:
            print(f"WARNING: apply_streak_bonus failed: {str(e)}")
            return {}


reward_engine = RewardEngine()