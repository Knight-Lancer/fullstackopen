# Full Stack Open — Exercise Solutions

My exercise solutions for [Full Stack Open](https://fullstackopen.com/en/), the University of Helsinki's course on modern web development.

This repository is organized by course part. Each application lives in its own folder and can be run independently.

## Repository structure

```text
fullstackopen/
├── part0/
│   ├── 0.4-new-note.md
│   ├── 0.5-spa.md
│   └── 0.6-new-note-spa.md
├── part1/
│   ├── courseinfo/
│   ├── unicafe/
│   └── anecdotes/
├── part2/
├── part3/
├── part4/
│   └── bloglist/
│       ├── controllers/
│       ├── models/
│       ├── tests/
│       ├── utils/
│       ├── app.js
│       ├── index.js
│       └── package.json
└── part5/
    ├── README.md
    ├── bloglist-frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── services/
    │   │   ├── App.jsx
    │   │   ├── main.jsx
    │   │   └── style.css
    │   ├── vite.config.js
    │   └── package.json
    └── bloglist-e2e/
        ├── tests/
        ├── playwright.config.js
        └── package.json
```

> This is the intended repository layout. The availability and completion status of Parts 2 and 3 are not verified here. Parts 4 and 5 are supplied together in the Part 5 project archive. Parts 2 and 3 remain unverified.

## Part 0 — Fundamentals of Web Apps

Sequence diagrams showing browser–server communication:

| Exercise | Description |
|---|---|
| 0.4 | Creating a new note in the traditional web app |
| 0.5 | Loading the single-page app (SPA) |
| 0.6 | Creating a new note in the SPA |

The diagrams are written in Mermaid inside Markdown files. They can be previewed in GitHub.

## Part 1 — Introduction to React

Three independent React applications:

| Folder | Exercises | Description |
|---|---|---|
| `courseinfo` | 1.1–1.5 | Course information, reusable components, and exercise totals |
| `unicafe` | 1.6–1.11 | Feedback buttons and statistics, including average and positive percentage |
| `anecdotes` | 1.12–1.14 | Random anecdotes, voting, and most-voted anecdote |

To run an application, open its folder and use:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite in the terminal. Run the commands separately in each application folder.

## Part 2 — Communicating with Server

Part 2 covers rendering collections, forms, server communication, and styling React applications. Add each exercise application's folder here as you complete it. This README does not claim any Part 2 exercises are finished.

## Part 3 — Programming a Server with Node.js and Express

Part 3 covers Express APIs, MongoDB, validation, deployment, and linting. Add the actual Part 3 project folder and any deployment link when available. This README does not claim a verified Part 3 deployment.

## Part 4 — Testing Express Servers, User Administration

**Application:** `part4/bloglist`  
**Exercises:** 4.1–4.23 (including starred exercises in the supplied project)

A REST API for blog posts, built with Node.js, Express, MongoDB/Mongoose, and automated tests. It includes blog creation and editing, user accounts, login, JWT authentication, and restrictions on deleting other users' blogs.

### Part 4 setup

Requirements: Node.js 22+, npm, and a MongoDB connection (local or MongoDB Atlas).

```bash
cd part4/bloglist
npm install
```

Copy `.env.example` to `.env` and configure the values:

```dotenv
PORT=3003
MONGODB_URI=mongodb://127.0.0.1:27017/bloglist
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/bloglist_test
SECRET=replace-with-a-long-random-secret
```

The MongoDB URLs above are examples. If using Atlas, substitute your actual connection strings. Keep `.env` out of version control. **Never point the test connection to your development or production database:** tests reset collections.

Start the backend:

```bash
npm run dev
```

Run checks:

```bash
npm run check
npm run test:unit
npm test
npm run lint
```

The full test suite requires MongoDB and installed dependencies. Passing syntax or unit tests alone does not prove the integration tests pass.

### Part 4 API endpoints

| Method | Endpoint | Description | Authorization |
|---|---|---|---|
| GET | `/api/blogs` | List blogs | Public |
| GET | `/api/blogs/:id` | Get a blog | Public |
| POST | `/api/blogs` | Create a blog | Bearer token |
| PUT | `/api/blogs/:id` | Update a blog | Public in this exercise implementation |
| DELETE | `/api/blogs/:id` | Delete a blog | Creator's Bearer token |
| GET | `/api/users` | List users | Public |
| POST | `/api/users` | Register a user | Public |
| POST | `/api/login` | Log in and receive token | Public |

Example registration request:

```bash
curl -X POST http://localhost:3003/api/users \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","name":"Alice","password":"secret123"}'
```

Example login request:

```bash
curl -X POST http://localhost:3003/api/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"secret123"}'
```

For authenticated endpoints, send `Authorization: Bearer YOUR_TOKEN`.

### Part 4 exercise map

| Exercises | Implementation |
|---|---|
| 4.1–4.2 | Blog API and modular Express project structure |
| 4.3–4.7 | Blog helper functions and unit tests |
| 4.8–4.12 | SuperTest API tests, JSON IDs, defaults, and validation |
| 4.13–4.14 | Delete and update operations with tests |
| 4.15–4.17 | User registration, validation, and blog ownership |
| 4.18–4.19 | JWT login and authenticated blog creation |
| 4.20–4.22 | Token/user middleware and creator-only deletion |
| 4.23 | Authentication-aware API tests |

The Part 4 application is **backend-only**; it does not need React or JSX.

## Part 5 — Testing React Apps, End-to-End Testing, and React Router

**Applications:** `part5/bloglist-frontend` and `part5/bloglist-e2e`  
**Exercises:** 5.1–5.31 (all 31 exercises represented in the cumulative implementation)

Part 5 turns the Part 4 Blog List REST API into a browser application. It adds user authentication, persistent login, blog creation and management, conditional rendering, automated component tests, full browser tests, URL-based navigation, and improved visual styling. It uses the Part 4 backend; there is no separate Part 5 backend.

### Features

- **Login and logout:** users sign in with their username and password; the JWT and user details are stored in browser local storage so the session survives a refresh. Logout clears them.
- **Blog management:** authenticated users can create blogs with a title, author, and URL. Blogs display in descending order of likes.
- **Blog details and likes:** users can expand blog details, visit individual blog URLs, and like blogs when signed in. The creator's information is preserved after a like.
- **Ownership-based deletion:** only the creator sees the remove button; the backend also checks ownership when processing deletion.
- **Notifications:** successful and unsuccessful actions display temporary feedback messages.
- **Forms and reusable components:** login and blog forms are separate components; the blog creation form can be shown or hidden.
- **Routes:** navigation and individual blog pages use React Router, with protected create and login routes.
- **Tests:** Vitest + React Testing Library component tests and Playwright end-to-end tests, including login, blog creation, liking, deletion, ownership, and ordering.
- **Styling:** responsive CSS for navigation, forms, notifications, and blog cards. The supplied implementation uses custom CSS rather than Material UI or Styled Components.

### Part 5 exercise-by-exercise description

| Exercise | What it implements or verifies |
|---|---|
| 5.1 | Login form and conditional display of blogs after login |
| 5.2 | Persistent login through local storage and logout |
| 5.3 | Creating new blog posts while authenticated |
| 5.4 | Temporary success and error notifications |
| 5.5 | Collapsible new-blog form, hidden by default |
| 5.6 | Separate blog form component with its own input state |
| 5.7 | Show/hide additional blog details |
| 5.8 | Increase blog likes through the backend API |
| 5.9 | Keep creator details visible after updating likes |
| 5.10 | Sort blog entries by number of likes, highest first |
| 5.11 | Creator-only delete control and confirmation dialog |
| 5.12 | ESLint configuration for the React application |
| 5.13 | Test that title and author are displayed without expanded details |
| 5.14 | Test that URL and likes appear after expanding details |
| 5.15 | Test that clicking Like twice invokes the handler twice |
| 5.16 | Test that the new-blog form submits correct blog data |
| 5.17 | Initialize Playwright and check the login form |
| 5.18 | Browser tests for successful and unsuccessful login |
| 5.19 | Browser test for creating a blog |
| 5.20 | Browser test for liking a blog |
| 5.21 | Browser test for deleting an owned blog |
| 5.22 | Browser test for creator-only visibility of deletion |
| 5.23 | Browser test for sorting blogs by likes |
| 5.24 | React Router navigation and login route |
| 5.25 | Individual blog view and authenticated liking |
| 5.26 | Separate blog creation route and redirects |
| 5.27 | Update component tests for routed blog details and user roles |
| 5.28 | Update Playwright tests for the routed application |
| 5.29 | Style login and new-blog forms |
| 5.30 | Style navigation and notifications |
| 5.31 | Style individual blog details |

These are **exercise implementations**, not a claim that the University of Helsinki has accepted or graded the submissions. This repository holds the final combined version rather than 31 separate snapshots.

### Part 5 routes

| URL | Purpose | Access |
|---|---|---|
| `/` | Blog list, sorted by likes, plus expandable details | Everyone |
| `/login` | Login form | Signed-out users |
| `/create` | New blog form | Signed-in users; otherwise redirects to `/login` |
| `/blogs/:id` | Individual blog details | Everyone can view; signed-in users can like; creators can delete |

### How to run Part 4 and Part 5 together

**Requirements:** Node.js 22.3 or newer, npm, and MongoDB (locally or via Atlas). Use a dedicated MongoDB database for tests.

1. **Start the backend** in a terminal:

   ```bash
   cd part4/bloglist
   npm install
   ```

   Copy `.env.example` to `.env` and configure:

   ```dotenv
   PORT=3003
   MONGODB_URI=mongodb://127.0.0.1:27017/bloglist
   TEST_MONGODB_URI=mongodb://127.0.0.1:27017/bloglist_test
   SECRET=replace-with-a-long-random-secret
   ```

   Then run `npm run dev`. The API listens at `http://127.0.0.1:3003` when `PORT=3003`.

2. **Start the frontend** in a second terminal:

   ```bash
   cd part5/bloglist-frontend
   npm install
   npm run dev
   ```

   Open `http://127.0.0.1:5173`. Vite forwards requests beginning with `/api` to the backend on port **3003**.

3. **Create a user** if the database is empty. In Git Bash, for example:

   ```bash
   curl -X POST http://127.0.0.1:3003/api/users \
     -H 'Content-Type: application/json' \
     -d '{"username":"alice","name":"Alice","password":"password123"}'
   ```

   Use that username and password on the `/login` page.

**Important:** run each `cd` command from the repository root, or adjust the path to your current folder. The frontend and backend must run simultaneously for normal use.

### How to run the tests

**Backend** (`part4/bloglist`):

```bash
npm run check
npm run test:unit
npm test
npm run lint
```

**Frontend** (`part5/bloglist-frontend`):

```bash
npm run lint
npm test
npm run build
```

**Browser end-to-end tests** (`part5/bloglist-e2e`): stop the development backend and start it in **test mode** using `npm run start:test` from `part4/bloglist`. Keep the frontend running in a second terminal. Then run:

```bash
cd part5/bloglist-e2e
npm install
npx playwright install chromium
npm test
```

You can use `npm run test:ui` to inspect browser tests interactively and `npm run test:report` to view the report. Playwright tests reset the **test database** through `/api/testing/reset` before tests. This endpoint is enabled only when `NODE_ENV=test`.

**Database safety:** `TEST_MONGODB_URI` must never point to development or production data. Reset and API tests delete test data. The test database must be separate from `MONGODB_URI`.

### Part 5 project dependencies

- **Frontend:** React 19, React DOM 19, React Router, Axios, Vite 6, CSS
- **Component testing:** Vitest 3, jsdom, React Testing Library, jest-dom, user-event
- **Browser testing:** Playwright
- **Backend reused from Part 4:** Node.js, Express, MongoDB/Mongoose, JWT, bcryptjs, SuperTest

The React source uses named imports such as `import { useState } from 'react'` instead of an unnecessary default React import.

### Validation status and limitations

The previous Part 4 unit test run reported **10 passing tests**, and source syntax and ZIP integrity checks were reported as passing. **The frontend build, lint, Vitest suite, and Playwright suite have not been verified as passing in a fully installed environment with MongoDB.** Run the commands above and resolve any failures before submitting the exercises as complete.

Local storage is used for authentication to meet the course exercises. For production use, evaluate XSS exposure and token-storage security separately.

## Technologies

- **Frontend:** React 19, JavaScript, Vite, HTML, CSS, React Router, Axios (Parts 1 and 5)
- **Backend:** Node.js, Express (Part 4)
- **Database:** MongoDB, Mongoose (Part 4)
- **Authentication:** JSON Web Tokens, password hashing (Part 4)
- **Testing:** Node.js test runner, SuperTest, Vitest, React Testing Library, Playwright (Parts 4 and 5)

## Exercise submission

Submit exercise counts through the [Full Stack Open submission system](https://studies.cs.helsinki.fi/stats/courses/fullstackopen). Review the [official course instructions](https://fullstackopen.com/en/) for current requirements. This repository README does not indicate that exercises have been submitted or accepted.

## Notes

- Each application should have its own `package.json` where applicable.
- Do not commit `.env`, API secrets, database passwords, or `node_modules`.
- Run backend integration tests against a dedicated test database.
- Update this README as new parts are completed and verified. Parts 2 and 3 are still unverified.

## Course

[Full Stack Open — University of Helsinki](https://fullstackopen.com/en/)
