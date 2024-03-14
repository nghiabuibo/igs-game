import type { Schema, Attribute } from '@strapi/strapi';

export interface ContestContestGroup extends Schema.Component {
  collectionName: 'components_contest_contest_groups';
  info: {
    displayName: 'Contest Group';
    description: '';
  };
  attributes: {
    group: Attribute.Relation<
      'contest.contest-group',
      'oneToOne',
      'api::group.group'
    >;
    contest: Attribute.Relation<
      'contest.contest-group',
      'oneToOne',
      'api::contest.contest'
    >;
    state: Attribute.Component<'contest.state'>;
  };
}

export interface ContestState extends Schema.Component {
  collectionName: 'components_contest_states';
  info: {
    displayName: 'State';
    description: '';
  };
  attributes: {
    currentGamePack: Attribute.Integer & Attribute.DefaultTo<0>;
    currentQuestion: Attribute.Integer & Attribute.DefaultTo<0>;
    currentTimeLeft: Attribute.Integer & Attribute.DefaultTo<0>;
    currentStatus: Attribute.Enumeration<
      ['waiting', 'playing', 'paused', 'ended']
    > &
      Attribute.DefaultTo<'paused'>;
    currentAttempt: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
  };
}

export interface GamePacksMatchingPacks extends Schema.Component {
  collectionName: 'components_game_packs_matching_packs';
  info: {
    displayName: 'Matching Packs';
  };
  attributes: {
    name: Attribute.String;
    coverImage: Attribute.Media;
    questions: Attribute.Component<'matching.matching-questions', true>;
  };
}

export interface GamePacksQuizPacks extends Schema.Component {
  collectionName: 'components_game_packs_quiz_packs';
  info: {
    displayName: 'Quiz Packs';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    coverImage: Attribute.Media;
    questions: Attribute.Component<'quiz.quiz-questions', true>;
  };
}

export interface GamePacksWordFindPacks extends Schema.Component {
  collectionName: 'components_game_packs_word_find_packs';
  info: {
    displayName: 'Word Find Packs';
    description: '';
  };
  attributes: {
    name: Attribute.String;
    coverImage: Attribute.Media;
    questions: Attribute.Component<'word-find.word-find-questions', true>;
  };
}

export interface MatchingMatchingAnswers extends Schema.Component {
  collectionName: 'components_matching_matching_answers';
  info: {
    displayName: 'Matching Answers';
  };
  attributes: {
    text: Attribute.String;
    media: Attribute.Media;
    isCorrected: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface MatchingMatchingQuestions extends Schema.Component {
  collectionName: 'components_matching_matching_questions';
  info: {
    displayName: 'Matching Questions';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    illustration: Attribute.Media;
    answers: Attribute.Component<'matching.matching-answers', true>;
    maxScore: Attribute.Integer;
    timeLimit: Attribute.Integer & Attribute.DefaultTo<0>;
    isRelativeScore: Attribute.Boolean & Attribute.DefaultTo<false>;
    allowMultipleAnswers: Attribute.Boolean & Attribute.DefaultTo<true>;
    col: Attribute.Integer & Attribute.DefaultTo<5>;
  };
}

export interface QuizQuizAnswers extends Schema.Component {
  collectionName: 'components_quiz_quiz_answers';
  info: {
    displayName: 'Quiz Answers';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    media: Attribute.Media;
    isCorrected: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
  };
}

export interface QuizQuizQuestions extends Schema.Component {
  collectionName: 'components_quiz_quiz_questions';
  info: {
    displayName: 'Quiz Questions';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    illustration: Attribute.Media;
    answers: Attribute.Component<'quiz.quiz-answers', true>;
    maxScore: Attribute.Integer;
    timeLimit: Attribute.Integer & Attribute.DefaultTo<0>;
    isRelativeScore: Attribute.Boolean & Attribute.DefaultTo<true>;
    allowMultipleAnswers: Attribute.Boolean & Attribute.DefaultTo<false>;
    answerType: Attribute.Enumeration<['select', 'input']> &
      Attribute.DefaultTo<'select'>;
    col: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 6;
        },
        number
      > &
      Attribute.DefaultTo<2>;
  };
}

export interface WordFindWordFindAnsswers extends Schema.Component {
  collectionName: 'components_word_find_word_find_ansswers';
  info: {
    displayName: 'Word Find Answers';
    description: '';
  };
  attributes: {
    text: Attribute.String;
    isCorrected: Attribute.Boolean & Attribute.DefaultTo<true>;
  };
}

export interface WordFindWordFindQuestions extends Schema.Component {
  collectionName: 'components_word_find_word_find_questions';
  info: {
    displayName: 'Word Find Questions';
    description: '';
  };
  attributes: {
    title: Attribute.String;
    illustration: Attribute.Media;
    answers: Attribute.Component<'word-find.word-find-ansswers', true>;
    maxScore: Attribute.Integer;
    timeLimit: Attribute.Integer & Attribute.DefaultTo<0>;
    isRelativeScore: Attribute.Boolean & Attribute.DefaultTo<false>;
    allowMultipleAnswers: Attribute.Boolean & Attribute.DefaultTo<true>;
    puzzle: Attribute.JSON;
    puzzleDimension: Attribute.Integer & Attribute.DefaultTo<15>;
    puzzleOrientation: Attribute.String &
      Attribute.DefaultTo<'horizontal,vertical'>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'contest.contest-group': ContestContestGroup;
      'contest.state': ContestState;
      'game-packs.matching-packs': GamePacksMatchingPacks;
      'game-packs.quiz-packs': GamePacksQuizPacks;
      'game-packs.word-find-packs': GamePacksWordFindPacks;
      'matching.matching-answers': MatchingMatchingAnswers;
      'matching.matching-questions': MatchingMatchingQuestions;
      'quiz.quiz-answers': QuizQuizAnswers;
      'quiz.quiz-questions': QuizQuizQuestions;
      'word-find.word-find-ansswers': WordFindWordFindAnsswers;
      'word-find.word-find-questions': WordFindWordFindQuestions;
    }
  }
}
