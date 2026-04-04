export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Life is what happens when you are busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Strive not to be a success but rather to be of value.", author: "Albert Einstein" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Eighty percent of success is showing up.", author: "Woody Allen" },
  { text: "Your time is limited so do not waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Winning is not everything but wanting to win is.", author: "Vince Lombardi" },
  { text: "I am not a product of my circumstances. I am a product of my decisions.", author: "Stephen Covey" },
  { text: "Every child is an artist. The problem is how to remain an artist once he grows up.", author: "Pablo Picasso" },
  { text: "You can never cross the ocean until you have the courage to lose sight of the shore.", author: "Christopher Columbus" },
  { text: "There is only one way to avoid criticism. Do nothing say nothing and be nothing.", author: "Aristotle" },
  { text: "Ask and it will be given to you. Search and you will find. Knock and the door will be opened for you.", author: "Jesus" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Go confidently in the direction of your dreams. Live the life you have imagined.", author: "Henry David Thoreau" },
  { text: "When I let go of what I am I become what I might be.", author: "Lao Tzu" },
  { text: "Life is really simple but we insist on making it complicated.", author: "Confucius" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "If you hear a voice within you say you cannot paint then by all means paint and that voice will be silenced.", author: "Vincent Van Gogh" },
  { text: "The greatest glory in living lies not in never falling but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
];

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
