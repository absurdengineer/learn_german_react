// Grammar learning content for DeutschMeister
// Beginner-friendly explanations for A1 level German learners

export interface GrammarLesson {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order: number;
  description: string;
  explanation: string;
  examples: {
    german: string;
    english: string;
    breakdown?: string;
  }[];
  keyPoints: string[];
  commonMistakes: {
    wrong: string;
    correct: string;
    explanation: string;
  }[];
  flashcards: {
    front: string;
    back: string;
    example?: string;
  }[];
}

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'articles-basics',
    title: 'German Articles (der, die, das)',
    category: 'Articles',
    difficulty: 'beginner',
    order: 1,
    description: 'Learn the three German articles and how to use them',
    explanation: `German has three articles (like "the" in English): der (masculine), die (feminine), and das (neuter). Every German noun has a gender, and you need to learn the article with the noun. Think of them as a package deal!`,
    examples: [
      {
        german: 'der Mann',
        english: 'the man',
        breakdown: 'der = masculine article, Mann = man'
      },
      {
        german: 'die Frau',
        english: 'the woman',
        breakdown: 'die = feminine article, Frau = woman'
      },
      {
        german: 'das Kind',
        english: 'the child',
        breakdown: 'das = neuter article, Kind = child'
      }
    ],
    keyPoints: [
      'German nouns have three genders: masculine (der), feminine (die), neuter (das)',
      'The gender is not always logical - memorize the article with the noun',
      'Plural nouns always use "die" regardless of their singular gender',
      'Indefinite articles: ein (masculine/neuter), eine (feminine)'
    ],
    commonMistakes: [
      {
        wrong: 'die Mann',
        correct: 'der Mann',
        explanation: 'Mann is masculine, so it uses "der"'
      },
      {
        wrong: 'das Frau',
        correct: 'die Frau',
        explanation: 'Frau is feminine, so it uses "die"'
      }
    ],
    flashcards: [
      {
        front: 'What are the three German articles?',
        back: 'der (masculine), die (feminine), das (neuter)'
      },
      {
        front: 'der Mann',
        back: 'the man',
        example: 'Der Mann ist groß. (The man is tall.)'
      },
      {
        front: 'die Frau',
        back: 'the woman',
        example: 'Die Frau ist nett. (The woman is nice.)'
      },
      {
        front: 'das Kind',
        back: 'the child',
        example: 'Das Kind spielt. (The child plays.)'
      }
    ]
  },
  {
    id: 'cases-nominative',
    title: 'The Nominative Case - Who Does What?',
    category: 'Cases',
    difficulty: 'beginner',
    order: 2,
    description: 'Learn the nominative case - the subject of the sentence',
    explanation: `The nominative case is the "who" or "what" that does the action in a sentence. It's the subject! In English, we don't change articles much, but in German, this is super important. Think: "WHO is doing something?"`,
    examples: [
      {
        german: 'Der Hund bellt.',
        english: 'The dog barks.',
        breakdown: 'Der Hund = subject (who barks?), bellt = verb'
      },
      {
        german: 'Die Katze schläft.',
        english: 'The cat sleeps.',
        breakdown: 'Die Katze = subject (who sleeps?), schläft = verb'
      },
      {
        german: 'Das Baby weint.',
        english: 'The baby cries.',
        breakdown: 'Das Baby = subject (who cries?), weint = verb'
      }
    ],
    keyPoints: [
      'Nominative = the subject of the sentence (who/what does the action)',
      'Articles stay the same: der, die, das',
      'Ask "who?" or "what?" to find the nominative',
      'This is the basic form you learn nouns in'
    ],
    commonMistakes: [
      {
        wrong: 'Den Mann ist hier.',
        correct: 'Der Mann ist hier.',
        explanation: 'Subject uses nominative "der", not accusative "den"'
      }
    ],
    flashcards: [
      {
        front: 'What case is the subject of a sentence?',
        back: 'Nominative case'
      },
      {
        front: 'How do you find the nominative in a sentence?',
        back: 'Ask "who?" or "what?" does the action'
      },
      {
        front: 'Der Mann liest.',
        back: 'The man reads. (Der Mann = nominative subject)'
      }
    ]
  },
  {
    id: 'cases-accusative',
    title: 'The Accusative Case - Who Gets What?',
    category: 'Cases',
    difficulty: 'beginner',
    order: 3,
    description: 'Learn the accusative case - the direct object',
    explanation: `The accusative case is for the direct object - the "who" or "what" that receives the action. Think: "What is being done TO someone/something?" Only the masculine article changes: der becomes den!`,
    examples: [
      {
        german: 'Ich sehe den Mann.',
        english: 'I see the man.',
        breakdown: 'Ich = subject, sehe = verb, den Mann = direct object (accusative)'
      },
      {
        german: 'Er kauft die Blume.',
        english: 'He buys the flower.',
        breakdown: 'Er = subject, kauft = verb, die Blume = direct object (stays "die")'
      },
      {
        german: 'Wir haben das Auto.',
        english: 'We have the car.',
        breakdown: 'Wir = subject, haben = verb, das Auto = direct object (stays "das")'
      }
    ],
    keyPoints: [
      'Accusative = direct object (receives the action)',
      'Only masculine changes: der → den',
      'Feminine and neuter stay the same: die → die, das → das',
      'Ask "who?" or "what?" after the verb to find the accusative object'
    ],
    commonMistakes: [
      {
        wrong: 'Ich sehe der Mann.',
        correct: 'Ich sehe den Mann.',
        explanation: 'Masculine direct object needs accusative "den"'
      },
      {
        wrong: 'Er kauft den Blume.',
        correct: 'Er kauft die Blume.',
        explanation: 'Feminine nouns stay "die" in accusative'
      }
    ],
    flashcards: [
      {
        front: 'What case is the direct object?',
        back: 'Accusative case'
      },
      {
        front: 'How does "der" change in accusative?',
        back: 'der → den'
      },
      {
        front: 'Ich kaufe ___ Apfel. (der Apfel)',
        back: 'den Apfel',
        example: 'Masculine noun in accusative'
      }
    ]
  },
  {
    id: 'cases-dative',
    title: 'The Dative Case - To Whom?',
    category: 'Cases',
    difficulty: 'intermediate',
    order: 4,
    description: 'Learn the dative case - the indirect object',
    explanation: `The dative case is for the indirect object - usually answers "to whom?" or "for whom?". Think of it as the person who receives something indirectly. Many German verbs use dative too!`,
    examples: [
      {
        german: 'Ich gebe dem Mann das Buch.',
        english: 'I give the man the book.',
        breakdown: 'dem Mann = to the man (dative), das Buch = the book (accusative)'
      },
      {
        german: 'Er hilft der Frau.',
        english: 'He helps the woman.',
        breakdown: 'der Frau = to the woman (dative) - helfen takes dative!'
      },
      {
        german: 'Das gehört dem Kind.',
        english: 'That belongs to the child.',
        breakdown: 'dem Kind = to the child (dative) - gehören takes dative!'
      }
    ],
    keyPoints: [
      'Dative = indirect object (to whom? for whom?)',
      'Changes: der → dem, die → der, das → dem',
      'Some verbs always take dative: helfen, gehören, danken, etc.',
      'Prepositions like "mit", "von", "zu" always use dative'
    ],
    commonMistakes: [
      {
        wrong: 'Ich helfe die Frau.',
        correct: 'Ich helfe der Frau.',
        explanation: 'helfen takes dative, not accusative'
      }
    ],
    flashcards: [
      {
        front: 'What case answers "to whom?" or "for whom?"',
        back: 'Dative case'
      },
      {
        front: 'How does "der" change in dative?',
        back: 'der → dem'
      },
      {
        front: 'Ich helfe ___ Mann. (der Mann)',
        back: 'dem Mann',
        example: 'helfen takes dative'
      }
    ]
  },
  {
    id: 'verbs-present',
    title: 'Present Tense - What Happens Now',
    category: 'Verbs',
    difficulty: 'beginner',
    order: 5,
    description: 'Learn how to conjugate regular verbs in present tense',
    explanation: `German verbs change their ending depending on who does the action. Start with the infinitive (like "spielen" = to play), remove "-en", and add the right ending for each person.`,
    examples: [
      {
        german: 'ich spiele',
        english: 'I play',
        breakdown: 'spiel + e = I play'
      },
      {
        german: 'du spielst',
        english: 'you play',
        breakdown: 'spiel + st = you play'
      },
      {
        german: 'er/sie/es spielt',
        english: 'he/she/it plays',
        breakdown: 'spiel + t = he/she/it plays'
      }
    ],
    keyPoints: [
      'Remove -en from infinitive to get the stem',
      'Add endings: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en',
      'Regular verbs follow this pattern consistently',
      'Some verbs are irregular and need to be memorized'
    ],
    commonMistakes: [
      {
        wrong: 'ich spielen',
        correct: 'ich spiele',
        explanation: 'Need to conjugate the verb, not use infinitive'
      }
    ],
    flashcards: [
      {
        front: 'What ending for "ich" in present tense?',
        back: '-e (ich spiele)'
      },
      {
        front: 'What ending for "du" in present tense?',
        back: '-st (du spielst)'
      },
      {
        front: 'ich _____ (spielen)',
        back: 'spiele'
      }
    ]
  },
  {
    id: 'pronouns-personal',
    title: 'Personal Pronouns - Who Are We Talking About?',
    category: 'Pronouns',
    difficulty: 'beginner',
    order: 6,
    description: 'Learn the German personal pronouns',
    explanation: `Personal pronouns replace names and nouns. Just like English has "I, you, he, she, it", German has similar words. But German pronouns change depending on whether they're the subject or object!`,
    examples: [
      {
        german: 'Ich sehe dich.',
        english: 'I see you.',
        breakdown: 'ich = I (subject), dich = you (object)'
      },
      {
        german: 'Er gibt mir das Buch.',
        english: 'He gives me the book.',
        breakdown: 'er = he (subject), mir = to me (dative)'
      },
      {
        german: 'Wir kennen sie.',
        english: 'We know them/her.',
        breakdown: 'wir = we (subject), sie = them/her (object)'
      }
    ],
    keyPoints: [
      'Nominative: ich, du, er, sie, es, wir, ihr, sie/Sie',
      'Accusative: mich, dich, ihn, sie, es, uns, euch, sie/Sie',
      'Dative: mir, dir, ihm, ihr, ihm, uns, euch, ihnen/Ihnen',
      'Sie (capital S) = formal "you"'
    ],
    commonMistakes: [
      {
        wrong: 'Ich sehe du.',
        correct: 'Ich sehe dich.',
        explanation: 'Object pronoun needs accusative form'
      }
    ],
    flashcards: [
      {
        front: 'German for "I"',
        back: 'ich'
      },
      {
        front: 'German for "you" (informal)',
        back: 'du'
      },
      {
        front: 'Ich sehe ___. (you - informal)',
        back: 'dich'
      }
    ]
  },
  {
    id: 'w-questions',
    title: 'W-Questions - Asking Questions',
    category: 'W-Fragen',
    difficulty: 'beginner',
    order: 7,
    description: 'Learn how to ask questions in German',
    explanation: `German question words start with "W" just like English! These help you get information. The verb comes right after the question word in German.`,
    examples: [
      {
        german: 'Wie heißt du?',
        english: 'What is your name?',
        breakdown: 'Wie = how, heißt = are called, du = you'
      },
      {
        german: 'Wo wohnst du?',
        english: 'Where do you live?',
        breakdown: 'Wo = where, wohnst = live, du = you'
      },
      {
        german: 'Was machst du?',
        english: 'What are you doing?',
        breakdown: 'Was = what, machst = do/make, du = you'
      }
    ],
    keyPoints: [
      'Wie = how, Was = what, Wo = where, Wer = who, Wann = when, Warum = why',
      'Verb comes second in the sentence',
      'Question word + verb + subject',
      'Woher = where from, Wohin = where to'
    ],
    commonMistakes: [
      {
        wrong: 'Wie du heißt?',
        correct: 'Wie heißt du?',
        explanation: 'Verb must come before subject in questions'
      }
    ],
    flashcards: [
      {
        front: 'How to ask "What?"',
        back: 'Was?'
      },
      {
        front: 'How to ask "Where?"',
        back: 'Wo?'
      },
      {
        front: '___ heißt du?',
        back: 'Wie'
      }
    ]
  },
  {
    id: 'haben-sein',
    title: 'haben and sein - The Most Important Verbs',
    category: 'Haben/Sein',
    difficulty: 'beginner',
    order: 8,
    description: 'Master the two most important German verbs',
    explanation: `"haben" (to have) and "sein" (to be) are the most important verbs in German. They're irregular, so you need to memorize them. They're used all the time!`,
    examples: [
      {
        german: 'Ich habe einen Hund.',
        english: 'I have a dog.',
        breakdown: 'habe = have (1st person singular)'
      },
      {
        german: 'Du bist nett.',
        english: 'You are nice.',
        breakdown: 'bist = are (2nd person singular)'
      },
      {
        german: 'Wir sind müde.',
        english: 'We are tired.',
        breakdown: 'sind = are (1st person plural)'
      }
    ],
    keyPoints: [
      'haben: ich habe, du hast, er/sie/es hat, wir haben, ihr habt, sie/Sie haben',
      'sein: ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind',
      'These verbs are completely irregular',
      'haben = possession, sein = state of being'
    ],
    commonMistakes: [
      {
        wrong: 'Ich bin einen Hund.',
        correct: 'Ich habe einen Hund.',
        explanation: 'Use haben for possession, not sein'
      }
    ],
    flashcards: [
      {
        front: 'ich _____ (haben)',
        back: 'habe'
      },
      {
        front: 'du _____ (sein)',
        back: 'bist'
      },
      {
        front: 'er _____ (haben)',
        back: 'hat'
      }
    ]
  }
];

export const grammarCategories = [
  {
    id: 'articles',
    name: 'Articles',
    description: 'der, die, das - German articles and genders',
    icon: '🏷️',
    color: 'bg-blue-500',
    lessons: grammarLessons.filter(l => l.category === 'Articles').length
  },
  {
    id: 'cases',
    name: 'Cases',
    description: 'Nominative, Accusative, Dative - who does what to whom',
    icon: '🎯',
    color: 'bg-green-500',
    lessons: grammarLessons.filter(l => l.category === 'Cases').length
  },
  {
    id: 'verbs',
    name: 'Verbs',
    description: 'Present tense, irregular verbs, and conjugations',
    icon: '⚡',
    color: 'bg-purple-500',
    lessons: grammarLessons.filter(l => l.category === 'Verbs').length
  },
  {
    id: 'pronouns',
    name: 'Pronouns',
    description: 'Personal pronouns - ich, du, er, sie, es...',
    icon: '👤',
    color: 'bg-orange-500',
    lessons: grammarLessons.filter(l => l.category === 'Pronouns').length
  },
  {
    id: 'w-fragen',
    name: 'Questions',
    description: 'W-Questions - wie, was, wo, wer, wann...',
    icon: '❓',
    color: 'bg-red-500',
    lessons: grammarLessons.filter(l => l.category === 'W-Fragen').length
  },
  {
    id: 'haben-sein',
    name: 'haben & sein',
    description: 'The two most important German verbs',
    icon: '⭐',
    color: 'bg-yellow-500',
    lessons: grammarLessons.filter(l => l.category === 'Haben/Sein').length
  }
];
