# Sécurité MedApp

## Menaces
Accès non autorisé aux PHI, escalade RBAC, fuite documents, DoS/brute-force.

## Contrôles
- JWT signé (RS256 conseillé), refresh rotatif, bcrypt cost 12.
- Guard RBAC + header `tenant-id`, filtres Prisma par tenant.
- TLS partout; champs sensibles chiffrés AES-256-GCM (`DATA_KEY`).
- AuditLog append-only (acteur, action, entité, IP, tenant).
- Uploads limités 10MB, types whitelist, scan antivirus stub, URL signées S3/minio.
- Rate limiting Redis + lock progressif login/forgot.
- Logs sans PII; requestId pour corrélation.

## Conformité
Consentement opt-in, retrait possible; export dossier/consentement; anonymisation après rétention; backups chiffrés; environnements isolés.

## Durcissement
CSP/HSTS/XCTO/XFO/Referrer-Policy, CORS strict, validation DTO + Zod côté client, tests RBAC automatisés.
