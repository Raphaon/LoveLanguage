# MedApp (prototype monorepo)

Socle Ionic/Angular + NestJS/Prisma + PostgreSQL/Redis pour MVP e-santé multi-tenant. Le fichier PO des formulaires n'est pas disponible ici : les champs par défaut sont décrits dans `apps/mobile-ionic/src/onboarding-form.md`.

## Structure
- `apps/api-nest` : API NestJS (JWT, Prisma, Swagger).
- `apps/mobile-ionic` : Ionic/Angular, NgRx, offline-first.
- `packages/shared` : types/RBAC/validations.
- `infra/` : docker-compose Postgres/Redis.
- Docs : `ARCHITECTURE.md`, `API.md`, `SECURITY.md`, `CONSENT.md`.

## Démarrage
```bash
# Infra
docker compose -f infra/docker-compose.yml up -d
# API
cd apps/api-nest && npm install && npx prisma migrate dev --name init && npm run start:dev
# Mobile
cd apps/mobile-ionic && npm install && npm start
```
Swagger : http://localhost:3000/docs

## Tests
- API : `npm run test` / `npm run test:e2e` (Jest + Supertest, seeds multi-tenant).
- Mobile : `npm test` / `npm run e2e` (Cypress avec API mockée).

## RBAC & tenants
Header `tenant-id` requis. Rôles Patient/Doctor/Nurse/Admin et permissions dans `packages/shared/src/rbac.ts`.

## V2
Modules payments (Stripe), téléconsultation (Twilio/Jitsi), reporting; RLS Postgres + KMS externe pour rotation de clé.
