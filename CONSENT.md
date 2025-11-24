# Consentement & audit

- Consentement affiché à l'inscription (double opt-in). Champs : version, scopes (notifications, partage dossier, télémed V2), timestamp, IP/device.
- Enregistrement via `POST /consent`; refus = compte limité. Soignants validés par admin séparément.
- Audit : événements `consent.accepted|revoked` dans `AuditLog`.
- Export : `GET /consent/export` + `/records/export` (JSON/PDF chiffré avant livraison).
- Révocation : `DELETE /consent` ou mise à jour de scopes → suspension des traitements concernés.
- Conservation : historique complet, anonymisation après rétention configurée (env).
