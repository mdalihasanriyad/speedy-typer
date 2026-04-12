export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see",
  "other", "than", "then", "now", "look", "only", "come", "its", "over",
  "think", "also", "back", "after", "use", "two", "how", "our", "work",
  "first", "well", "way", "even", "new", "want", "because", "any", "these",
  "give", "day", "most", "us", "great", "between", "need", "large", "under",
  "never", "each", "right", "begin", "few", "while", "next", "same", "another",
  "know", "big", "help", "through", "much", "before", "line", "too", "mean",
  "old", "move", "right", "boy", "did", "world", "long", "school", "still",
  "last", "own", "point", "end", "become", "head", "show", "every", "group",
  "always", "music", "those", "both", "mark", "often", "letter", "until",
  "mile", "river", "car", "feet", "care", "second", "enough", "plain",
  "girl", "usual", "young", "ready", "above", "leave", "turn", "again",
  "draw", "door", "open", "close", "real", "life", "run", "during", "play",
  "city", "tree", "cross", "farm", "hard", "start", "might", "story",
  "far", "sea", "late", "home", "may", "should", "paper", "earth", "eye",
  "face", "keep", "food", "week", "body", "sit", "house", "hand", "high",
  "small", "number", "off", "place", "such", "here", "why", "ask", "men",
  "read", "land", "different", "many", "set", "kind", "page", "answer",
  "found", "study", "learn", "plant", "cover", "sun", "four", "thought",
  "let", "keep", "night", "near", "put", "head", "light", "name", "saw",
  "white", "left", "along", "children", "problem", "sure", "change",
  "sentence", "picture", "air", "water", "mother", "area", "money",
  "side", "test", "system", "press", "together", "stand", "top", "whole",
  "class", "piece", "surface", "deep", "island", "product", "country",
  "center", "building", "figure", "field", "power", "south", "north"
];

const punctuationMarks = [".", ",", "!", "?", ";", ":", "'", '"', "-"];

function addPunctuation(word: string): string {
  const r = Math.random();
  if (r < 0.15) return word + punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
  if (r < 0.05) return word.charAt(0).toUpperCase() + word.slice(1);
  return word;
}

function addNumbers(words: string[]): string[] {
  const result = [...words];
  const count = Math.max(1, Math.floor(result.length * 0.1));
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * result.length);
    result[idx] = String(Math.floor(Math.random() * 10000));
  }
  return result;
}

export interface GenerateOptions {
  punctuation?: boolean;
  numbers?: boolean;
}

export function generateWords(count: number, options?: GenerateOptions): string[] {
  let words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
  }
  if (options?.punctuation) {
    words = words.map(addPunctuation);
  }
  if (options?.numbers) {
    words = addNumbers(words);
  }
  return words;
}
