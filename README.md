# NEST — Handcrafted Miniatures

An installable web shop (PWA) for NEST: a cobalt-and-cream café-menu storefront where a 3D rabbit leaps from stand to stand as you scroll, the earrings swing when it lands, and orders go out as a ready-made bill on WhatsApp.

**Built with:** React 18 · Vite · Tailwind CSS · three.js + React Three Fiber (the rabbit) · GSAP (stand physics, scroll) · vite-plugin-pwa (install + offline).

---

## Put it online for free with GitHub Pages (step by step)

You don't need to install anything on your computer for this route. GitHub builds the site for you.

### 1. Create a GitHub account
Go to **github.com** → **Sign up** (free). Verify your email.

### 2. Create a repository
1. Click **+** (top right) → **New repository**.
2. **Repository name:** `nest-store` (any name works — it becomes part of your web address).
3. Choose **Public** (GitHub Pages is free for public repositories).
4. Leave everything else unticked → **Create repository**.

### 3. Upload the project files
1. Unzip `nest-store.zip` on your computer.
2. In your new repository, click **uploading an existing file** (or **Add file → Upload files**).
3. Open the unzipped `nest-store` folder, select **everything inside it** (not the folder itself) and drag it into the browser window.
   - ⚠️ The `.github` folder is hidden on Mac/Windows by default. It **must** be uploaded — it contains the build robot.
     - **Mac:** in Finder press **Cmd + Shift + .** to show hidden files.
     - **Windows:** File Explorer → **View → Show → Hidden items**.
   - If dragging the `.github` folder doesn't work in your browser, use **Add file → Create new file**, type the name `.github/workflows/deploy.yml`, paste the contents of that file from the zip, and commit.
4. Scroll down → **Commit changes**.

### 4. Switch on GitHub Pages
1. In the repository go to **Settings → Pages** (left sidebar).
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

### 5. Wait for the build (about 1–2 minutes)
Open the **Actions** tab. You'll see "Deploy to GitHub Pages" running. When it shows a green ✓, your site is live at:

```
https://<your-github-username>.github.io/nest-store/
```

(If the first run started before you picked "GitHub Actions" in step 4 and failed, open it and click **Re-run all jobs**.)

### 6. Install it as an app
- **Android / Chrome / Edge:** open the site → tap **Install app** in the header (or the browser menu → *Install app*).
- **iPhone / iPad (Safari):** open the site → **Share** → **Add to Home Screen**. The site also shows these steps when you tap *Install app*.

### Updating the site later
Edit or upload files in the repository (for example a new photo in `public/assets/`). Every commit to `main` rebuilds and republishes automatically. Installed apps pick up the new version the next time they're opened.

---

## Make it yours

| What | Where |
|---|---|
| WhatsApp number, UPI ID, free-shipping threshold, shipping fee | `src/config/store.js` → `STORE` |
| Product photos | `public/assets/` (file names listed in `src/config/store.js` → `ASSETS`) |
| Product names, prices, descriptions, specs | `src/data/products.js` |
| Colours & fonts | `tailwind.config.js`, `src/index.css` |
| App name & icon | `vite.config.js` (manifest), `public/icons/`, `public/favicon.svg` |

**Product photos:** transparent `.webp` cutouts of **one charm, without the ear-wire** (the stand draws the gold hook and mirrors the charm into a pair). `chilli-cutout.webp` and `rabbit-idle.webp` are already included, made from your images. Any photo that's missing simply shows the built-in illustration, so the site always looks complete.

---

## Run it on your computer (optional)

1. Install **Node.js 20 LTS** from nodejs.org.
2. In a terminal, inside the project folder:
   ```bash
   npm install
   npm run dev      # live preview at http://localhost:5173
   npm run build    # production build into /dist
   npm run preview  # test the production build (including the installable app)
   ```

## Other free hosts

The same project works on **Netlify**, **Vercel** or **Cloudflare Pages**: import the GitHub repository, set the build command to `npm run build` and the output folder to `dist`. No `BASE_PATH` is needed there.

---

## How the rabbit works (for developers)

- `src/three/RabbitStage.jsx` — a fixed, transparent, full-screen canvas with an orthographic camera (1 unit = 1 CSS pixel), so the 3D rabbit can land exactly on HTML elements. Each hop is: anticipation crouch → launch → true ballistic parabola (pitch follows the velocity, ears and legs on damped springs) → spring squash + ear flop on touchdown. Tapping the perched rabbit triggers a backflip. Clover leaves are instanced 3D particles with gravity and drag.
- `src/three/RabbitModel.jsx` — the procedural rabbit (no model download), coloured from the watercolour mascot.
- `src/lib/rabbitBus.js` — the shared channel: the page decides *where* the rabbit should be (scroll position), the 3D director decides *how* it gets there.
- `src/lib/standPhysics.js` — GSAP bar flex, asymmetric pendulum swing (`transformOrigin: "50% 6px"`), 3D stud jiggle and blossom sway.
- The 3D code is split into its own chunk and loads after the page paints. Without WebGL the poster rabbit simply stays in its bowl; with *Reduce motion* turned on, the rabbit cross-fades between stands instead of leaping.
