# Thème CupidArrow (Ionic + Angular)

Ce thème applique les tokens CupidArrow pour garantir une expérience cohérente, accessible et performante sur mobile (Ionic/Angular).

## Principes clés
- **Design tokens unifiés** dans `src/theme/variables.scss` + export JSON (`src/theme/cupid-tokens.json`).
- **Fond gradient + cartes vitreuses** pour l’ADN CupidArrow.
- **Accessibilité AA** : contrastes élevés, focus visible (`--focus-outline`), cibles généreuses.
- **No network** : polices systèmes uniquement, aucun asset distant.

## Migration rapide (ancien → CupidArrow)
| Ancien | Nouveau |
| --- | --- |
| Couleurs Ionics par défaut | Tokens `--ca-*` mappés sur `--ion-color-*` |
| Boutons `ion-button` stylés globalement | `<cupid-button variant="primary|secondary|outline">` |
| Cartes `ion-card` | `<cupid-card>` avec `padding="sm|md|lg"` |
| Chip `ion-chip` actif | `<cupid-chip [active]="...">` |
| Barre supérieure `ion-toolbar` | `<cupid-toolbar>` (title + retour optionnel) |
| États vides custom | `<cupid-empty-state>` |
| Loaders dispersés | `<cupid-loader [lines]="4">` |

## Checklist a11y
- Focus visible sur tous les contrôles (`:focus-visible`).
- Labels associés aux champs (`for` + `id`).
- Couleurs contrastées (tokens CupidArrow ≥ AA).
- Hit-area > 44x44 pour chips, boutons, toggles.
- `aria-live` sur loaders/toasts lorsque pertinent.

## Utilisation rapide
```html
<cupid-button variant="secondary" size="sm">Action</cupid-button>
<cupid-card title="Section" subtitle="CupidArrow">
  <p>Contenu carte</p>
</cupid-card>
<cupid-chip [active]="true">Filtre</cupid-chip>
```

### Formulaires
- Utiliser la classe utilitaire `.ca-form-field` + `.ca-form-control`.
- États : ajouter `.error` sur le contrôle et `.ca-form-error` pour le message.

### Thème & stockage
- `ThemeService` (`src/app/theme/theme.service.ts`) détecte `prefers-color-scheme`, applique la classe `ca-light`/`ca-dark` et persiste la préférence via `StorageService` (`cupid_theme_preference`).
- `color-scheme` est synchronisé pour les composants natifs.

## Do / Don’t
- **Do** : utiliser les tokens plutôt que des valeurs hexadécimales en dur.
- **Do** : privilégier les composants Cupid pour garder la cohérence.
- **Don’t** : importer des polices externes ou écraser les variables Ionics globales sans passer par les tokens.
- **Don’t** : masquer les focus rings.

## Tests ajoutés
- Unit: `ThemeService` (préférence + classList), `CupidButtonComponent` (variants/disabled).
- E2E léger: navigation, formulaire profil et toggle thème (Playwright stub friendly).

## Ressources utiles
- Tokens SCSS: `src/theme/variables.scss`
- Tokens JSON: `src/theme/cupid-tokens.json`
- Global helpers: `src/global.scss`
- Composants Cupid: `src/components/cupid/**`
- Pages exemples: `gestures`, `profile-setup`
