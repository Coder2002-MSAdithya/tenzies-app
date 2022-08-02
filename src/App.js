import React from "react"
import Die from "./Die"
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

let timerId

function App() 
{
    const [dice, setDice] = React.useState(() => allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [numRollsUsed, setNumRollsUsed] = React.useState(0)
    const [bestNumRolls, setBestNumRolls] = React.useState(() => localStorage.getItem("best-rolls"))
    const [bestTime, setBestTime] = React.useState(() => +localStorage.getItem("best-time"))
    const [timeElapsed, setTimeElapsed] = React.useState(0)
    const [gameInPlay, setGameInPlay] = React.useState(false)
    
    
    const bestTimeMinutes = Math.floor(bestTime / 60)
    const bestTimeSeconds = bestTime % 60
    
    const timeElapsedMinutes = Math.floor(timeElapsed / 60)
    const timeElapsedSeconds = timeElapsed % 60
    
    const {width, height} = useWindowSize()
    
    const diceElements = dice.map(die => <Die key={die.id} held={die.isHeld} value={die.value} handleClick={() => toggleHold(die.id)}/>)
    
    React.useEffect(() => {
        const oneDieValue = dice[0].value
        const allDiceAreHeld = dice.every(die => die.isHeld)
        const allDiceHaveSameNumber = dice.every(die => die.value === oneDieValue)
        
        if(allDiceAreHeld && allDiceHaveSameNumber)
        {
            setTenzies(true)
            
            if(!bestTime || timeElapsed < bestTime)
            {
                setBestTime(timeElapsed)
                localStorage.setItem("best-time", timeElapsed)
            }
            
            if(!bestNumRolls || numRollsUsed < bestNumRolls)
            {
                setBestNumRolls(numRollsUsed)
                localStorage.setItem("best-rolls", numRollsUsed)
            }
        }
    }, [dice])
    
    React.useEffect(() => {
        if(!tenzies && gameInPlay)
        {
            timerId = setInterval(() => setTimeElapsed(time => time + 1), 1000)
        }
        else
        {
            clearInterval(timerId)  
        }
    }, [tenzies, gameInPlay])
    
    function generateRandomDiceRoll()
    {
        return Math.ceil(Math.random() * 6)
    }
    
    function allNewDice()
    {
        const tenRandomDice = []
        
        for(let i = 1; i <= 10; i++)
        {
            const randomDiceRoll = generateRandomDiceRoll()
            tenRandomDice.push({value: randomDiceRoll, isHeld: false, id: `die-${i}`})
        }
        
        return tenRandomDice
    }
    
    function rollDice()
    {
        setDice(prevDice => prevDice.map(die => die.isHeld ? die : ({
            ...die, value: generateRandomDiceRoll()
        })))
    }
    
    function gamePlay()
    {
        if(!gameInPlay)
        {
            return
        }
        if(tenzies)
        {
            setDice(allNewDice())
            setTenzies(false)
            setTimeElapsed(0)
            setNumRollsUsed(0)
        }
        else
        {
            rollDice()
            setNumRollsUsed(prevNumRolls => prevNumRolls + 1)
        }
    }
    
    function toggleHold(diceId)
    {
        if(!gameInPlay)
        return
        setDice(prevDice => prevDice.map(die => ({...die, isHeld: die.id === diceId ? !(die.isHeld)
        :(die.isHeld)})))    
    }
    
    function togglePlayPause()
    {
        setGameInPlay(prevPlayState => !prevPlayState)
        
        if(gameInPlay)
        alert("Game is paused.")    
    }
    
    return (
        <main>
            {tenzies && <Confetti width={width} height={height}/>}
            <section className="about-game">
                <h1>Tenzies</h1>
                <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            </section>
            <section className="game-stats">
                <span>Best Time: {bestTimeMinutes+bestTimeSeconds ? bestTimeMinutes : "-"}:{bestTimeMinutes+bestTimeSeconds ? bestTimeSeconds : "-"}</span>
                <span>Best Rolls: {bestNumRolls || "NA"}</span>
                <span>Current Rolls: {numRollsUsed}</span>
                <span>Time Elapsed: {timeElapsedMinutes}:{timeElapsedSeconds < 10 ? `0${timeElapsedSeconds}` : timeElapsedSeconds}</span>
            </section>
            <section className="dies-container">
                {diceElements}
            </section>
            {
                tenzies &&
                <section className="win-text">
                    <p>{`Congrats, you have won the game in ${numRollsUsed} rolls in ${timeElapsedMinutes ? `${timeElapsedMinutes} minutes` : ``} and ${timeElapsedSeconds} seconds.`}</p>
                </section> 
            }
            <section className="button-container">
                <button className="game-play" onClick={gamePlay}>
                    {tenzies ? "New Game" : "Roll"}
                </button>
                {
                    !tenzies &&
                    <button className="game-play" onClick={togglePlayPause}>
                        {gameInPlay ? "Pause" : "Play"}
                    </button>
                }
            </section>
        </main>
    )
}

export default App