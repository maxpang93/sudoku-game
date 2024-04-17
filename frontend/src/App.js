import './App.css';
import './style.css';

import { useState } from 'react';

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

function TextSquare({ value, isInputDisabled, onCellChange }) {
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
    ["", "", "1", "", "5", "4", "", "", ""],
    ["3", "4", "", "", "", "", "", "", "1"],
    ["2", "", "", "", "1", "9", "", "7", ""],
    ["4", "", "7", "9", "3", "1", "", "6", ""],
    ["9", "1", "", "", "7", "", "3", "4", ""],
    ["", "", "", "2", "", "5", "", "", "7"],
    ["1", "3", "2", "", "9", "7", "", "", "5"],
    ["", "6", "4", "5", "", "", "", "1", ""],
    ["", "", "8", "1", "", "6", "", "", "4"],
  ]
  return (
    <div className="game-container">
      <div>
        <Grid matrix={matrix} />
      </div>
    </div>
  )
}

function Grid({ matrix }) {
  // disable cells that are initially filled
  const cellsDisabled = deepcopy(matrix)
  for (let i = 0; i < cellsDisabled.length; i++) {
    for (let j = 0; j < cellsDisabled[0].length; j++) {
      cellsDisabled[i][j] = !!cellsDisabled[i][j]
    }
  }

  const [gridValues, setGridValues] = useState(matrix)
  const [gridCellsDisabled, setGridCellsDisabled] = useState(cellsDisabled)

  async function handleChange(i, j, event) {
    // regex
    const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)

    // validate if numeric and valid sudoku move
    const validateInput = (inputValue) => {
      // validate must be 1-9
      if (!isNumeric(inputValue)) {
        console.warn("Input is NOT a number.")
        return false
      } else if (Number(inputValue) === 0) {
        console.warn("0 is NOT a valid input.")
        return false
      }
      return true
    }

    const checkIsValidSudoku = async (nextGridValues) => {
      try {
        const resp = await fetch("http://localhost:8081/validateSudokuInput", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Board: nextGridValues })
        })

        const data = await resp.json()
        console.log(data)

      } catch (err) {
        console.error(`Failed to validate input: ${err}`)
        return false
      }

      return true
    }

    const resetValueAndEnableSquare = () => {
      console.error("Input is invalid. Reseting value and enable square.")
      const newGridValues = deepcopy(gridValues)
      const newGridCellsDisabled = deepcopy(gridCellsDisabled)
      newGridValues[i][j] = ""
      newGridCellsDisabled[i][j] = false
      setGridValues(newGridValues)
      setGridCellsDisabled(newGridCellsDisabled)
    }


    const inputValue = event.target.value
    if (inputValue.length === 0) {
      console.log("inputValue is empty")
      return
    }

    const newGridCellsDisabled = deepcopy(gridCellsDisabled)
    newGridCellsDisabled[i][j] = true
    setGridCellsDisabled(newGridCellsDisabled)

    const valid = validateInput(inputValue)
    console.log("valid: ", valid)
    if (!valid) {
      resetValueAndEnableSquare()
      return
    }

    const nextGridValues = deepcopy(gridValues)
    nextGridValues[i][j] = inputValue
    const isValidSudoku = await checkIsValidSudoku(nextGridValues)
    console.log("isValidSudoku: ", isValidSudoku)
    if (!isValidSudoku) {
      resetValueAndEnableSquare()
      return
    }

    const newGridValues = deepcopy(gridValues)
    newGridValues[i][j] = inputValue
    setGridValues(newGridValues)
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
                onCellChange={(event) => handleChange(i, j, event)}
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

const deepcopy = (someObject) => JSON.parse(JSON.stringify(someObject))

export default App;
