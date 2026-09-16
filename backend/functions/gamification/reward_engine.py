from typing import Dict, Any, Tuple, List, Optional
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
    # ── New badges for Phase 6 games ─────────────────────────────────────────
    {
        "id":              "detail_king",
        "name":            "Detail King/Queen",
        "description":     "Score 5/5 in Detail Detective",
        "icon":            "🔍",
        "condition_type":  "game_perfect",
        "condition_value": "detail_detective",
    },
    {
        "id":              "boss_slayer",
        "name":            "Boss Slayer",
        "description":     "Beat your personal best score in Boss Battle",
        "icon":            "⚔️",
        "condition_type":  "beat_personal_best",
        "condition_value": True,
    },
    #--new bedges for phase 5 games --------------------
      {
        "id":              "sharp_shooter",
        "name":            "Sharp Shooter",
        "description":     "Complete Stay on Topic with a perfect score",
        "icon":            "🎯",
        "condition_type":  "game_perfect",
        "condition_value": "stay_on_topic",
    },
    {
        "id":              "word_wizard",
        "name":            "Word Wizard",
        "description":     "Complete Word Swap with a perfect score",
        "icon":            "🧙",
        "condition_type":  "game_perfect",
        "condition_value": "word_swap",
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
            "user_id":                    user_id,
            "xp":                         0,
            "level":                      self.get_level_from_xp(0)[0],
            "level_name":                 self.get_level_from_xp(0)[1],
            "badges_earned":              [],
            "total_essays_submitted":     0,
            "boss_battle_personal_best":  0,
            "created_at":                 datetime.utcnow(),
            "updated_at":                 datetime.utcnow(),
        }
        from google.api_core.exceptions import AlreadyExists
        try:
            ref.create(initial)
        except AlreadyExists:
            return ref.get().to_dict()
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
        boss_battle_personal_best: Optional[int] = None,
    ) -> None:
        """Save updated XP, level, badges, essay count, and personal best to Firestore"""
        ref = self.db.collection(
            settings.COLLECTION_GAMIFICATION
        ).document(user_id)

        update_data = {
            "xp":                     xp,
            "level":                  level,
            "level_name":             level_name,
            "badges_earned":          badges_earned,
            "total_essays_submitted": total_essays_submitted,
            "updated_at":             datetime.utcnow(),
        }

        # Only update personal best if explicitly passed
        if boss_battle_personal_best is not None:
            update_data["boss_battle_personal_best"] = boss_battle_personal_best

        ref.update(update_data)

    # ─── Badge Checking ───────────────────────────────────────────────────────

    def check_badges(
        self,
        already_earned: List[str],
        raw_scores: Dict[str, int],
        new_total_xp: int,
        new_level: int,
        total_essays: int,
        game_scores: Dict[str, int] = None,
        beat_personal_best: bool = False,
    ) -> List[Dict[str, Any]]:
        """
        Check all badge conditions and return newly unlocked badges.
        Only returns badges not already earned — never duplicates.

        Args:
            already_earned:      List of badge ids already earned
            raw_scores:          Domain scores from this submission
            new_total_xp:        XP total after this submission
            new_level:           Level after this submission
            total_essays:        Essay count after incrementing
            game_scores:         Dict of game_id -> score (0-100)
            beat_personal_best:  True if student beat their Boss Battle best

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
                # detail_detective uses 1-5 scale → perfect = 5 → stored as 100 (5*20)
                unlocked = game_scores.get(condition_val, 0) >= 100

            elif condition_type == "beat_personal_best":
                unlocked = beat_personal_best is True

            if unlocked:
                print(f"  Badge unlocked: {badge_id} ({badge['name']})")
                newly_unlocked.append({
                    "id":          badge_id,
                    "name":        badge["name"],
                    "description": badge["description"],
                    "icon":        badge["icon"],
                })

        return newly_unlocked

    # ─── XP Calculation (Games) ───────────────────────────────────────────────

    def calculate_game_xp(
        self,
        game_id: str,
        score: int,
        time_taken: int = None,
        lives_remaining: int = None,
    ) -> int:
        """
        Calculate XP earned from a mini-game submission.

        Bug Catcher (bug_catcher):
            Base: 20 XP
            +10  if score >= settings.GAME_XP_RULES["high_score"]
            +10  if score == settings.GAME_XP_RULES["perfect_score"]
            +10  if lives_remaining == settings.GAME_XP_RULES["perfect_lives"] (no lives lost)

        Jumbled Story (jumbled_story):
            Base: 20 XP
            +10  if score >= settings.GAME_XP_RULES["high_score"]
            +10  if score == settings.GAME_XP_RULES["perfect_score"]
            +10  speed bonus if time_taken <= settings.GAME_XP_RULES["jumbled_speed_seconds"] seconds

        Stay on Topic (stay_on_topic):
            Base: 20 XP
            +10  if score >= settings.GAME_XP_RULES["high_score"]
            +10  if score == settings.GAME_XP_RULES["perfect_score"]
            +10  speed bonus if time_taken <= settings.GAME_XP_RULES["topic_speed_seconds"] seconds

        Word Swap (word_swap):
            Base: 20 XP
            +10  if score >= settings.GAME_XP_RULES["high_score"]
            +10  if score == settings.GAME_XP_RULES["perfect_score"]

        Max possible: 50 XP (matches XP range 20-50 in spec)
        """
        xp = settings.GAME_XP_RULES["base"]

        if game_id == "bug_catcher":
            if score >= settings.GAME_XP_RULES["high_score"]:
                xp += settings.GAME_XP_RULES["bonus"]
            if score == settings.GAME_XP_RULES["perfect_score"]:
                xp += settings.GAME_XP_RULES["bonus"]
            if lives_remaining is not None and lives_remaining == settings.GAME_XP_RULES["perfect_lives"]:
                xp += settings.GAME_XP_RULES["bonus"]

        elif game_id == "jumbled_story":
            if score >= settings.GAME_XP_RULES["high_score"]:
                xp += settings.GAME_XP_RULES["bonus"]
            if score == settings.GAME_XP_RULES["perfect_score"]:
                xp += settings.GAME_XP_RULES["bonus"]
            if time_taken is not None and time_taken <= settings.GAME_XP_RULES["jumbled_speed_seconds"]:
                xp += settings.GAME_XP_RULES["bonus"]

        elif game_id == "stay_on_topic":
            if score >= settings.GAME_XP_RULES["high_score"]:
                xp += settings.GAME_XP_RULES["bonus"]
            if score == settings.GAME_XP_RULES["perfect_score"]:
                xp += settings.GAME_XP_RULES["bonus"]
            if time_taken is not None and time_taken <= settings.GAME_XP_RULES["topic_speed_seconds"]:
                xp += settings.GAME_XP_RULES["bonus"]

        elif game_id == "word_swap":
            if score >= settings.GAME_XP_RULES["high_score"]:
                xp += settings.GAME_XP_RULES["bonus"]
            if score == settings.GAME_XP_RULES["perfect_score"]:
                xp += settings.GAME_XP_RULES["bonus"]

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

            elif condition_type in (
                "domain_perfect", "all_domains_perfect",
                "game_perfect", "beat_personal_best"
            ):
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

    # ─── XP Calculation (Essays) ──────────────────────────────────────────────

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
        levels = sorted(settings.LEVEL_THRESHOLDS.items(), key=lambda item: item[1][0])
        selected = levels[0]
        for level in levels:
            if total_xp >= level[1][0]:
                selected = level
        return selected[0], selected[1][2]

    def get_next_level_threshold(self, level: int) -> int:
        """Get the XP needed to reach the next level."""
        levels = sorted(settings.LEVEL_THRESHOLDS, key=lambda key: settings.LEVEL_THRESHOLDS[key][0])
        index = levels.index(level)
        if index + 1 < len(levels):
            return settings.LEVEL_THRESHOLDS[levels[index + 1]][0]
        return settings.LEVEL_THRESHOLDS[level][1]

    # ─── Main Entry Point ─────────────────────────────────────────────────────

    def process_essay_submission(
        self,
        user_id: str,
        raw_scores: Dict[str, int],
        streak_bonus_xp: int = 0,
        event_id: str = None,
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
        """
        from gamification.atomic_rewards import award
        result = award(self, user_id, self.calculate_xp(raw_scores) + streak_bonus_xp,
                       raw_scores=raw_scores, essay_count=1, event_id=event_id)
        result['xp_earned'] -= streak_bonus_xp
        result['streak_bonus_xp'] = streak_bonus_xp
        return result

    def apply_streak_bonus(
        self,
        user_id: str,
        streak_bonus_xp: int,
        event_id: str = None,
    ) -> Dict[str, Any]:
        """
        Apply streak milestone bonus XP after process_essay_submission().

        Called from essay_routes when progress_service returns a non-zero
        streak_bonus_xp. Adds bonus on top of XP already saved, rechecks
        badges (with empty raw_scores since domain badges already ran),
        saves, and returns a partial rewards dict to be merged.
        """
        if streak_bonus_xp <= 0:
            return {}
        from gamification.atomic_rewards import award
        result = award(self, user_id, streak_bonus_xp, event_id=event_id)
        result['streak_bonus_xp'] = streak_bonus_xp
        return result


reward_engine = RewardEngine()
