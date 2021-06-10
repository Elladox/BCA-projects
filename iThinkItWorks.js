const { rejects } = require('assert');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
    return new Promise((resolve, reject) => {
        rl.question(questionText, resolve);
    });
}
//random number generator
function randomNum(min, max) {
    let rangeMin = Math.ceil(min)
    let rangeMax = Math.floor(max)
    return Math.floor(Math.random() * (rangeMax - rangeMin) + rangeMin)
}
function smartNum(sMin, sMax) {
    return Math.floor((sMin + sMax) / 2)
}

play()
async function play() {
    console.log('lets play a guessing game!')
    let playerMin = await ask('Pick a number for the bottom range')
    let playerMax = await ask('Now pick a number for the top range')
    let parsedPlayerMin = parseInt(playerMin)
    let parsedPlayerMax = parseInt(playerMax)
    //start by asking for their number
    let playerNumber = await ask('Now pick a number for me to guess!');
    //return the chosen number to the player for confirmation 
    console.log(`you've picked ${playerNumber}, now i'll try and guess it!`)
    //let pcGuess = randomNum(playerMin, playerMax)
    let pcGuess = randomNum(playerMin, playerMax)
    //guess a random number and ask if its correct
    //if its correct gloat and end the game
    while (true) {

        let guess1 = await ask(`${pcGuess} , is this your number?`)
        console.log(pcGuess)

        if (guess1 === 'y') {
            console.log('Ha,I win! Try harder next time!')
            process.exit()
            //if not correct ask if the number was higher or lower and guess again with an updated range 
        } else if (guess1 === "n") {
            let guess2 = await ask('is your number higher or lower than mine?')
            //if the player lies end the game 
            if (guess2 === 'higher' && pcGuess > playerNumber) {
                console.log("I don't play with cheaters")
                process.exit()
            } else if (guess2 === 'higher') {
                //change the range and guess "smart" by guessing the middle of the new range 
                parsedPlayerMin = pcGuess++
                pcGuess = smartNum(parsedPlayerMin, parsedPlayerMax)
                console.log(pcGuess)
            } else if (guess2 === 'lower' && pcGuess < playerNumber) {
                console.log("I don't play with cheaters")
                process.exit()
            } else if (guess2 === 'lower') {
                //max = pcGuess--
                //pcGuess = randomNum(min, max)
                parsedPlayerMax = pcGuess--
                pcGuess = smartNum(parsedPlayerMin, parsedPlayerMax)
                console.log(pcGuess)
            }
        }
    }
}

//winging it code for cheating 
//
//if (guess2 === 'higher' && pcGuess > playerNumber) {
//    console.log("I don't play with cheaters")
//    process.exit()
//}
//
//if (guess2 === 'lower' && pcGuess < playerNumber) {
//    console.log("I don't play with cheaters")
//    process.exit()
//