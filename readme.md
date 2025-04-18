### SocialFi Backend

---

A full-featured backend for a social media app built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**. It includes authentication, posts, comments, likes, follows, and file upload support.

---

### Tech Stack

- **Node.js**
- **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/TheCoderAdi/socialfi-backend.git
cd socialfi-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root:

```
DATABASE_URL="postgresql://username:password@localhost:5432/socialfi"
PORT=5000
JWT_SECRET=somethingsecure
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the server

```bash
npm run dev
```

---

## Project Structure

```
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.js
├── package.json
├── prisma
    ├── migrations
    │   ├── 20250408140142_init
    │   │   └── migration.sql
    │   └── migration_lock.toml
    └── schema.prisma
├── src
    ├── config
    │   └── prisma.ts
    ├── controllers
    │   ├── auth.ts
    │   ├── comment.ts
    │   ├── like.ts
    │   ├── post.ts
    │   └── user.ts
    ├── index.ts
    ├── middlewares
    │   ├── auth.ts
    │   ├── error.ts
    │   ├── multer.ts
    │   └── rateLimiter.ts
    ├── routes
    │   ├── auth.ts
    │   ├── comment.ts
    │   ├── like.ts
    │   ├── post.ts
    │   └── user.ts
    ├── types
    │   ├── express.d.ts
    │   └── types.ts
    └── utils
    │   ├── error.ts
    │   ├── helper.ts
    │   ├── jwt.ts
    │   └── sendToken.ts
├── tsconfig.json
└── yarn.lock
```

---

## API Endpoints

### Auth

- `POST /api/v1/auth/register` – Register new user
- `POST /api/v1/auth/login` – Login
- `GET /api/v1/auth/logout` – Logout

---

### Users

- `GET /users/:id` – Get user profile
- `PUT /users/:id` – Update profile
- `GET /users/:id/followers` – List followers
- `GET /users/:id/following` – List following
- `POST /users/:id/follow` – Follow user
- `POST /users/:id/unfollow` – Unfollow user
- `DELETE /users/:id`- Delete user

---

### Posts

- `POST /posts/` – Create post
- `GET /posts/` – Feed (from followed users)
- `GET /posts/:id` – View post
- `DELETE /posts/:id` – Delete post

---

### Comments

- `POST /posts/:id/comments` – Add comment
- `GET /posts/:id/comments` – Get comments

---

### Likes

- `POST /posts/:id/like` – Like post
- `POST /posts/:id/unlike` – Unlike post

---

### File Upload

Uploaded images can be accessed via:

- `GET /uploads/<filename>`

## GraphQL Support

This project also includes **GraphQL** support for flexible user profile management using Apollo Server and Express.

#### Queries

- `fetchProfile(id: ID!): User` – Get a user's profile by ID.

#### Mutations

- `createUser(input: CreateUserInput!): CreateUserResponse` – Register a new user.
- `updateUser(input: UpdateUserInput!): User` – Update user profile fields.
- `deleteUser: DeleteUserResponse` – Delete the currently authenticated user.
