# Ninja Reverse Proxy

## Overview

Ninja Reverse Proxy is a simple reverse proxy server built with Node.js and TypeScript. It uses clustering to handle multiple worker processes and routes incoming HTTP requests to specified upstream servers based on predefined rules.

## Features

- Load balancing across multiple worker processes
- Configurable upstream servers and routing rules
- Support for custom headers
- Easy configuration using YAML

## Prerequisites

- Node.js (>= 14.x)
- TypeScript

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ninja-reverse-proxy.git
    cd ninja-reverse-proxy
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Build the project:
    ```sh
    npm run build
    ```

## Configuration

The configuration is done using a YAML file. Below is an example configuration (`config.yaml`):

```yaml
server:
  listen: 8080
  workers: 2
  upstreams:
    - id: jsonplaceholder
      url: jsonplaceholder.typicode.com
    
    - id: node2
      url: localhost:8002

  headers:
    - key: x-forward-for
      value: '$ip'

    - key: Authorization
      value: 'Bearer xyz'

  rules:
  - path: /
    upstreams:
      - jsonplaceholder
  - path: /todos
    upstreams:
      - jsonplaceholder
  - path: /posts
    upstreams:
      - jsonplaceholder
  - path: /comments
    upstreams:
      - jsonplaceholder
  - path: /admin
    upstreams:
      - node2
```

## Running the Server

To start the reverse proxy server, use the following command:

```sh
node dist/index.js --config path/to/config.yaml
```

Replace `path/to/config.yaml` with the actual path to your configuration file.

## Project Structure

- `src/`: Contains the source code
  - `config.ts`: Functions for parsing and validating the YAML configuration
  - `config-schema.ts`: Zod schemas for validating the configuration
  - `server.ts`: Main server logic for handling requests and responses
  - `server-schema.ts`: Zod schemas for validating server messages
  - `index.ts`: Entry point for the application
- `config.yaml`: Example configuration file

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License.