# Note Taking Application API

A RESTful API for a simple note-taking application featuring Google OAuth 2.0 for authentication and MongoDB for data storage.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Google OAuth 2.0 Setup](#google-oauth-20-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints) (Optional: Add details later)

## Getting Started

Follow these instructions to get the API server up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Access to [Google Cloud Console](https://console.cloud.google.com/) for OAuth setup.
- [MongoDB](https://www.mongodb.com/) (Ensure you have a running MongoDB instance).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:arepstack/note-taking-application.git
    cd note-taking-application
    ```
2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

## Google OAuth 2.0 Setup

This application uses Google OAuth 2.0 for user authentication. You need to configure credentials in the Google Cloud Console.

1.  **Go to Google Cloud Console:** Navigate to <https://console.cloud.google.com/>.
2.  **Create/Select Project:** Create a new project or select an existing one.
3.  **Enable APIs:**
    *   Go to "APIs & Services" > "Library".
    *   Search for and enable the "Google People API" (or any other Google APIs your application might need).
4.  **Configure OAuth Consent Screen:**
    *   Go to "APIs & Services" > "OAuth consent screen".
    *   Choose "External" (unless restricted to a Google Workspace org).
    *   Fill in the required application details (App name, User support email, Developer contact information).
    *   Add necessary scopes (e.g., `openid`, `profile`, `email`).
    *   Add test users while your app is in testing phase.
5.  **Create OAuth 2.0 Credentials:**
    *   Go to "APIs & Services" > "Credentials".
    *   Click "+ CREATE CREDENTIALS" and select "OAuth client ID".
    *   Choose "Web application" as the Application type.
    *   Give it a name (e.g., "Note Taking App Dev").
    *   **Add Authorized redirect URIs:** Add the URI where Google will redirect users after authentication. This should point back to your API's callback handler (e.g., `http://localhost:3000/auth/google/redirect` - *adjust the port and path according to your API setup*).
    *   Click "Create".
6.  **Copy Credentials:** Note down the **Client ID** and **Client Secret**. You will need these in the next step.

## Configuration

The application requires environment variables for configuration, including the Google OAuth credentials and MongoDB connection string.

1.  **Modify the `.env` file** in the root directory of the project.
2.  **Replace the following placeholder** in the `.env` file, replacing the placeholder values with your actual credentials and settings:

    ```dotenv
    # Google OAuth Credentials
    GOOGLE_CLIENT_ID=<your-google-client-id-here>
    GOOGLE_CLIENT_SECRET=<your-google-client-secret-here>

    # Session Secret (replace with a long, random string)
    JWT_SECRET=<your-very-strong-jwt-secret>

    # User role for created user (ADMIN / REGULAR_USER)
    USER_ROLE=<your-user-role-here>

    # Replace with a valid test token for test cases
    REGULAR_USER_TOKEN=<your-regular-user-token-here>
    ADMIN_TOKEN=<your-admin-token-here>
    ```

## Running the Application

1.  **Start the development server:**
    ```bash
    npm run start:dev
    ```
    *or
    ```bash
    yarn start
    ```

2.  The API server should now be running on the port specified in your `.env` file (e.g., `http://localhost:3000`). Ensure your MongoDB instance is also running and accessible.

## API Endpoints

*   `GET /auth/google` - Initiates the Google OAuth (Run this on any browser to get a access token. The USER_ROLE specified in your `.env` file will be the role of the access token)
*   `POST /api/notes` - Creates a new note.
*   `GET /api/notes?page=1&limit=5` - Retrieve a list of notes for the authenticated user. (With pagination)
*   `GET /api/notes/:noteId` - Retrieve a specific note by ID
*   `PUT /api/notes/:noteId` - Update a specific note by ID
*   `DELETE /api/notes/:noteId` - Delete a specific note by ID

## Sample API Requests

Use the following `curl` examples to interact with the API endpoints. Replace `<your-access-token-here>` with a valid JWT access token and `:noteId` with an actual note ID.

### Create a New Note
```bash
curl --location 'http://localhost:3000/api/notes' \
--header 'Authorization: Bearer <your-access-token-here>' \
--header 'Content-Type: application/json' \
--data '{
  "title": "My New Note",
  "content": "This is the content of my new note.",
  "tags": ["work", "important", "urgent"],
  "category": "Personal"
}'
```

### Retrieve All Notes (with Pagination)
```bash
curl --location 'http://localhost:3000/api/notes?page=1&limit=5' \
--header 'Authorization: Bearer <your-access-token-here>'
```

### Retrieve a Specific Note by ID
```bash
curl --location 'http://localhost:3000/api/notes/<noteId>' \
--header 'Authorization: Bearer <your-access-token-here>'
```

### Update an Existing Note
```bash
curl --location --request PUT 'http://localhost:3000/api/notes/<noteId>' \
--header 'Authorization: Bearer <your-access-token-here>' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Updated Note Title",
  "content": "Updated content for the note.",
  "tags": ["home", "reminder", "low priority"],
  "category": "Work"
}'
```

### Delete a Note
```bash
curl --location --request DELETE 'http://localhost:3000/api/notes/<noteId>' \
--header 'Authorization: Bearer <your-access-token-here>'
```

## Running the Test cases

This project includes end-to-end (e2e) tests, primarily defined in `app.e2e-spec.ts`.

To run these tests, first ensure you have installed all the necessary development dependencies:

```bash
npm install
# or if you use yarn:
yarn install
```

Then, execute the specific command for end-to-end tests in your terminal:
```bash
npm run test:e2e
```

Important: Make sure any required environment variables for testing (e.g., MongoDB Connection String, Google OAuth Credentials, specific test user tokens like REGULAR_USER_TOKEN and ADMIN_TOKEN) are properly configured in your `.env` file. 