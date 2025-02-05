FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

ARG ENV_FILE

RUN echo "$ENV_FILE" | base64 -d | sed 's/\\n/\n/g' > .env.local

RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM alpine:latest  

WORKDIR /root/

COPY --from=builder /app/main .

RUN echo "$ENV_FILE" | base64 -d > .env.local

EXPOSE 80

CMD ["./main"]