# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



<!-- This is the to explore on what commit we are standing  -->
<!-- Commits start from 1.0.0 -->
<!-- Ad then they will update in the order 1.0.1 -->
<!-- if the third one ends then the second order will update  1.1.0-->
<!-- if second is ends third will update 2.0.0 -->

<!-- making a new commit  -->
<!-- 1.0.1 -->

<!-- This thing i forgot to add i need to add this also  -->
<!-- 
// In your login function, send device info
const deviceFingerprint = {
    userAgent: navigator.userAgent,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
};

const response = await apiConnector("POST", login, {
    email: email,
    password: pass,
    deviceInfo: deviceFingerprint
});

// Server validates device on each request -->


<!-- Rememebr when  the appis build like 100 percentage make the HttpOnly  true so that it can be blocked byt the atackers  -->


<!-- // "dev": "concurrently -n \"client,server\" -c \"bgRed,bgBlue\" \"npm start\" \"npm run server\"" -->