# MarketHive Backend

MarketHive is a multi-vendor e-commerce REST API built with **Node.js**, **Express**, and **MySQL**. It supports three types of users — **Customers**, **Sellers**, and **Admin** — and covers the full flow of an online marketplace: authentication, product catalog, cart, checkout, payments, reviews, wishlists, and an AI shopping assistant.

## Features

- **JWT-based authentication** with HTTP-only cookies, separate login flows for customers, sellers, and admins, and OTP-based email verification / password reset.
- **Role-based access control** (`customer`, `seller`, `admin`) enforced via middleware on protected routes.
- **Seller module** — registration with business & bank details, profile management, product listing, order fulfillment, and revenue tracking.
- **Customer module** — profile & addresses, product browsing/search, cart, wishlist, checkout, order history, reviews, and (simulated) payments.
- **Admin module** — dashboard statistics, category management, seller approval/suspension, product moderation, and order oversight.
- **Product image uploads** via Multer (temporary local storage) and Cloudinary (permanent hosting).
- **AI shopping assistant** — a Gemini-powered chat endpoint that answers customer questions using only the store's actual product catalog.
- **Layered architecture** — Routes → Controllers → Services → Repositories, with a raw SQL data-access layer over MySQL.

## Tech Stack

| Concern            | Technology                          |
|---------------------|--------------------------------------|
| Runtime / Framework | Node.js, Express                    |
| Database            | MySQL (via `mysql2/promise`)        |
| Authentication      | `jsonwebtoken`, HTTP-only cookies   |
| Password hashing    | `bcrypt`                            |
| File uploads        | `multer`, `cloudinary`              |
| Email               | `nodemailer` (Gmail transport)      |
| AI assistant        | `@google/genai` (Gemini)            |
| Validation          | `express-validator`                 |
| Env config          | `dotenv`                            |

## Project Structure

```
src/
├── app.js                  # Express app setup: middleware + route mounting
├── server.js               # Entry point — starts the HTTP server
├── Config/                 # Third-party service configuration
│   ├── dbConnection.js     # MySQL connection pool
│   ├── cloudinary.js       # Cloudinary SDK config
│   ├── mailConfig.js       # Nodemailer transporter (Gmail)
│   └── gemini.js           # Gemini AI client
├── Constants/              # Shared enum-like constants (roles, OTP purposes)
├── controllers/            # Request/response handling (one per feature)
├── Services/               # Business logic and validation rules
├── Repositories/           # Raw SQL queries (data access layer)
├── Routes/                 # Express routers, one per feature/module
├── middleware/             # Auth, role checks, uploads, request validation
├── Utils/                  # Small reusable helpers (JWT, cookies, OTP, mail, etc.)
├── Database/               # Numbered .sql migration files (run in order)
├── Scripts/
│   └── migrate.js          # Runs every file in Database/ against MySQL
└── uploads/temp/           # Temporary local storage before Cloudinary upload
```

Each feature generally follows this request flow:

```
Route → Middleware (auth / role / validation) → Controller → Service → Repository → MySQL
```

## Data Model

The schema (see `src/Database/*.sql`) covers:

- **sellers**, **addresses**, **business_details**, **bank_details** — seller onboarding data
- **users** — customer accounts
- **categories** — product categories (supports parent/child hierarchy)
- **products**, **product_images**, **inventory** — the product catalog
- **carts**, **cart_items** — shopping cart
- **orders**, **order_items**, **payments** — checkout and order fulfillment
- **reviews** — customer product reviews
- **wishlists**, **wishlist_items** — customer wishlists
- **verification_codes** — OTPs for email verification and password reset
- **customer_addresses** — saved shipping addresses for customers

## API Overview

All routes are prefixed with `/api`. Protected routes require a valid `access_token` cookie (set on login) and, where noted, a matching role.

| Base path                  | Module               | Notes                                          |
|-----------------------------|-----------------------|-------------------------------------------------|
| `/api/customers`            | Customer auth/profile | register, verify-email, login, forgot/reset password, profile, logout |
| `/api/customer-addresses`   | Customer addresses    | CRUD for saved addresses                        |
| `/api/customer-cart`        | Customer cart         | add/view/update/remove cart items               |
| `/api/customer-wishlist`    | Customer wishlist     | add/view/remove wishlist items                  |
| `/api/customer-orders`      | Customer orders       | place order, list, view, cancel                 |
| `/api/customer-payments`    | Customer payments     | make payment, view payment for an order         |
| `/api/customer-products`    | Customer products     | browse/search products                          |
| `/api/customer-reviews`     | Customer reviews      | add/view/update/delete reviews                  |
| `/api/customer-home`        | Customer home         | homepage data (e.g. featured products)          |
| `/api/seller`                | Seller auth/profile  | OTP-based register, login, profile, orders, revenue, logout |
| `/api/seller/dashboard`      | Seller dashboard     | summary, product stats, recent products, category breakdown |
| `/api/products` / `/api/my-products` | Products      | seller's product CRUD + image upload             |
| `/api/categories`            | Categories           | create/list/update/delete (admin-managed, customer-readable) |
| `/api/ai`                     | AI assistant         | Gemini-powered shopping chat                     |
| `/api/admin`                  | Admin auth           | login, plus mounted seller/product admin routes  |
| `/api/admin/sellers`          | Admin → sellers      | list, view, approve/suspend                      |
| `/api/admin/dashboard`        | Admin dashboard      | overall marketplace statistics                    |
| `/api/admin/orders`           | Admin → orders       | list, view, update order status                   |

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- A running MySQL server

### Installation

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

> ```bash
> npm install express cors dotenv mysql2 cookie-parser jsonwebtoken bcrypt \
>   multer cloudinary nodemailer express-validator @google/genai
> ```

### Environment Variables

Create a `.env` file in the project root with:

```env
# Server
CLIENT_URL=http://localhost:3000

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=markethive

# JWT
JWT_SECRET=your_jwt_secret
JWT_VERIFICATION_SECRET=your_verification_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### Database Setup

Run the migration script to create all tables in order:

```bash
node src/Scripts/migrate.js
```

This executes every `.sql` file in `src/Database/` against the configured database, logging `True`/`False` per file so you can see which migrations succeeded.

### Running the Server

```bash
node src/server.js
```

The API will be available at `http://localhost:5000`.

## Notes

- Payments are currently **simulated**: Cash on Delivery orders are marked `PENDING`, and any other method is immediately marked `SUCCESS` with a generated transaction ID — there is no real payment gateway integrated yet.
- Uploaded product images are first written to `src/uploads/temp/` by Multer, then pushed to Cloudinary and deleted locally.
- Comments have been added throughout the codebase (file-level headers and inline explanations) to make the request flow easier to follow.
