# Linode VPN Setup Project

This project consists of a frontend built with Next.js and a backend built with Go and Fiber. Both are containerized using Docker for easy deployment.

## Purpose

This project is designed to simplify the process of setting up a Tailscale VPN for personal use. It provides a user-friendly interface to:

1. Create a Linode instance using a predefined Stackscript in a chosen region.
2. Monitor running instances.
3. Delete instances when they are no longer needed.

This tool streamlines the management of your personal VPN infrastructure, making it easy to deploy, monitor, and clean up your Tailscale VPN nodes on Linode.

![Linode VPN Setup Demo](@1006.gif)

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
```
docker-compose down
```

## Features

- Create Linode instances with pre-configured Tailscale VPN setup
- Choose from available Linode regions
- Monitor active VPN instances
- Delete instances when no longer needed
- User-friendly web interface for easy management

## Linode Stackscript

The following Stackscript is used to set up the Tailscale VPN on the Linode instance:

```bash
#!/bin/bash
# enable ip forwarding
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh
export TS_AUTHKEY=
sudo tailscale up --advertise-exit-node --authkey $TS_AUTHKEY
```

This script does the following:
1. Enables IP forwarding for both IPv4 and IPv6.
2. Installs Tailscale.
3. Sets up Tailscale with the provided auth key and advertises the node as an exit node.

Note: Make sure to replace `TS_AUTHKEY=` with your actual Tailscale auth key when using this script.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).