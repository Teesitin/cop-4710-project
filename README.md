# Job Tracker (SvelteKit + Firebase Data Connect)

This project is a simple job tracking app built with:

- SvelteKit
- TailwindCSS
- Firebase Data Connect

---

## 1. Clone the Project

```sh
git clone <your-repo-url>
cd cop-4710-project
```

---

## 2. Install Dependencies

Using pnpm:

```sh
pnpm install
```

---

## 3. Firebase Setup

### Login to Firebase

```sh
firebase login
```

### Set the project

```sh
firebase use --add
```

Select:

```
cop-4710-ab900
```

---

## 4. Initialize Data Connect (only once)

If not already initialized:

```sh
firebase init dataconnect
```

Then:

```sh
firebase init dataconnect:sdk
```

---

## 5. Generate SDK

Any time schema or queries change:

```sh
firebase dataconnect:sdk:generate
```

---

## 6. Deploy Data Connect

```sh
firebase deploy --only dataconnect
```

---

## 7. Run the App

```sh
pnpm run dev
```

Then open:

```
http://localhost:5173
```

---

## 8. Project Structure (important parts)

```
src/
  routes/
    +page.svelte       # main UI
  dataconnect-generated/  # auto-generated SDK (DO NOT EDIT)

dataconnect/
  example/
    queries.gql        # queries + mutations
```

---

## 9. Notes

- Always run **generate + deploy** after changing `.gql` files
- The generated SDK is required for the frontend to work
- Do not manually edit `dataconnect-generated`

---

## 10. Common Commands

```sh
# regenerate SDK
firebase dataconnect:sdk:generate

# deploy backend
firebase deploy --only dataconnect

# run frontend
pnpm run dev
```