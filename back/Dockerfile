FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

ARG ENV_FILE

RUN echo "$ENV_FILE" | base64 -d | sed 's/\\n/\n/g' > .env

RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest  

WORKDIR /root/

ARG ENV_FILE

COPY --from=builder /app/main .

RUN echo "$ENV_FILE" | base64 -d > .env

EXPOSE 80

CMD ["./main"]