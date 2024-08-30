# SaaS Starter with Nextauth, Razorpay, Prisma, and PostgreSQL

This is a starter template for Next.js projects with built-in authentication, Razorpay integration, Prisma ORM, and PostgreSQL (via Docker).

## Features

- Next.js 13+ with App Router
- NextAuth for authentication
- Razorpay integration for payments
- Prisma ORM for database management
- PostgreSQL database (containerized with Docker)
- Tailwind CSS for styling
- TypeScript support

## Prerequisites

- Node.js 14+ and npm
- Docker and Docker Compose

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   ```

2. Install dependencies:
   ```bash
   cd your-repo-name
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your details.

4. Start the PostgreSQL database:
   ```bash
   docker-compose up -d
   ```
5. Make .env file same as example env file, if usind docker for database kepp the DATABASE_URL same as example

6. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```


## License

This project is open source and available under the [MIT License](LICENSE).
