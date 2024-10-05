package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"github.com/linode/linodego"
	"golang.org/x/oauth2"
)

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// Initialize Linode client
	apiKey := os.Getenv("LINODE_API_KEY")
	tokenSource := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: apiKey})
	oauth2Transport := &oauth2.Transport{
		Source: tokenSource,
	}
	httpClient := &http.Client{
			Transport: oauth2Transport,
	}
	linodeClient := linodego.NewClient(httpClient)

	app := fiber.New()

	// Use CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("ALLOWED_ORIGINS"),
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Route to list all running Linode instances
	app.Get("/instances", func(c *fiber.Ctx) error {
		instances, err := linodeClient.ListInstances(context.Background(), nil)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.JSON(instances)
	})

	// Route to create a new Linode instance
	app.Post("/instances", func(c *fiber.Ctx) error {
		var createOptions struct {
			Region string `json:"region"`
		}
		if err := c.BodyParser(&createOptions); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		// Get environment variables
		rootPass := os.Getenv("ROOT_PASSWORD")
		authorizedUsers := strings.Split(os.Getenv("AUTHORIZED_USERS"), ",")
		stackScriptID, err := strconv.Atoi(os.Getenv("STACKSCRIPT_ID"))
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Invalid STACKSCRIPT_ID",
			})
		}

		// Create the instance
		instance, err := linodeClient.CreateInstance(
			context.Background(),
			linodego.InstanceCreateOptions{
				Type:            "g6-nanode-1",
					Region:          createOptions.Region,
					Label:           fmt.Sprintf("tailscale-%s-ubuntu24.04", createOptions.Region),
					Image:           "linode/ubuntu24.04",
					RootPass:        rootPass,
					AuthorizedUsers: authorizedUsers,
					StackScriptID:   stackScriptID,
			},
		)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}
		return c.JSON(instance)
	})

	// Route to delete a Linode instance
	app.Delete("/instances/:id", func(c *fiber.Ctx) error {
		instanceID, err := strconv.Atoi(c.Params("id"))
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid instance ID",
			})
		}

		err = linodeClient.DeleteInstance(context.Background(), instanceID)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.SendStatus(fiber.StatusNoContent)
	})

	log.Fatal(app.Listen(":80"))
}

