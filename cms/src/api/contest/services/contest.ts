/**
 * contest service
 */

import { factories } from '@strapi/strapi';
import WordFindModule from '../../../libs/wordfind/wordfind';

export default factories.createCoreService('api::contest.contest', ({ strapi }) => ({
    async generateWordFindPuzzle(contestID) {
        // generate word find puzzle
        const contest = await strapi.entityService.findOne('api::contest.contest', contestID, {
            populate: 'gamePacks.questions.answers',
        })
        if (!contest.gamePacks) return

        for (const i in contest.gamePacks) {
            const gamePack = contest.gamePacks[i]
            if (gamePack.__component !== 'game-packs.word-find-packs') continue
            if (!gamePack.questions) continue

            for (const ii in gamePack.questions) {
                const question = gamePack.questions[ii]
                if (!question.answers) continue
                if (question.puzzle) continue

                const wordfind = WordFindModule()
                const wordList = question.answers.filter(answer => answer.text && answer.isCorrected).map(answer => answer.text)
                const customOrientations = question.puzzleOrientation.split(',') ?? ['horizontal', 'vertical'];
                const puzzleOptions = {
                    // Set dimensions of the puzzle
                    height: question.puzzleDimension ?? 15,
                    width: question.puzzleDimension ?? 15,
                    // or enable all with => orientations: wordfind.validOrientations,
                    orientations: customOrientations,
                    // Set a random character the empty spaces
                    fillBlanks: true,
                    preferOverlap: false
                };
                const puzzle = wordfind.newPuzzle(wordList, puzzleOptions)
                await strapi.query('word-find.word-find-questions').update({
                    where: { id: question.id },
                    data: { puzzle }
                })
            }
        }
    }
}));
