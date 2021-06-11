const { rejects } = require('assert');
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
//ask function to receive input from the user in response to a given question
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
//returns the middle of two given numbers, allowing the pc to guess more accurately. Two different functions so you can guess the absolute high or low range.
function smartNumH(sMin, sMax) {
    return Math.round((sMin + sMax) / 2)
}
function smartNumL(sMin, sMax) {
    return Math.floor((sMin + sMax) / 2)
}
//function for the player to guess a number of the pc's choosing
async function guessReverse() {
    console.log("Let's play a game where you try to guess my number!")
    //get the player to establish a range of numbers
    let playerMin = await ask('Pick a number for the bottom range.')
    let playerMax = await ask('Now pick a number for the top range.')
    //turn the returned range into actual numbers instead of a string
    let parsedPlayerMin = parseInt(playerMin)
    let parsedPlayerMax = parseInt(playerMax)
    //generate a random number for the pc, using the randomNum function
    pcNum = randomNum(parsedPlayerMin, parsedPlayerMax)
    let playerGuess = await ask('Alright ive got my number, try and guess it!.')
    //establish a variable to keep track of the number of guesses made
    let guessCount = 0
    //use a loop to allow the game to function without a million else if functions
    while (true) {
        //increase the value of the guess tracking variable by one each loop
        ++guessCount
        //if the guess is correct sulk and end the game
        if (parseInt(playerGuess) === pcNum) {
            console.log("you figured it out?, must have been a lucky guess.")
            //return the current value of the guess tracker
            console.log(`It took you a whole ${guessCount} tries!`)
            //offer to replay a guessing game, either restarting the initial process or ending the program
            let replay = await ask('would you like to play again?')
            if (replay === "yes") {
                pickGame()
            } else if (replay === "no") {
                console.log('Goodbye then')
                process.exit()
            }
            process.exit()
            //return info to the player on whether the guess was too high or too low, so that they don't have to guess at complete random
        } else if (playerGuess > pcNum) {
            playerGuess = await ask('Your guess is too high, try a lower number.')
        } else if (playerGuess < pcNum) {
            playerGuess = await ask('Your guess is too low, try a higher number.')
        }
    }
}
//function for the pc to guess a number of the player's choosing
async function guessGame() {
    console.log('lets play a guessing game!')
    //get the player to establish a range of numbers
    let playerMin = await ask('Pick a number for the bottom range')
    let playerMax = await ask('Now pick a number for the top range')
    //turn the returned range into actual numbers instead of a string
    let parsedPlayerMin = parseInt(playerMin)
    let parsedPlayerMax = parseInt(playerMax)
    //start by asking for their number
    let playerNumber = await ask('Now pick a number for me to guess!');
    //return the chosen number to the player for confirmation 
    console.log(`you've picked ${playerNumber}, now i'll try and guess it!`)
    //establish the initial guess by the computer 
    let pcGuess = randomNum(playerMin, playerMax)
    //variable to keep track of guesses
    let guessNum = 0
//establish a loop to allow the game to function without a million else if functions
    while (true) {
     //increase the value of the guess tracking variable by one each loop
        ++guessNum
            //guess a random number and ask if its correct
        let guess1 = await ask(`${pcGuess} , is this your number? [y]es or [n]o`)
        console.log(pcGuess)
        //if the guess is correct gloat and end the game
        if (guess1 === 'y') {
            console.log('Ha,I win! Try harder next time!')
            //print guess number
            console.log(`It only took me ${guessNum} tries too!`)
            //code to restart function if you want to play again
            let playAgain = await ask('Would you like to play again? [y]es or [n]o')
            if (playAgain === "y") {
                pickGame()
            } else if (playAgain === "n") {
                console.log('Goodbye then!')
                process.exit()

            }
            //if the guess is not correct ask if the number was higher or lower and guess again with an updated range 
        } else if (guess1 === "n") {
            let guess2 = await ask('is your number [higher] or [lower] than mine?')
            //if the player lies end the game 
            if (guess2 === 'higher' && pcGuess > playerNumber) {
                console.log("I don't play with cheaters")
                process.exit()
            } else if (guess2 === 'higher') {
                //change the range and guess "smart" by guessing the middle of the new range 
                //hard change to value of parsedPlayerMin by one to prevent guessing the same number 
                parsedPlayerMin = pcGuess++
                pcGuess = smartNumH(parsedPlayerMin, parsedPlayerMax)
                //guard against the player lying
            } else if (guess2 === 'lower' && pcGuess < playerNumber) {
                console.log("I don't play with cheaters")
                process.exit()
            } else if (guess2 === 'lower') {
                parsedPlayerMax = pcGuess--
                pcGuess = smartNumL(parsedPlayerMin, parsedPlayerMax)
            }
        }
    }
}
//simple ask prompt to decide which function to run. run one or the other function depending on the answer
async function pickGame() {
    let promt = await ask(`Let's try to guess some numbers!
    Would you like me to pick a number, or do you want to pick a number?`)
    if (promt === 'you pick') {
        guessReverse()
    } else if (promt === "I pick") {
        guessGame()
    }
}

pickGame()