# Linode VPN Setup Project

This project consists of a frontend built with Next.js and a backend built with Go and Fiber. Both are containerized using Docker for easy deployment.

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Set up environment variables:
   - For the frontend, create a `.env.local` file in the `front` directory with the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - For the backend, ensure the `.env` file is present in the `back` directory with the necessary variables.

3. Build and run the containers:
   ```
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:80

## Stopping the Application

To stop the application, use the following command: