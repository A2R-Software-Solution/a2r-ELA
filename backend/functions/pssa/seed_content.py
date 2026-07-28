"""
seed_content.py
---------------
ONE-TIME script — run manually from terminal to populate Firestore
with grade-specific PSSA ELA content.

Usage:
    python seed_content.py

After running, Firestore will have:
    pssa_content/grade_3  →  { content: "...", updated_at: timestamp }
    pssa_content/grade_4  →  { content: "...", updated_at: timestamp }

For future grades: add a new GRADE_X_CONTENT string below and call
_seed_grade("X", GRADE_X_CONTENT) at the bottom.
"""

import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

# ── Firebase init ─────────────────────────────────────────────────────────────
# Uses Application Default Credentials when deployed on Firebase / GCP.
# Locally: set GOOGLE_APPLICATION_CREDENTIALS env var to your service account JSON.
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()
COLLECTION = "pssa_content"


# =============================================================================
# GRADE 3 CONTENT
# Extracted from: 3rd_grade_ELA_PSSA_question.pdf
# Covers: Fiction, Informational, Poetry, Grammar, Written Response
# Difficulty sets: Easy (Set 1), Medium (Set 2), Hard (Set 3)
# =============================================================================

GRADE_3_CONTENT = """
GRADE 3 PSSA ELA — REFERENCE CONTENT
======================================

WHAT THE 3RD GRADE PSSA ELA INCLUDES
---------------------------------------

1. QUESTION TYPES
- Multiple-Choice Questions (MCQ) based on one or two reading passages
- Evidence-Based Questions (select TWO correct answers)
- Written Response (short paragraph, 4–7 sentences)

2. PASSAGE TYPES
- Fiction stories
- Informational articles
- Poems (3–4 stanzas)

3. SKILLS TESTED
- Main idea and key details
- Theme and lesson
- Vocabulary in context (synonyms, meaning from context)
- Character traits
- Author's purpose
- Text evidence and inference
- Comparing passages
- Sequencing (which event happened first/last)
- Grammar and language (subject-verb agreement, pronouns)
- Opinion vs. fact

4. WRITING RESPONSE FORMAT
- Students answer a text-dependent question using evidence from the passage
- Write one well-organized paragraph (5–7 sentences)
- RACE strategy: Restate, Answer, Cite evidence, Explain

SCORING FOR WRITTEN RESPONSE
- Answering the question completely
- Using at least two pieces of evidence from the passage
- Organizing ideas clearly (beginning, middle, end)
- Correct grammar, spelling, and punctuation

======================================
SAMPLE PASSAGES AND QUESTION STYLES
======================================

--- FICTION PASSAGE EXAMPLE (Easy) ---
Title: The New Student
Characters: Maya (kind, friendly), Leo (new student, nervous)
Setting: School classroom, recess, art class
Plot: Maya notices Leo sitting alone. She invites him to play kickball. Leo joins art class next day and builds a strong paper bridge. By Friday Leo is laughing with classmates.
Theme/Lesson: Being kind can help others feel included.

QUESTION STYLES FOR FICTION:
- Main idea: "What is the main idea of the story?"
- Character trait: "Which word best describes Maya?" / "Which sentence BEST shows Maya is kind?"
- Inference: "What can the reader conclude about Leo at the end?"
- Vocabulary: "What does the word 'creative' mean in the story?"
- Sequencing: "Which event happened first?"
- Lesson: "Which lesson does the story teach?"
- Best title: "Which title best fits the story?"

--- INFORMATIONAL PASSAGE EXAMPLE (Easy) ---
Title: Why Bees Are Important
Key facts:
- Bees collect nectar and carry pollen from flower to flower
- This helps plants grow fruits, vegetables, and seeds
- Farmers depend on bees to pollinate crops (apples, pumpkins, blueberries)
- Bees help wildflowers grow, which provide food/shelter for birds and butterflies
- Scientists encourage planting bee-friendly flowers and avoiding harmful chemicals

QUESTION STYLES FOR INFORMATIONAL:
- Main idea: "What is the main idea of the passage?"
- Key detail: "What do bees collect from flowers?"
- Vocabulary: "What does the word 'depend' mean?"
- Opinion vs fact: "Which sentence is an opinion?"
- Author's purpose: "What is the author's purpose?"
- Text evidence: "Which detail supports the idea that bees help people?"
- Action/recommendation: "Which would help bees the most?"

--- FICTION PASSAGE EXAMPLE (Medium) ---
Title: A New Friend
Characters: Ava (kind), Nora (new student, lonely)
Setting: Library, classroom, science project
Plot: Ava notices Nora reading about space. They become friends. Ava invites Nora to be her science partner. They build a solar system model and win first place. Nora makes many new friends.
Theme: Being kind can make someone feel welcome.

--- INFORMATIONAL PASSAGE EXAMPLE (Medium) ---
Title: Why Trees Matter
Key facts:
- Leaves clean the air (take in carbon dioxide, give off oxygen)
- Trees provide homes for birds, squirrels, insects
- Roots keep soil from washing away during rain
- Trees cool the air in summer
- Planting trees improves neighborhoods and environment

--- POETRY EXAMPLE (Medium) ---
Title: Morning
Content: Birds sing, flowers bloom, bright sun chases away gloom
Rhyme scheme: lines 2 and 4 rhyme (bloom/gloom)
Mood/feeling: Peaceful, happy, positive
Imagery: Visual (flowers blooming, sun climbing the sky)

QUESTION STYLES FOR POETRY:
- Main topic: "What is the poem mostly about?"
- Rhyme: "Which words rhyme?"
- Figurative language: "What does 'chasing away the gloom' mean?"
- Word meaning: "Which word has the most positive meaning?"
- Mood: "What feeling does the poem create?"
- Author's purpose: "Why did the author write this poem?"

--- FICTION PASSAGE EXAMPLE (Hard) ---
Title: The Lost Lunchbox
Characters: Ethan (learns lesson), Mia (helpful), Mrs. Green (teacher)
Setting: School on first day of spring
Plot: Ethan cannot find his lunchbox on the lunch shelf. He worries someone took it. Mia finds it beside art supplies — Ethan had left it there while painting. Mrs. Green praises Mia for helping, not blaming. Ethan promises to be more careful.
Theme: It is important to stay calm, not blame others, and take responsibility for mistakes.

--- INFORMATIONAL PASSAGE EXAMPLE (Hard) ---
Title: Why Do Birds Build Nests?
Key facts:
- Nests are safe places where birds lay eggs and raise babies
- Different birds build different nests (robins: grass and mud cup; woodpeckers: holes in trees; some birds: on the ground)
- Birds may fly hundreds of times carrying sticks, leaves, feathers, string
- Some finish in days, others take weeks
- People can help by planting trees and leaving small twigs
- Lesson: patience and hard work are important

--- POETRY EXAMPLE (Hard) ---
Title: Morning Walk (3 stanzas)
Stanza 1: Morning sun shines, hills are green, birds sing from trees, happiest scene
Stanza 2: Flowers open wide, bees fly, gentle breeze in grass, clouds in sky
Stanza 3: Each new day brings chances big and small; if we look with careful eyes, beauty is for all
Rhyme scheme: lines 2 and 4 of each stanza rhyme (green/seen, fly/sky, small/all)
Theme: Nature can bring joy if we take time to notice it.
Mood: Peaceful, grateful, joyful
Imagery: Visual and tactile (gentle breeze, flowers opening, morning sun)

--- GRAMMAR/LANGUAGE EXAMPLES (Hard) ---
- Subject-verb agreement: "The children was/were excited" → were
- Pronoun usage: "My sister and me/I went to the library" → I
- Possessive pronoun: "The dog wagged it's/its tail" → its (no apostrophe)

======================================
WRITTEN RESPONSE EXAMPLES
======================================

PROMPT TYPE 1 (Fiction-based):
"Explain how [character] helped [other character]. Use at least TWO details from the story. Write 5–7 sentences."

HIGH-SCORING RESPONSE STRUCTURE:
1. Restate the question as a topic sentence
2. Give detail 1 from the passage with explanation
3. Give detail 2 from the passage with explanation
4. (Optional) Give detail 3 for extra support
5. Concluding sentence that ties back to the question

PROMPT TYPE 2 (Informational-based):
"Explain why [topic] is important to people and nature. Use at least TWO details. Write 5–7 sentences."

RACE STRATEGY (taught in Pennsylvania schools):
R – Restate the question
A – Answer it clearly
C – Cite at least two pieces of evidence from the passage
E – Explain how the evidence supports the answer

SCORING RUBRIC:
- Full credit: Answers question directly, uses 2+ text details, explains how details support the answer, clear beginning/middle/end, complete sentences, good spelling/punctuation
- Partial credit: Answers question but only one detail, or details without explanation
- Minimal credit: Vague answer, no text evidence

======================================
MCQ ANSWER PATTERN NOTES
======================================
- Correct answers are almost never "the teacher helped" or "it was easy"
- Distractor options often include irrelevant true facts from the passage
- "Best supports" questions need the MOST directly relevant detail
- "Opinion" questions: watch for superlatives ("most amazing", "best living thing")
- "Author's purpose" for informational is almost always "to inform"
- "Author's purpose" for fiction is "to entertain" or "to teach a lesson"
- Sequencing: read carefully — "which happened FIRST" vs "which happened LAST"

======================================
DIFFICULTY GUIDANCE
======================================
EASY (Set 1 level):
- Direct recall from passage
- Simple vocabulary questions
- Clear character traits
- Straightforward main idea

MEDIUM (Set 2 level):
- Requires inference
- "Which detail BEST supports" style
- Evidence-based (select TWO) questions
- Vocabulary from context

HARD (Set 3 level):
- Higher-order thinking
- Multi-step inference
- "Select TWO" evidence questions
- Theme vs. main idea distinction
- Grammar and editing questions
- Extended written response (3+ details)
"""


# =============================================================================
# GRADE 4 CONTENT
# Source: existing PDF_CONTEXT from llm/prompts.py
# Covers: Fiction, Informational, Vocabulary, Poetry, Craft & Structure, Writing
# =============================================================================

GRADE_4_CONTENT = """
GRADE 4 PSSA ELA — REFERENCE CONTENT
======================================

WHAT THE 4TH GRADE PSSA ELA INCLUDES
---------------------------------------

QUESTION TYPES:
1. Multiple Choice (MCQ) — 4 options (A/B/C/D), exactly one correct answer
2. Short Answer — student writes 1-2 sentences, a model answer is provided for self-check
3. Writing Response — student writes a paragraph, AI evaluates it

DOMAINS COVERED:
- Reading Comprehension (Fiction & Informational Text): Main idea, inference, text evidence, summarizing
- Vocabulary & Context Clues: Synonyms, antonyms, meaning from context, prefixes/suffixes
- Poetry: Mood, imagery, personification, author's word choice
- Craft & Structure: Author's purpose, text features, text structure, reliable sources
- Writing: Constructed response, extended response

DIFFICULTY LEVELS:
- Easy: Straightforward recall, clear correct answer, familiar vocabulary
- Medium: Requires inference or text evidence, slightly complex vocabulary
- Hard: Higher-order thinking, author's purpose, figurative language, extended analysis

PASSAGE STYLE:
- Fiction: Short story (4-6 sentences) with a clear character, problem, and resolution
- Informational: Short factual paragraph (3-5 sentences) about science/nature/social topics
- Poetry: 3-line haiku or short poem with imagery and a clear mood

FORMAT RULES:
- MCQ options must be concise (2-5 words each)
- Short answer questions must have a clear model answer
- Questions must directly relate to the passage provided
- Every session must include a fresh passage — never reuse the same story

SKILLS TESTED:
- Main idea and key details
- Character traits and motivations
- Theme and central message
- Inference from text evidence
- Vocabulary in context (prefixes, suffixes, synonyms, antonyms)
- Author's purpose and point of view
- Text structure (compare/contrast, cause/effect, sequence, problem/solution)
- Text features (headings, captions, diagrams)
- Figurative language (simile, metaphor, personification, idiom)
- Mood and imagery in poetry
- Reliable vs. unreliable sources
- Constructed writing responses with text evidence

WRITTEN RESPONSE FORMAT (Grade 4):
- Longer and more detailed than Grade 3
- Usually 1-2 paragraphs
- Must include specific text evidence (direct quotes or paraphrased)
- Expected to explain HOW evidence supports the answer (not just list it)
- May require comparing two passages

DIFFICULTY GUIDANCE:
EASY: Simple recall, clear answers stated in passage, grade 3-level vocabulary
MEDIUM: Inference required, text evidence needed, grade 4-level vocabulary, some figurative language
HARD: Higher-order thinking, author's purpose analysis, figurative language interpretation, cross-passage comparison

MCQ FORMAT:
- 4 options (A/B/C/D)
- Options are concise (2-5 words each)
- One clearly correct answer
- Distractors are plausible but clearly wrong on careful reading

SHORT ANSWER FORMAT:
- Question requires 1-2 sentence response
- Model answer provided for student self-check
- Tests deeper comprehension than MCQ
"""


# =============================================================================
# SEED FUNCTION
# =============================================================================

def _seed_grade(grade: str, content: str) -> None:
    """
    Write content for a single grade into Firestore pssa_content collection.
    Overwrites existing document if present (safe to re-run).
    """
    doc_id  = f"grade_{grade}"
    doc_ref = db.collection(COLLECTION).document(doc_id)

    doc_ref.set({
        "grade":      grade,
        "content":    content.strip(),
        "updated_at": datetime.now(timezone.utc),
    })

    print(f"[OK] Seeded pssa_content/{doc_id}  ({len(content.strip())} chars)")


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    print(f"Seeding Firestore collection: '{COLLECTION}'")
    print("-" * 50)

    _seed_grade("3", GRADE_3_CONTENT)
    _seed_grade("4", GRADE_4_CONTENT)

    print("-" * 50)
    print("Done. Verify in Firebase Console → Firestore → pssa_content")
    print("")
    print("To add future grades, add GRADE_X_CONTENT string above")
    print("and call _seed_grade('X', GRADE_X_CONTENT) here.")