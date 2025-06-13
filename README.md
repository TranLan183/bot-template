# Bot Template

A comprehensive and production-ready Telegram bot template built with TypeScript. This template provides a solid foundation for developing scalable and maintainable Telegram bots with modern best practices and essential features pre-configured.

## 🌟 Overview

This template is designed to help developers quickly bootstrap Telegram bot projects with a focus on:
- Scalable architecture for handling high message volumes
- Robust error handling and monitoring
- Efficient data management with MongoDB and Redis
- Easy deployment with Docker
- Type-safe development with TypeScript

## 🚀 Key Features

- **TypeScript**: Fully written in TypeScript, ensuring type safety and code quality
- **Telegram Integration**: 
  - Built-in integration with Telegram Bot API using Telegraf
  - Support for all Telegram bot features (commands, inline queries, payments, etc.)
  - Middleware system for message handling
  - Session management for user interactions
- **Database Support**: 
  - MongoDB for persistent data storage and user management
  - Redis for caching, rate limiting, and real-time session management
- **Error Tracking**: Sentry integration for real-time error monitoring and reporting
- **Docker Support**: Pre-configured Docker and Docker Compose for easy deployment
- **Environment Configuration**: dotenv for secure environment variable management
- **QR Code Generation**: QR code generation support via qrcode library
- **API Key Management**: uuid-apikey integration for secure API key management
- **Testing Framework**: Built-in testing setup for both API and Telegram bot functionality

## 📋 System Requirements

- Node.js (latest version recommended)
- Telegraf
- MongoDB
- Redis
- Docker (optional)

## 🛠 Installation

1. Clone repository:
```bash
git clone [repository-url]
cd bot-template
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file and configure necessary environment variables

4. Build project:
```bash
npm run build
```

## 🚀 Running the Application

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

### Docker deployment:
```bash
npm run dep
```

## 📝 Available Scripts

- `npm run dev`: Run application in development environment
- `npm run build`: Build project
- `npm start`: Run built application
- `npm test`: Run tests
- `npm run test:api`: Run API tests
- `npm run test:tele`: Run Telegram bot tests
- `npm run dep`: Deploy with Docker
- `npm run dep:log`: Deploy with Docker and view logs

## 🏗 Project Structure

```
bot-template/
├── src/              # Source code
├── dist/             # Compiled code
├── node_modules/     # Dependencies
├── docker-compose.yml # Docker compose configuration
├── Dockerfile        # Docker configuration
├── package.json      # Project configuration
└── tsconfig.json     # TypeScript configuration
```

## 🔧 Configuration

The project uses the following environment variables (to be defined in .env file):

- `TELEGRAM_BOT_TOKEN`: Telegram bot token
- `MONGODB_URI`: MongoDB connection URI
- `REDIS_URI`: Redis connection URI
- `SENTRY_DSN`: Sentry DSN for error tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

ISC License 