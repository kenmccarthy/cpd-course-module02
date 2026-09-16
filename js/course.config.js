/* ==========================================================================
   Course config — single source of truth for per-course/per-institution
   identity. Edit this file (or run `python3 scripts/init_course.py`) when
   reusing this repo as a template for a new course.

   Consumed by:
     - js/core.js         (storeKey, finalQuiz, masteryScore, activities)
     - imsmanifest.xml     (kept in sync by scripts/init_course.py, not read
                            at runtime — SCORM manifests are static XML)
     - scripts/build_scorm.py (courseSlug -> dist/<slug>-scorm12.zip)

   Must load BEFORE js/core.js in index.html.
   ========================================================================== */
window.CourseConfig = {
  courseTitle: "Teaching Online",
  courseSlug: "teaching-online",
  institution: "South East Technological University (SETU)",

  // localStorage key for learner progress/state. Change this if you reuse
  // this repo for a new course served from the same origin/path as an old
  // one, so learners don't inherit stale progress.
  storeKey: "teaching-online-v1",

  // Lifelong Learning at SETU annual colour year. Drives the accent trio,
  // gradients and hero panels. One of: "2026/27", "2027/28", "2028/29".
  programmeYear: "2026/27",

  // Shown under the course title on the overview page.
  courseSubtitle: "Bringing your expertise to the virtual classroom",

  // Level this course is pitched at. Free text; shown in exported notes.
  pitchLevel: "NFQ Level 8",

  // Lifelong Learning at SETU campaign tagline. Set showTagline: false to hide.
  tagline: "LEARN MORE. GO FURTHER.",
  showTagline: true,

  // Final-quiz question ids, in order. Empty = reflection-led course: SCORM
  // reports "completed" rather than "passed"/"failed", no score is sent, and
  // <adlcp:masteryscore> is omitted from imsmanifest.xml.
  // To add a graded quiz: list the ids here, mark those knowledge checks with
  // data-final in index.html, and restore <adlcp:masteryscore>.
  finalQuiz: [],

  // Final-quiz pass mark, as a percentage (0-100). Only used when finalQuiz is
  // non-empty. Mirrors <adlcp:masteryscore> in imsmanifest.xml — keep in sync.
  masteryScore: 75,

  // Interactive activities the results dashboard counts, by the id each one
  // emits on interaction.complete. Keep in step with the widgets in index.html.
  activities: [
    "coi-tabs",          // the three presences (Section 2)
    "levels-tabs",       // online teaching at Levels 7/8/9 (Section 2)
    "tools-tabs",        // five engagement tools (Section 3)
    "tools-match",       // match the tool to the situation (Section 3)
    "online-session-scenario",  // choose your approach (Section 4)
    "preflight-checklist"       // pre-flight checklist (Section 5)
  ]
};
