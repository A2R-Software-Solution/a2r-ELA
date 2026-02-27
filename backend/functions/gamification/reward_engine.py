from typing import Dict, Any, Tuple
from datetime import datetime
from firebase_admin import firestore
from config.settings import settings


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

        # First time — create fresh document
        initial = {
            "user_id":    user_id,
            "xp":         0,
            "level":      1,
            "level_name": "Beginner Writer",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
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
    ) -> None:
        """Save updated XP and level to Firestore"""
        ref = self.db.collection(
            settings.COLLECTION_GAMIFICATION
        ).document(user_id)

        ref.update({
            "xp":         xp,
            "level":      level,
            "level_name": level_name,
            "updated_at": datetime.utcnow(),
        })

    # ─── XP Calculation ───────────────────────────────────────────────────────

    def calculate_xp(self, raw_scores: Dict[str, int]) -> int:
        """
        Calculate XP earned from an essay submission.

        Base:  50 XP for submitting
        Bonus: 25 XP for each domain scored 4/4

        Args:
            raw_scores: { focus: 1-4, content: 1-4, ... }

        Returns:
            Total XP earned for this submission
        """
        xp = settings.XP_VALUES["essay_base"]  # 50 base XP

        for domain in settings.PSSA_DOMAINS:
            score = raw_scores.get(domain, 0)
            if score >= 4:
                xp += settings.XP_VALUES["domain_perfect"]  # +25 per perfect domain
                print(f"  Bonus XP for perfect {domain}: +{settings.XP_VALUES['domain_perfect']}")

        print(f"Total XP earned this submission: {xp}")
        return xp

    # ─── Level Calculation ────────────────────────────────────────────────────

    def get_level_from_xp(self, total_xp: int) -> Tuple[int, str]:
        """
        Determine level and level name from total XP.

        Args:
            total_xp: Cumulative XP

        Returns:
            (level_number, level_name)
        """
        current_level = 1
        current_name = "Beginner Writer"

        for level_num, (min_xp, max_xp, name) in settings.LEVEL_THRESHOLDS.items():
            if min_xp <= total_xp <= max_xp:
                current_level = level_num
                current_name = name
                break

        return current_level, current_name

    def get_next_level_threshold(self, level: int) -> int:
        """
        Get the XP needed to reach the next level.

        Args:
            level: Current level number

        Returns:
            XP threshold for next level (or current max if at top)
        """
        next_level = level + 1
        if next_level in settings.LEVEL_THRESHOLDS:
            return settings.LEVEL_THRESHOLDS[next_level][0]
        # Already at max level — return max of current level
        return settings.LEVEL_THRESHOLDS[level][1]

    # ─── Main Entry Point ─────────────────────────────────────────────────────

    def process_essay_submission(
        self,
        user_id: str,
        raw_scores: Dict[str, int],
    ) -> Dict[str, Any]:
        """
        Main function called after every essay submission.

        1. Get current gamification data
        2. Calculate XP earned
        3. Add to total XP
        4. Determine new level
        5. Save to Firestore
        6. Return rewards dict for API response

        Args:
            user_id:    Firebase user ID
            raw_scores: Domain raw scores from LLM { focus: 1-4, ... }

        Returns:
            rewards dict included in API response
        """
        try:
            print(f"Processing gamification for user {user_id}")

            # Step 1: Get current data
            current = self.get_or_create_gamification(user_id)
            current_xp    = current.get("xp", 0)
            current_level = current.get("level", 1)

            # Step 2: Calculate XP earned this submission
            xp_earned = self.calculate_xp(raw_scores)

            # Step 3: New total XP
            new_total_xp = current_xp + xp_earned

            # Step 4: Determine new level
            new_level, new_level_name = self.get_level_from_xp(new_total_xp)
            level_up = new_level > current_level

            if level_up:
                print(f"LEVEL UP! {current_level} → {new_level} ({new_level_name})")

            # Step 5: Save to Firestore
            self.save_gamification(user_id, new_total_xp, new_level, new_level_name)

            # Step 6: Build rewards response
            next_threshold = self.get_next_level_threshold(new_level)

            rewards = {
                "xp_earned":       xp_earned,
                "total_xp":        new_total_xp,
                "level":           new_level,
                "level_name":      new_level_name,
                "level_up":        level_up,
                "next_threshold":  next_threshold,
            }

            print(f"Rewards: {rewards}")
            return rewards

        except Exception as e:
            # Never let gamification failure break essay submission
            print(f"WARNING: Gamification processing failed: {str(e)}")
            return {
                "xp_earned":      0,
                "total_xp":       0,
                "level":          1,
                "level_name":     "Beginner Writer",
                "level_up":       False,
                "next_threshold": 1000,
            }
reward_engine = RewardEngine()
