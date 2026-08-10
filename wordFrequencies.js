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
    // for(let index = 0; index < starterWords.length; index++) {
    //     let temp = starterWords[index];
    //     let randomIndex = Math.floor(Math.random() * starterWords.length);

    //     starterWords[index] = starterWords[randomIndex];
    //     starterWords[randomIndex] = temp;
    // }
    // starterWords = starterWords.sort((a, b) => b.length - a.length);

    // for(const starterWord of starterWords) {
    //     // const usuableWords = Object.keys(rootWords);
    //     // if(usuableWords.includes(starterWord))
    //     if(startingWords.includes(starterWord))
    //         return createPhrase([starterWord]);
    // }

    for(let index = starterWords.length; index >= 1; index--) {

        let starterWord = starterWords.slice(-index);

        if(rootWords[starterWord.join(" ")]) {
            return createPhrase(starterWord)
        }
    }

    return createPhrase([chooseRootWord(startingWords.map(startWord => rootWords[startWord])).word]);

    // const words = Object.keys(rootWords);
    // return createPhrase(words[Math.floor(Math.random() * words.length)].split(" "));
}

function createPhrase(words) {
    let wordsSequence = words;

    let repsCountdown = 500;
    
    do {
        let rootWordToUse;
        // for(let sequenceLength = SEQUENCE_LENGTH; sequenceLength > 0; sequenceLength--) {
        for(let sequenceLength = Math.floor(Math.random() * SEQUENCE_LENGTH) + 1; sequenceLength > 0; sequenceLength--) {
            currentRootWord = rootWords[wordsSequence.slice(-sequenceLength).join(" ")];

            if(currentRootWord) {
                rootWordToUse = currentRootWord;
                break;
            }
        }

        if(!rootWordToUse)
            return "I couldn't create a sentence ):";

        // let rootWord = chooseRootWord(rootWordsToUse);
        let rootWord = rootWordToUse;
        // let rootWord = rootWordsToUse[Math.floor(Math.random() * rootWordsToUse.length)];

        let nextWord = rootWord.chooseNextWord().word;

        if(nextWord == "")
            break;
            // continue;

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
    rootWords,
    createPhrase,
    generatePhrase
};