const { RootWord } = require("./words");

const rootWords = {};
const startingWords = [];

// const SEQUENCE_LENGTH = 2;
const SEQUENCE_LENGTH = 3;


function addMessageWords(words) {
    startingWords.push(words[0]);

    for(let wordIndex = 0; wordIndex < words.length; wordIndex++) {
        for(let sequenceStartIndex = Math.max(wordIndex - SEQUENCE_LENGTH + 1, 0); sequenceStartIndex <= wordIndex; sequenceStartIndex++) {
            let currentWord = "";

            for(let sequenceIndex = sequenceStartIndex; sequenceIndex <= wordIndex; sequenceIndex++) {
                currentWord += words[sequenceIndex] + " ";
            }

            currentWord = currentWord.slice(0, -1);

            let rootWord = rootWords[currentWord];

            if(!rootWord)
                rootWords[currentWord] = rootWord = new RootWord(currentWord);

            rootWord.addWord(words[wordIndex+1] ?? "");
        }
    }
}

function generatePhrase(starterWords = []) {
    for(let index = starterWords.length; index >= 1; index--) {

        let starterWord = starterWords.slice(-index);

        if(rootWords[starterWord.join(" ")]) {
            return createPhrase(starterWord)
        }
    }

    return createPhrase([chooseRootWord(startingWords.map(startWord => rootWords[startWord])).word]);
}

function createPhrase(words) {
    let wordsSequence = words;

    let repsCountdown = 500;
    
    do {
        let rootWordToUse;
        for(let sequenceLength = Math.floor(Math.random() * SEQUENCE_LENGTH) + 1; sequenceLength > 0; sequenceLength--) {
            currentRootWord = rootWords[wordsSequence.slice(-sequenceLength).join(" ")];

            if(currentRootWord) {
                rootWordToUse = currentRootWord;
                break;
            }
        }

        if(!rootWordToUse)
            return "I couldn't create a sentence ):";

        let rootWord = rootWordToUse;

        let nextWord = rootWord.chooseNextWord().word;

        if(nextWord == "")
            break;

        wordsSequence.push(nextWord);
    } while(repsCountdown-- > 0);

    return wordsSequence.join(" ");
}

function chooseRootWord(rootWordsToUse) {
    const range = rootWordsToUse.reduce((sum, word) => sum + word.frequency, 0);
    const random = Math.floor(Math.random() * range);

    let wordIndex = 0;
    for(let cummulativeFreq = 0; wordIndex != rootWordsToUse.length; wordIndex++) {
        cummulativeFreq += rootWordsToUse[wordIndex].frequency;

        if(random < cummulativeFreq)
            break;
    }

    return rootWordsToUse[wordIndex];
}

module.exports = {
    addMessageWords,
    createPhrase,
    generatePhrase,
    rootWords
};