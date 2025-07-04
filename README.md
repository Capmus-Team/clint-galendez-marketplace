# Galendez Marketplace

A modern, full-stack marketplace application built with Next.js, TypeScript, and Supabase. This platform allows users to create, browse, and manage listings for items and services.

## ✨ Features

- 🛍️ **Create Listings**: Post items or services for sale
- 🔍 **Search & Filter**: Find listings by category, location, and keywords
- 💬 **Messaging System**: Contact sellers directly through the platform
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📧 **Email Notifications**: Powered by SendGrid
- 🔐 **Secure Backend**: Supabase for authentication and data management

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Email**: [SendGrid](https://sendgrid.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Deployment**: Docker support included

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- SendGrid account (for email functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Galendez Marketplace"
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_verified_sender_email
   ```

4. **Set up the database**
   
   Run the SQL scripts in your Supabase dashboard:
   ```bash
   # Execute the contents of scripts/setup-database.sql in Supabase SQL Editor
   # Optionally, run scripts/insert-mock-data.sql for sample data
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🐳 Docker Deployment

This project includes Docker support for easy deployment.

### Development with Docker

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production with Docker

```bash
docker-compose up --build
```

The production setup includes an Nginx reverse proxy. See [DOCKER.md](./DOCKER.md) for detailed Docker instructions.

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── choose-listing-type/ # Listing type selection
│   ├── create/            # Create new listing
│   ├── item/[id]/         # Individual item pages
│   └── listings/          # Browse all listings
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   ├── header.tsx        # Site header
│   └── sidebar.tsx       # Navigation sidebar
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── supabase.ts      # Supabase client setup
│   └── utils.ts         # General utilities
├── public/              # Static assets
├── scripts/             # Database setup scripts
└── styles/              # Global styles
```

## 🎯 Key Features & Pages

### Home Page (`/`)
- Browse featured listings
- Search functionality
- Category filtering
- Responsive grid layout

### Create Listing (`/create`)
- Form-based listing creation
- Image upload support
- Category selection
- Contact information

### Listing Details (`/item/[id]`)
- Detailed item view
- Contact seller functionality
- Image gallery
- Related items

### Browse Listings (`/listings`)
- Advanced filtering options
- Search capabilities
- Pagination support

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Docker
docker-compose up --build                    # Production with Nginx
docker-compose -f docker-compose.dev.yml up  # Development
```

## 🎨 UI Components

This project uses a comprehensive UI component library built on top of Radix UI:

- **Forms**: Input, Textarea, Select, Checkbox, Radio Groups
- **Navigation**: Breadcrumbs, Pagination, Menu, Tabs
- **Feedback**: Toast, Alert, Progress, Skeleton
- **Overlays**: Dialog, Popover, Tooltip, Sheet
- **Data Display**: Table, Card, Badge, Avatar
- **Layout**: Sidebar, Resizable Panels, Accordion

## 🔒 Database Schema

The application uses the following main tables:

- **listings**: Store marketplace items
- **messages**: Handle buyer-seller communication
- **storage**: Image uploads via Supabase Storage

See `scripts/setup-database.sql` for the complete schema.

## 📧 Email Integration

Email functionality is powered by SendGrid for:
- Contact form submissions
- Seller notifications
- System alerts

## 🚧 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, email [galendez.clintjonathan@gmail.com](galendez.clintjonathan@gmail.com) or create an issue in this repository.

---

Built with ❤️ using Next.js and Supabase
