// Chapter & Track registry.
//
// TRACKS are courses. Each track owns a list of chapter JSON objects.
// To add a chapter: drop chapterX.json in this folder, import below, append to
// the right track's `chapters` array. To add a new course: import its chapters
// and add a new TRACKS entry.
//
// CHAPTERS and ALL_QUESTIONS are derived — nothing else needs to change.

import chaptermidterm from './chaptermidterm.json';
import chapter1 from './chapter1.json';
import chapter2 from './chapter2.json';
import chapter3 from './chapter3.json';
import chapter4 from './chapter4.json';
import chapter8 from './chapter8.json';
import dsa from './dsa.json';

// ─── TRACKS ─────────────────────────────────────────────────────────────────

export const TRACKS = [
  {
    id: 'electronics',
    label: 'Electronics Devices',
    subtitle: 'Midterm Prep',
    icon: '⚡',
    accentColor: '#6c9fff',
    chapters: [chaptermidterm, chapter1, chapter2, chapter3, chapter4, chapter8],
  },
  {
    id: 'dsa',
    label: 'Data Structures & Algorithms',
    subtitle: 'Final Exam Prep',
    icon: '🌳',
    accentColor: '#a78bfa',
    chapters: [dsa],
  },
];

// ─── DERIVED EXPORTS ────────────────────────────────────────────────────────

export const CHAPTERS = TRACKS.flatMap(t => t.chapters);

export const ALL_QUESTIONS = CHAPTERS.flatMap(ch =>
  ch.questions.map(q => ({ ...q, chapterId: ch.id, chapterNumber: ch.number }))
);

// ─── LOOKUPS ────────────────────────────────────────────────────────────────

export function getTrack(id) {
  return TRACKS.find(t => t.id === id);
}

export function getTrackForChapter(chapterId) {
  return TRACKS.find(t => t.chapters.some(ch => ch.id === chapterId));
}

export function getChapter(id) {
  return CHAPTERS.find(ch => ch.id === id);
}

function augment(questions, chapter) {
  return questions.map(q => ({ ...q, chapterId: chapter.id, chapterNumber: chapter.number }));
}

// scope: chapter id, OR `all-<trackId>` for whole-track cumulative.
// opts.section: optional section id to filter by (single-chapter scope only).
// opts.category: optional category to filter by.
export function getQuestionsByScope(scope, opts = {}) {
  let pool;
  if (typeof scope === 'string' && scope.startsWith('all-')) {
    const track = getTrack(scope.slice(4));
    if (!track) return [];
    pool = track.chapters.flatMap(ch => augment(ch.questions, ch));
  } else {
    const chapter = getChapter(scope);
    if (!chapter) return [];
    pool = augment(chapter.questions, chapter);
  }
  if (opts.section && opts.section !== 'all') {
    pool = pool.filter(q => q.section === opts.section);
  }
  if (opts.category && opts.category !== 'all') {
    pool = pool.filter(q => q.category === opts.category);
  }
  return pool;
}