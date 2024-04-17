package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/ping", liveCheck)
	router.POST("/validateSudokuInput", validateSudokuInputHandler)

	router.Run(":8081")
}

func liveCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"msg": "OK",
	})
}

func validateSudokuInputHandler(c *gin.Context) {
	type payload struct {
		Board [][]string
	}

	var JsonBody payload
	if err := c.BindJSON(&JsonBody); err != nil {
		log.Fatal(err)
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"msg": "Unprocessable JSON Body",
		})
	}
	log.Print(JsonBody)
	valid := isValidSudoku(JsonBody.Board)
	c.JSON(http.StatusOK, gin.H{
		"msg":   "OK",
		"valid": valid,
	})
}

func isValidSudoku(board [][]string) bool {
	rowSize := len(board)
	columnSize := len(board[0])

	for i := 0; i < rowSize; i++ {
		for j := 0; j < columnSize; j++ {
			log.Print(board[i][j])
			if board[i][j] == "" {
				continue
			}
			row := board[i]
			column := extractColumn(board, j)

			var validRow, validColumn, validSubbox bool
			validRow = checkRow(row, j)
			validColumn = checkColumn(column, i)
			validSubbox = checkSubbox(board, i, j)
			// fmt.Println(i,j)
			// fmt.Println(validRow, validColumn, validSubbox)
			if !(validRow && validColumn && validSubbox) {
				return false
			}
		}
	}

	return true
}

func checkRow(row []string, y int) bool {
	for i, item := range row {
		if i == y {
			continue
		}
		if item == row[y] {
			return false
		}
	}
	return true
}

func checkColumn(column []string, x int) bool {
	for j, item := range column {
		if j == x {
			continue
		}
		if item == column[x] {
			return false
		}
	}
	return true
}

func checkSubbox(board [][]string, x, y int) bool {
	x_start := (x / 3) * 3
	y_start := (y / 3) * 3
	// fmt.Println(x_start, y_start)

	for i := x_start; i < x_start+3; i++ {
		for j := y_start; j < y_start+3; j++ {
			if i == x && j == y {
				continue
			}
			if board[i][j] == board[x][y] {
				return false
			}
		}
	}

	return true
}

func extractColumn(matrix [][]string, y int) []string {
	var column []string
	for _, row := range matrix {
		column = append(column, row[y])
	}
	// fmt.Println(column)
	return column
}
