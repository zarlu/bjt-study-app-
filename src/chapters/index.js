// Chapter registry. To add a new chapter:
//   1. Drop chapterN.json into this folder
//   2. Import it below
//   3. Add it to the CHAPTERS array (in the order you want it to appear)
// That's it — the rest of the app picks it up automatically.

import chapter2 from './chapter2.json';
import chapter3 from './chapter3.json';
   // ...
export const CHAPTERS = [chapter2, chapter3, chapter4];

// Convenience helpers used by App.jsx
export const ALL_QUESTIONS = CHAPTERS.flatMap(ch =>
  ch.questions.map(q => ({ ...q, chapterId: ch.id, chapterNumber: ch.number }))
);

export function getChapter(id) {
  return CHAPTERS.find(ch => ch.id === id);
}

export function getQuestionsByScope(scope) {
  // scope is either a chapter id ('ch2', 'ch4') or 'all'
  if (scope === 'all') return ALL_QUESTIONS;
  const chapter = getChapter(scope);
  if (!chapter) return [];
  return chapter.questions.map(q => ({ ...q, chapterId: chapter.id, chapterNumber: chapter.number }));
}
