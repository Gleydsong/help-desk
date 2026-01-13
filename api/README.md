# Help Desk API

Backend for Help Desk (Node.js + Express + TypeScript + PostgreSQL + Prisma).

## Requirements
- Node.js 18+
- Docker (optional for local Postgres)

## Setup
```bash
cd api
cp .env.example .env
npm install
```

### Database (Docker)
```bash
docker-compose up -d
```

### Migrations + Seed
```bash
npm run prisma:migrate
npm run prisma:seed
```

### Run
```bash
npm run dev
```

## Tests
```bash
npm test
```

## Default seed credentials
- Admin: admin@helpdesk.local / Admin@123
- Techs: tech1@helpdesk.local / Tech1@123
         tech2@helpdesk.local / Tech2@123
         tech3@helpdesk.local / Tech3@123

## Notes
- Public registration: POST `/api/client/register`.
- Self-delete: DELETE `/api/me` (cascades tickets for clients).
- Uploads are stored in `uploads/` and served from `/uploads`.
- Render has an ephemeral filesystem. If you need persistent avatars, integrate a cloud storage provider and update the upload flow.
