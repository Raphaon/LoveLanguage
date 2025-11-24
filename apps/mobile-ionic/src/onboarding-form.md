# Onboarding & formulaires

Fichier PO indisponible ici : champs par défaut prêts à ajuster.

## Commun
Email, mot de passe (≥12 char + complexité) + confirmation, nom complet, téléphone E.164, langue/pays, consentement obligatoire, photo optionnelle.

## Patient
Date de naissance (≥18), genre (liste + libre), ville/pays, NIR optionnel (chiffré), contact d'urgence.

## Médecin
Spécialités (multi), numéro RPPS/équivalent, pays d'exercice, années d'expérience, certificats (PDF/JPG), hôpital/service principal, langues parlées, zone couverte, disponibilités initiales (créneaux par jour, durée 15/20/30min).

## Infirmier
Numéro pro, compétences, hôpital/service, zone d'intervention, disponibilités.

## Admin établissement
Super admin/Admin local, établissement, pays/fuseau, contact support.

UX : étapes rôle → identité → info pro/médicale → consentement → résumé; validations inline accessibles (`aria-live`). Brouillon offline via Storage; appel `POST /auth/register`, statut `pending` pour soignants.
