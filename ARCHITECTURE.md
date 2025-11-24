# MedApp – Architecture (MVP → V2)

- **Monorepo** : `apps/api-nest` (NestJS/Prisma), `apps/mobile-ionic` (Ionic/Angular), `packages/shared` (types/RBAC), `infra/` (db/redis).
- **ORM : Prisma** (types partagés, migrations, hooks audit/chiffrement). Multi-tenant par colonne `tenantId` + filtres Prisma; RLS activable V2.
- **RBAC** : rôles Patient/Doctor/Nurse/Admin + permissions dans `packages/shared/src/rbac.ts`; décorateur `@Roles()` + guard policies.
- **Sécurité** : JWT access/refresh, bcrypt, TLS (mkcert dev), audit middleware, consentement versionné, chiffrement AES-256-GCM pour données médicales, rate limiting Redis.
- **Notifications** : adapters FCM + SMTP (queue Redis) pour confirmations et rappels 24h/1h.
- **Offline mobile** : cache SQLite, file `pendingActions` pour RDV hors-ligne, réconciliation à la reconnexion.
- **I18n/Accessibilité** : ngx-translate, messages API i18n, ARIA/taille dynamique.

## Diagramme (texte)
```
[Ionic] --HTTPS--> [API Nest Gateway] --Prisma--> [PostgreSQL]
   |                              |--> Redis (queues/ratelimit)
   |                              |--> Adapters (FCM/SMTP)
[SQLite offline] <---- sync ----> [Sync cron]
```

## Domaines (API)
Auth | Users/Tenants | Hospitals/Services/Units/Staff | Appointments | Consultations & Medical Records | Documents | Notifications | Audit/Consent | Reporting/Payments/Telemed (V2).

## Flux clés
1. Inscription (formulaire rôle) → `/auth/register` → validation admin (soignants) → login → consentement stocké.
2. Recherche RDV : `/services` + `/staff/availability` → `/appointments` (`requested`) → confirmation → notifications.
3. Consultation : ouverture RDV confirmé → `Consultation` + documents (URL signée) → AuditLog lecture/écriture.
4. Offline : actions en attente rejouées; conflits résolus par statut `pending_sync` → `requested`.

## Calendrier & dispo
- `StaffAvailability` (créneaux récurrents + exceptions) + contrôle anti-chevauchement sur RDV confirmés.
- Suggestion par service/spécialité + proximité (pays/ville) + disponibilité la plus proche.

## CI/CD
GitHub Actions : lint, tests API/mobile, build, `prisma migrate diff` dry-run, build APK debug. Envs via `.env.example` (secrets en CI).
