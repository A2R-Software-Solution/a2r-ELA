"""
Pennsylvania PSSA Writing Domain Scoring Rubric
Based on:
- Pennsylvania Writing Assessment Domain Scoring Guide
- PA Core Standards ELA PreK-5 (March 1, 2014)
- PA Core Standards ELA 6-12 (March 1, 2014)
- PSSA Text-Dependent Analysis Scoring Guidelines

Domains (each scored 1-4):
    1. Focus
    2. Content
    3. Organization
    4. Style
    5. Conventions

Total raw score: 4-20
Converted score: multiply by 5 → 20-100
"""

# ---------------------------------------------------------------------------
# GRADE BAND MAPPING
# Maps individual grade → internal band key
# ---------------------------------------------------------------------------
GRADE_TO_BAND = {
    "prek": "prek_2",
    "k":    "prek_2",
    "1":    "prek_2",
    "2":    "prek_2",
    "3":    "3_5",
    "4":    "3_5",
    "5":    "3_5",
    "6":    "6_8",
    "7":    "6_8",
    "8":    "6_8",
    "9":    "9_12",
    "10":   "9_12",
    "11":   "9_12",
    "12":   "9_12",
}

# ---------------------------------------------------------------------------
# DOMAIN DEFINITIONS
# Core PSSA Writing Domain descriptions (same across all grades)
# ---------------------------------------------------------------------------
PSSA_DOMAINS = {
    "focus": {
        "name": "Focus",
        "description": (
            "The single controlling point made with an awareness of task "
            "(mode) about a specific topic."
        ),
        "max_raw": 4,
    },
    "content": {
        "name": "Content",
        "description": (
            "The presence of ideas developed through facts, examples, "
            "anecdotes, details, opinions, statistics, reasons and/or "
            "explanations."
        ),
        "max_raw": 4,
    },
    "organization": {
        "name": "Organization",
        "description": (
            "The order developed and sustained within and across paragraphs "
            "using transitional devices including introduction and conclusion."
        ),
        "max_raw": 4,
    },
    "style": {
        "name": "Style",
        "description": (
            "The choice, use and arrangement of words and sentence structures "
            "that create tone and voice."
        ),
        "max_raw": 4,
    },
    "conventions": {
        "name": "Conventions",
        "description": (
            "The use of grammar, mechanics, spelling, usage and sentence "
            "formation."
        ),
        "max_raw": 4,
    },
}

# ---------------------------------------------------------------------------
# SCORE LEVEL DESCRIPTORS
# What each score (1-4) means per domain — from the official scoring guide
# ---------------------------------------------------------------------------
SCORE_DESCRIPTORS = {
    "focus": {
        4: "Sharp, distinct controlling point made about a single topic with evident awareness of task (mode).",
        3: "Apparent point made about a single topic with sufficient awareness of task (mode).",
        2: "No apparent point but evidence of a specific topic.",
        1: "Minimal evidence of a topic.",
    },
    "content": {
        4: "Substantial, specific and/or illustrative content demonstrating strong development and sophisticated ideas.",
        3: "Sufficiently developed content with adequate elaboration or explanation.",
        2: "Limited content with inadequate elaboration or explanation.",
        1: "Superficial and/or minimal content.",
    },
    "organization": {
        4: "Sophisticated arrangement of content with evident and/or subtle transitions.",
        3: "Functional arrangement of content that sustains a logical order with some evidence of transitions.",
        2: "Confused or inconsistent arrangement of content with or without attempts at transition.",
        1: "Minimal control of content arrangement.",
    },
    "style": {
        4: "Precise, illustrative use of a variety of words and sentence structures to create consistent writer's voice and tone appropriate to audience.",
        3: "Generic use of a variety of words and sentence structures that may or may not create writer's voice and tone appropriate to audience.",
        2: "Limited word choice and control of sentence structures that inhibit voice and tone.",
        1: "Minimal variety in word choice and minimal control of sentence structures.",
    },
    "conventions": {
        4: "Evident control of grammar, mechanics, spelling, usage and sentence formation.",
        3: "Sufficient control of grammar, mechanics, spelling, usage and sentence formation.",
        2: "Limited control of grammar, mechanics, spelling, usage and sentence formation.",
        1: "Minimal control of grammar, mechanics, spelling, usage and sentence formation.",
    },
}

# ---------------------------------------------------------------------------
# GRADE BAND EXPECTATIONS
# Grade-specific writing expectations derived from PA Core Standards
# These are injected into the LLM prompt to calibrate evaluation per grade
# ---------------------------------------------------------------------------
GRADE_BAND_EXPECTATIONS = {

    # -----------------------------------------------------------------------
    "prek_2": {
        "band_label": "PreK–2",
        "grades": ["PreK", "K", "1", "2"],
        "overview": (
            "Students at this level are emergent writers developing basic "
            "print concepts, phonics, and early composition skills. "
            "Evaluate with strong developmental sensitivity."
        ),
        "focus": (
            "Student draws/dictates/writes about one specific topic. "
            "PreK/K: accepts drawing + dictation as evidence of focus. "
            "Grade 1-2: expects a stated topic or simple opinion."
        ),
        "content": (
            "Grade K-1: two or more facts or simple details about topic. "
            "Grade 2: facts and/or definitions that relate to the topic. "
            "Accept simple sentences and basic ideas as adequate development."
        ),
        "organization": (
            "Grade K-1: simple sequencing with a sense of closure. "
            "Grade 2: grouped information with a concluding statement. "
            "Do not penalize for lack of formal intro/conclusion at PreK-1."
        ),
        "style": (
            "Grade K-1: variety of words and phrases for effect. "
            "Grade 2: words and phrases chosen to appeal to audience. "
            "Accept simple but appropriate word choice."
        ),
        "conventions": (
            "Grade K: capitalize first word and pronoun I, basic end punctuation, "
            "phonetic spelling accepted. "
            "Grade 1: capitalize dates and names, commas in series, "
            "common spelling patterns. "
            "Grade 2: capitalize proper nouns, apostrophes, consult reference materials."
        ),
        "scoring_guidance": (
            "Be generous with scores at this band. A score of 3 is achievable "
            "with clear topic, simple supporting details, and basic sentence control. "
            "Score of 4 requires evident awareness of audience and task for the grade level."
        ),
    },

    # -----------------------------------------------------------------------
    "3_5": {
        "band_label": "Grades 3–5",
        "grades": ["3", "4", "5"],
        "overview": (
            "Students develop structured paragraph writing with clear topic "
            "sentences, supporting details, and basic transitions. "
            "PSSA writing assessment formally begins at Grade 3."
        ),
        "focus": (
            "Grade 3: introduce topic and state a clear opinion or controlling idea. "
            "Grade 4-5: sharp, distinct focus identifying topic and task. "
            "Expect a clear thesis or controlling idea in informative and opinion pieces."
        ),
        "content": (
            "Grade 3: support with reasons, facts, definitions, details and illustrations. "
            "Grade 4: facts, definitions, concrete details, quotations, relevant examples. "
            "Grade 5: cite textual evidence accurately; draw from credible sources. "
            "Content should directly support the stated focus."
        ),
        "organization": (
            "Grade 3: logical organizational structure with reasons linked in order "
            "and a concluding statement or section. "
            "Grade 4-5: related ideas grouped in paragraphs, linking words and phrases, "
            "variety of transitional words, clear conclusion that follows from content."
        ),
        "style": (
            "Grade 3: variety of words and sentence types to appeal to audience. "
            "Grade 4: precise language and domain-specific vocabulary. "
            "Grade 5: sentences of varying length; expand, combine, and reduce sentences "
            "for meaning and style; awareness of formal register."
        ),
        "conventions": (
            "Grade 3-5: grade-appropriate command of standard English grammar, usage, "
            "capitalization, punctuation, and spelling. "
            "Errors should be infrequent and should not interfere with meaning at score 3-4. "
            "Multiple errors that interfere with meaning = score 1-2."
        ),
        "scoring_guidance": (
            "A score of 3 expects clear focus, adequate supporting details, "
            "logical organization with transitions, and sufficient conventions control. "
            "A score of 4 requires sophisticated ideas, precise vocabulary, "
            "and evident control of all conventions."
        ),
    },

    # -----------------------------------------------------------------------
    "6_8": {
        "band_label": "Grades 6–8",
        "grades": ["6", "7", "8"],
        "overview": (
            "Students write multi-paragraph essays with clear arguments, "
            "textual evidence, and formal style. Writing shows increasing "
            "sophistication in analysis and use of evidence."
        ),
        "focus": (
            "Grade 6: introduce and state an opinion with clear topic awareness. "
            "Grade 7-8: introduce a precise claim; distinguish claim from alternate claims. "
            "Expect a clear, defensible thesis with awareness of audience and purpose."
        ),
        "content": (
            "Grade 6: clear reasons and relevant evidence from credible sources. "
            "Grade 7: acknowledge alternate claims; logical reasoning with accurate evidence. "
            "Grade 8: acknowledge and distinguish claim from counterclaims; "
            "well-chosen facts, concrete details, quotations. "
            "Cite textual evidence that most strongly supports the analysis."
        ),
        "organization": (
            "Grade 6: claim organized with clear reasons; concluding statement. "
            "Grade 7: cohesion through words/phrases/clauses; conclusion supports argument. "
            "Grade 8: relationships among claims, counterclaims, reasons, and evidence "
            "clearly organized; varied transitions; strong conclusion."
        ),
        "style": (
            "Grade 6-8: precise language and domain-specific vocabulary; "
            "sentences of varying length and complexity; "
            "consistent formal style; tone appropriate to audience. "
            "Grade 8: create tone and voice through precise language; "
            "active and passive voice used for specific effects."
        ),
        "conventions": (
            "Grade 6-8: strong command of standard English grammar, usage, "
            "capitalization, punctuation, and spelling. "
            "Errors must be rare and must not interfere with meaning at score 3-4. "
            "Essay should demonstrate control of complex sentence structures."
        ),
        "scoring_guidance": (
            "A score of 3 expects clear claim, sufficient textual evidence, "
            "appropriate transitions, formal style, and adequate conventions control. "
            "A score of 4 requires sophisticated analysis, precise vocabulary, "
            "subtle transitions, and evident mastery of conventions."
        ),
    },

    # -----------------------------------------------------------------------
    "9_12": {
        "band_label": "Grades 9–12",
        "grades": ["9", "10", "11", "12"],
        "overview": (
            "Students produce college- and career-ready writing demonstrating "
            "in-depth analysis, sophisticated argumentation, precise language, "
            "and mastery of conventions. Writing engages with complex ideas."
        ),
        "focus": (
            "Grade 9-10: sharp, distinct focus; introduce the precise claim; "
            "strong awareness of topic, task, and audience. "
            "Grade 11-12: introduce a precise, knowledgeable claim; "
            "demonstrate command of the subject; writing reflects independent thinking."
        ),
        "content": (
            "Grade 9-10: distinguish claim from alternate claims; develop claims fairly "
            "with relevant evidence; anticipate audience knowledge and concerns. "
            "Grade 11-12: develop claims and counterclaims thoroughly; "
            "supply most relevant evidence; acknowledge strengths and limitations; "
            "cite strong and thorough textual evidence including implicit meanings."
        ),
        "organization": (
            "Grade 9-10: clear relationships among claims, counterclaims, reasons, "
            "evidence; varied transitions; strong concluding statement. "
            "Grade 11-12: logically sequenced claims and counterclaims; "
            "varied syntax and transitions; conclusion supports argument fully. "
            "Complex organizational structure expected."
        ),
        "style": (
            "Grade 9-10: precise language and domain-specific vocabulary; "
            "formal style and objective tone; attend to norms of discipline. "
            "Grade 11-12: techniques such as metaphor, simile, and analogy; "
            "parallel structure; various phrase and clause types; "
            "sophisticated voice consistent throughout."
        ),
        "conventions": (
            "Grade 9-12: mastery of standard English grammar, usage, "
            "capitalization, punctuation, and spelling. "
            "At score 4: few if any errors present and none interfere with meaning. "
            "At score 3: some errors present but seldom interfere with meaning. "
            "Complex sentence structures used correctly and purposefully."
        ),
        "scoring_guidance": (
            "A score of 3 expects clear precise claim, sufficient analysis with "
            "textual evidence, appropriate organization, formal style, and "
            "sufficient conventions control. "
            "A score of 4 requires in-depth analysis, sophisticated vocabulary "
            "and style, subtle and varied transitions, and mastery of all conventions. "
            "Hold these students to college-readiness standards."
        ),
    },
}

# ---------------------------------------------------------------------------
# NON-SCORABLE / OFF-PROMPT DEFINITIONS
# From the official PSSA scoring guide
# ---------------------------------------------------------------------------
NON_SCORABLE = {
    "score": 0,
    "conditions": [
        "Is illegible — includes so many indecipherable words that no sense can be made",
        "Is incoherent — words are legible but syntax is so garbled response makes no sense",
        "Is insufficient — does not include enough to assess domains adequately",
        "Is a blank paper",
    ],
}

OFF_PROMPT = {
    "description": "Is readable but did not respond to the prompt.",
}

# ---------------------------------------------------------------------------
# CONVERSION HELPERS
# ---------------------------------------------------------------------------

def get_grade_band(grade: str) -> str:
    """
    Map a grade string to its internal band key.

    Args:
        grade: Grade string e.g. 'prek', 'k', '3', '10'

    Returns:
        Band key e.g. 'prek_2', '3_5', '6_8', '9_12'

    Raises:
        ValueError if grade is not recognized
    """
    normalized = grade.lower().strip()
    if normalized not in GRADE_TO_BAND:
        raise ValueError(
            f"Unrecognized grade '{grade}'. "
            f"Valid grades: {list(GRADE_TO_BAND.keys())}"
        )
    return GRADE_TO_BAND[normalized]


def get_band_expectations(grade: str) -> dict:
    """
    Get grade-band expectations for a given grade.

    Args:
        grade: Grade string e.g. '5', '8', 'k'

    Returns:
        Grade band expectations dictionary
    """
    band_key = get_grade_band(grade)
    return GRADE_BAND_EXPECTATIONS[band_key]


def convert_raw_to_100(raw_domain_scores: dict) -> dict:
    """
    Convert raw PSSA domain scores (1-4 each) to 100-point scale.

    Args:
        raw_domain_scores: dict with keys focus/content/organization/style/conventions
                           values are integers 1-4

    Returns:
        dict with:
            raw_scores       — original 1-4 per domain
            converted_scores — 0-20 per domain (raw * 5)
            pssa_total       — sum of raw scores (max 20)
            converted_score  — total on 100-point scale (pssa_total * 5)
    """
    converted = {}
    pssa_total = 0

    for domain, raw in raw_domain_scores.items():
        # Clamp to valid range
        raw_clamped = max(1, min(4, int(raw)))
        converted[domain] = raw_clamped * 5  # converts 1-4 → 5-20
        pssa_total += raw_clamped

    return {
        "raw_scores": {d: max(1, min(4, int(v))) for d, v in raw_domain_scores.items()},
        "converted_scores": converted,
        "pssa_total": pssa_total,           # out of 20
        "converted_score": pssa_total * 5,  # out of 100
    }


def get_supported_grades() -> list:
    """Return all supported grade strings in display order."""
    return ["prek", "k", "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "10", "11", "12"]


def get_domain_names() -> list:
    """Return PSSA domain keys in order."""
    return ["focus", "content", "organization", "style", "conventions"]