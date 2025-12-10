# My Dealership

A modern, full-featured car dealership web application built with Next.js and PostgreSQL. Browse, search, and purchase vehicles with an intuitive interface and powerful filtering system.

## Description

My Dealership is a comprehensive automotive marketplace platform that enables users to browse vehicle inventory, filter by various criteria, and complete purchases through an integrated checkout system. The application features user authentication, advanced search capabilities, multi-language support, and automated email notifications for system monitoring.

## Features

### Vehicle Management

- **Advanced Search & Filtering**: Filter cars by manufacturer, category, price range, year, horsepower, torque, mileage, fuel efficiency, engine type, transmission, fuel type, and status
- **Detailed Vehicle Pages**: Comprehensive vehicle information with specifications and images
- **Real-time Inventory**: Dynamic vehicle listings with status tracking (Coming soon, On sale, Sold, In process)

### User Authentication

- **Secure Registration**: Email and password-based user registration with bcrypt password hashing
- **Session Management**: JWT-based authentication with NextAuth.js
- **Protected Routes**: Secure access control for authenticated features

### Shopping & Checkout

- **Car Orders**: Complete order management system for vehicle purchases
- **Payment Processing**: Integrated payment handling with session tracking
- **Order History**: Track user purchases and order status

### Internationalization

- **Multi-language Support**: Full English and Italian translations
- **Locale-aware Routing**: Automatic language detection and routing

### System Monitoring

- **Health Checks**: Automated crontab system monitoring
- **Email Notifications**: Automated email alerts for database connectivity and system status

## Technologies

### Frontend

- **[Next.js 14+](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Hook Form](https://react-hook-form.com/)** - Form validation and management

### Backend

- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[node-postgres (pg)](https://node-postgres.com/)** - PostgreSQL client for Node.js
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution

### Validation & Security

- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** - Password hashing

### Internationalization

- **[next-intl](https://next-intl-docs.vercel.app/)** - Internationalization for Next.js

### Email

- **[Nodemailer](https://nodemailer.com/)** - Email sending

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm/bun

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@host:port/database"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXT_EMAIL="true"
NEXT_EMAIL_TO="your-email@example.com"
```

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

The application uses PostgreSQL with the following main tables:

- `Car` - Vehicle inventory
- `Category` - Vehicle categories
- `Manufacturer` - Car manufacturers
- `users` - User accounts
- `CarOrder` - Purchase orders
- `Payment` - Payment transactions

## Project Structure

```
src/
├── app/
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   └── components/        # Shared components
├── db/
│   ├── config.ts          # PostgreSQL connection pool
│   └── functions.ts       # Database queries
├── auth.ts                # NextAuth configuration
├── interfaces/            # TypeScript interfaces
├── mailer/                # Email configuration
└── utils/                 # Utility functions
```

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please create an issue in the project repository.
