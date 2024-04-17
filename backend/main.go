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
	log.Printf("Board received: %v", board)
	return true
}
