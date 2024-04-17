package main

import (
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/ping", liveCheck)

	router.Run(":8081")
}

func liveCheck(c *gin.Context) {
	c.JSON(200, gin.H{
		"msg": "OK",
	})
}
