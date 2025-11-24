# API MedApp (MVP)
Base URL `/api`, header `tenant-id` + JWT sauf auth. Pagination `?page&limit`.

- **Auth** : POST `/auth/register` (soignants en `pending`), `/auth/login`, `/auth/refresh`, `/auth/forgot|reset`.
- **Users/Consent** : GET/PATCH `/users/me`; POST `/consent`; GET `/consent/export`.
- **Référentiels** : GET `/hospitals`, `/services`, `/staff`, `/staff/:id/availability`.
- **Rendez-vous** : POST `/appointments`; PATCH `/appointments/:id/confirm|cancel`; GET `/appointments` (filtres patient/staff/date).
- **Consultations & dossier** : POST `/consultations`; GET `/medical-records/:patientId`; POST `/documents` (upload signé).
- **Notifications** : POST `/notifications/test`; GET `/notifications`.
- **Audit/Reporting** : GET `/audit` (Admin); GET `/reporting/appointments` (V2-ready).
