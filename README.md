# BrindaWorld

Educational gaming platform for girls aged 6–14.
Domain: [brindaworld.ca](https://brindaworld.ca)

## Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React + Vite                  |
| Backend  | Express.js (Node)             |
| Database | MySQL (Hostinger)             |
| Auth     | Supabase                      |
| Payments | Stripe                        |
| Hosting  | Hostinger (client + server)   |

## Project Structure

```
brindaworld/
├── client/          React + Vite frontend
├── server/          Express.js API
├── package.json     Root scripts
├── .env.example     Environment variable template
└── .gitignore
```

## Getting Started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure environment

```bash
cp .env.example server/.env
cp .env.example client/.env
# Fill in your credentials in both .env files
```

### 3. Run in development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 4. Build for production

```bash
npm run build
```

Outputs static files to `client/dist/`.

## API Endpoints

| Method | Path        | Description  |
|--------|-------------|--------------|
| GET    | /api/health | Health check |

## Deployment (Hostinger)

1. Upload `client/dist/` contents to `public_html/`
2. The `client/public/.htaccess` handles React client-side routing
3. Upload `server/` to a Node.js app directory
4. Set environment variables in Hostinger control panel
5. Start the server with `npm start`
