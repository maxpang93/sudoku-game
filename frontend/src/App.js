import './App.css';
import './style.css';

import { useState} from 'react';

function App() {
  return (
    <div className="App">
      <Game />
      <TextSquare />
    </div>
  );
}

function TextSquare() {
  const [value, setValue] = useState("")
  const [isInputDisabled, setIsInputDisabled] = useState(false)

  const handleChange = async (event) => {
    console.log("evnt", event)

    const inputValue = event.target.value
    if (inputValue.length === 0) {
      console.log("inputValue is empty")
      return
    }
  
    setIsInputDisabled(true)
    
    const valid = await validateInput(inputValue)
    console.log("valid: ", valid)
    if (valid) {
      setValue(inputValue)
    } else {
      console.error("Input is invalid. Reseting value and enable square.")
      setValue("")
      setIsInputDisabled(false)
    }
  }

  const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)

  const validateInput = async (inputValue) => {
    console.log("type: ", typeof(inputValue))
    console.log("inputValue: ", inputValue)
    // validate must be 1-9
    if (!isNumeric(inputValue)) {
      console.warn("Input is NOT a number.")
      return false
    }

    return Math.random() > 0.5 // TO remove

    // call backend to validate if input fulfills sudoku rules
    try {
      // TODO:
      const resp = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({input: inputValue})
      })

      const data = await resp.json()
      console.log(data)

    } catch (err) {
      console.error(`Failed to validate input: ${err}`)
      return false
    }

    return true
  }

  return (
    <>
    <input 
      className="text-square"
      type="text"
      value={value}
      maxLength={1}
      onChange={handleChange}
      disabled={isInputDisabled}
      />
    </>
  )
}

function Game() {
  let matrix = [
    [1,2,3, , , 6, 7, 8, 9],
    [1,2,3, , , 6, 7, 8, 9], 
    [1,2,3, , , 6, 7, 8, 9],
    [1,2,3, , , 6, 7, 8, 9],
    [1,2,3, , , 6, 7, 8, 9],
    [1,2,3, , , 6, 7, 8, 9],

    [1,2,3, , , 6, 7, 8, 9],
    [1,2,3, , , 6, 7, 8, 9],
    [1,2,3, , , 6, 7, 8, 9],


  ]
  return (
    <div className="game-container">
      <div>
        <Grid matrix={matrix}/>
      </div>
    </div>
  )
}

function Grid({matrix}) {
  const onSquareClick = () => { console.log("this is onSquareClick") }

  return (
    <>
      {Array(9).fill(null).map((_, i) => (
        <div className="grid-row" key={i}>
          {Array(9).fill(null).map((_, j) => {
            return (
              <Square
                key={`${i}${j}`} 
                value={matrix[i][j]}
                onSquareClick={onSquareClick}
              />
              );
            })}
        </div>
      ))}
    </>
  )
}

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

export default App;
