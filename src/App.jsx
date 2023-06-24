import { Die } from '../components/Die'
import { Timer } from '../components/Timer'
import { useState, useEffect } from 'react'
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import './App.scss'

function App() {
  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [moves, setMoves] = useState(0)
  const [isTimerStarted, setTimerStarted] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (isTimerStarted) {
      const timerId = setInterval(() => {
        setSeconds(prevSec => prevSec + 1)
        if (seconds % 60 === 59) {
          setSeconds(prevSec => 0)
          setMinutes(prevMin => prevMin + 1)
        }
      }
        , 1000);
      if (tenzies) {
        clearInterval(timerId);
      }
      return () => clearInterval(timerId)
    }
  }
    , [seconds, isTimerStarted, tenzies])


  const dicesElem = dice.map((num) => {
    return (<Die value={num.value} isHeld={num.isHeld} key={num.id} handleClick={() => holdDice(num.id)} />)
  })

  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    let arr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    arr = arr.map(() => {
      return generateNewDice()
    }
    )
    return arr
  }

  function rollDices() {
    if (tenzies) {
      setDice(allNewDice())
      setTenzies(false)
    }
    setDice(prevDice => {
      return prevDice.map(elem => {
        return elem.isHeld ? elem : generateNewDice();
      })
    })
    setMoves(prevState => {
      return tenzies ? prevState : prevState + 1
    }
    );
  }
  function holdDice(id) {
    setTimerStarted(true)
    setMoves(prevState => {
      return tenzies ? prevState : prevState + 1
    }
    );
    setDice(prevDice => prevDice.map(elem => elem.id === id ? { ...elem, isHeld: true } : elem))
  }

  function restartGame(){
    setMoves(0);
    setSeconds(0);
    setMinutes(0);
    setTimerStarted(false)
  }

  useEffect(() => {
    const allHeld = dice.every(dice => dice.isHeld);
    const firstValue = dice[0].value;
    const allTheSame = dice.every(dice => dice.value === firstValue);
    if (allHeld && allTheSame) {
      setTenzies(true);
    }
    if (allHeld && !allTheSame) {
      setTenzies(false);
      setDice(allNewDice())
      rollDices();
      restartGame()
    }
  }
    , [dice])

  useEffect(() => {
    moves!= 0 ? localStorage.setItem('moves', moves) : localStorage.getItem('moves')
    seconds != 0 || minutes !=0 ? localStorage.setItem('time', `${minutes}:${seconds}`) : localStorage.getItem('time')
  }, [tenzies])

  return (
    <>
      {tenzies && <Confetti />}
      <main>
        <section className='game'>
          <h1>Tenzies</h1>
          <p>
            Roll until all dice are the same. Click each die to freeze it at its current value between rolls.
          </p>
          <div className="info">
            <Timer seconds={seconds} minutes={minutes}> Time: </Timer>
            <p className="result">Last result: {localStorage.getItem('moves')}, {localStorage.getItem('time')}</p>
          </div>
          <p>
            Moves: {moves}
          </p>
          <div className="game_board">
            {dicesElem}
          </div>
          <button onClick={() => {
            rollDices();
            if (tenzies) {
              restartGame();
            }
          }}>
            {tenzies ? 'New game' : 'Roll'}
          </button>
        </section>
      </main></>
  )
}

export default App
