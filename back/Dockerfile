# Use the official Golang image as the base image
FROM golang:1.23-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Use a smaller base image for the final stage
FROM alpine:latest  

# Set the working directory
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Copy any additional files needed for the application (e.g., .env file)
COPY .env .

# Expose the port the app runs on
EXPOSE 80

# Command to run the executable
CMD ["./main"]