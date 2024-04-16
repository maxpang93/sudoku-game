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

function TextSquare({value, isInputDisabled, onCellChange}) {
  console.log(typeof(onCellChange))
  return (
    <>
    <input 
      className="text-square"
      type="text"
      value={value}
      maxLength={1}
      onChange={onCellChange}
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
  const [gridValues, setGridValues] = useState(Array(9).fill(Array(9).fill("")))

  const [gridCellsDisabled, setGridCellsDisabled] = useState(Array(9).fill(Array(9).fill(false)))


  // setGridValues(matrix)

  async function handleChangeFnGenerator(i, j) {
    // regex
    const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)

    // validate if numeric and valid sudoku move
    const validateInput = async (inputValue) => {
      console.log("type: ", typeof(inputValue))
      console.log("inputValue: ", inputValue)
      // validate must be 1-9
      if (!isNumeric(inputValue)) {
        console.warn("Input is NOT a number.")
        return false
      }

      return Math.random() > 0.5 // TO remove
    }

    async function handleChange(event) {
      const inputValue = event.target.value
      if (inputValue.length === 0) {
        console.log("inputValue is empty")
        return
      }
      gridCellsDisabled[i][j] = false
      setGridCellsDisabled(gridCellsDisabled)

      const valid = await validateInput(inputValue)
      console.log("valid: ", valid)

      if (valid) {
        gridValues[i][j] = inputValue
        setGridValues(gridValues)
      } else {
        console.error("Input is invalid. Reseting value and enable square.")
        gridCellsDisabled[i][j] = true
        setGridCellsDisabled(gridCellsDisabled)
      }
    }
    return handleChange
  }
  return (
    <>
      {Array(9).fill(null).map((_, i) => (
        <div className="grid-row" key={i}>
          {Array(9).fill(null).map((_, j) => {
            return (
              <TextSquare
                key={`${i}${j}`} 
                value={gridValues[i][j]}
                isInputDisabled={gridCellsDisabled[i][j]}
                onCellChange={handleChangeFnGenerator(i,j)}
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
