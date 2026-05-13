# Project Guidelines

## Internationalization

All user-facing text strings in the frontend must be internationalized using the project's i18n system (`resources/js/i18n/da.js` and `resources/js/i18n/en.js`). Never hardcode display text in JSX — always add the key to both translation files and reference it via `t('key')` from `useLanguage()`.
