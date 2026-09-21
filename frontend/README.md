# React + Vite

## Gemini assistant

The site includes a floating Gemini chat assistant. To enable responses, copy `.env.example` to `.env`, add a Gemini API key from Google AI Studio, and restart Vite:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

The assistant uses Gemini's free-tier API model by default. Because Vite exposes `VITE_` variables in the browser, use a restricted development key and move the request behind a server endpoint before production.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
