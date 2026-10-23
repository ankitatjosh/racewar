# 3D Resume World Tour Racer — PWA

A fully static Progressive Web App. Upload this folder to any static web host. There is no build step and no server code.

```
resume-racer-pwa/
├── index.html              ← the game (works on desktop + mobile)
├── manifest.webmanifest    ← app name, icons, fullscreen + landscape
├── sw.js                   ← service worker (offline cache)
└── icons/                  ← 192 / 512 / maskable-512 PNG icons
```

## Requirements
- **HTTPS** is required for the service worker and "Install app". `http://localhost` also works for testing.
- Serve `manifest.webmanifest` as `application/manifest+json`. Most hosts already do this.
- Keep `sw.js` in the **same folder** as `index.html`, so it controls the whole app.

## Quick hosting options
| Host | How |
|---|---|
| **Netlify** | Drag the folder onto app.netlify.com/drop |
| **Vercel** | `npx vercel` inside the folder |
| **GitHub Pages** | Push the folder to a repo → Settings → Pages → deploy from branch |
| **Firebase Hosting** | `firebase init hosting` → public dir = this folder → `firebase deploy` |
| **nginx / Apache** | Copy the folder into the web root. Add `application/manifest+json webmanifest;` to nginx `mime.types` if needed |

Local test: `npx serve .` or `python3 -m http.server 8080`, then open http://localhost:8080

## Updating
After you change `index.html`, bump `VERSION` at the top of `sw.js` (for example `resume-racer-v5-2`). Returning players then get the new version on their next visit.

## Mobile behaviour
- On phones the game always plays in **landscape**. It goes fullscreen and locks the orientation on start (Android/Chrome, or an installed app). Where the lock isn't supported (iOS Safari), the game rotates itself.
- The HUD is just **score + speed** in a slim top bar, plus 4 touch buttons. All notifications appear as small snackbars in the top bar.
- Crashes, pedestrian hits, gem pickups, Overdrive and laps vibrate the phone. Android supports vibration. iOS Safari does not allow web vibration, so it is skipped there.
- Add `?mobile=1` or `?mobile=0` to the URL to force the mobile or desktop layout.
