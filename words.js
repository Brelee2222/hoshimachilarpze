class RootWord {
    word;
    frequency;
    nextWords;

    constructor(word, frequency = 0, nextWords = {}) {
        this.word = word;
        this.frequency = frequency;
        this.nextWords = nextWords;
    }

    addWord(word) {
        this.frequency++;

        if(!this.nextWords[word])
            this.nextWords[word] = new NextWord(word);
        
        this.nextWords[word].add();
    }

    chooseNextWord() {
        const nextWords = Object.values(this.nextWords);

        const range = nextWords.reduce((sum, word) => sum + word.frequency, 0);
        const random = Math.floor(Math.random() * range);

        let wordIndex = 0;
        for(let cummulativeFreq = 0; wordIndex != nextWords.length; wordIndex++) {
            cummulativeFreq += nextWords[wordIndex].frequency;

            if(random < cummulativeFreq)
                break;
        }

        return nextWords[wordIndex];
    }
}

class NextWord {
    word;
    frequency;

    constructor(word) {
        this.word = word;
        this.frequency = 0;
    }

    add() {
        this.frequency++;
    }
}

module.exports = {
    RootWord,
    NextWord
}