# Next.js + Supabase Auth Panel

A modern user authentication and management panel built using **Next.js**, **Supabase**, **Material UI**, and **PostgreSQL**. This project extends a ready-to-use Next.js + Supabase boilerplate and provides a fully functional admin dashboard to manage users securely and efficiently.

---

🚀 **Live App:** 👉 [Click here](https://nextjs-supabase-auth-panel.onrender.com)  
⚠️ *Note: The app may take up to 60 seconds to load on first visit due to Render's free tier cold start.*

---

## 🛠 Tech Stack

* **Next.js** – React-based framework with SSR and App Router.
* **Supabase** – Backend-as-a-service for authentication and PostgreSQL database.
* **Material UI** – Component library for building responsive UI.
* **PostgreSQL** – Used via Supabase to persist user data.
* **Supabase Auth** – Handles registration, login, and session management.
* **Supabase Admin API** – Enables secure actions like deleting users from `auth.users`.

---

## 📦 Features

✅ **Authentication**

* Email/password registration and login using Supabase Auth
* Session persistence using Supabase client
* Auth-protected admin route (`/admin/users`)

✅ **Admin Panel (Dashboard)**

* View users from `public.users` table
* Columns: checkbox, name, email, last login, status (active/blocked)
* Fetches data server-side using Supabase queries

✅ **Table Interactivity**

* Default sorting by `last_login` (most recent first)
* Select/deselect individual users using checkboxes
* "Select All" checkbox in table header

✅ **Toolbar Actions**

* Block, unblock, and delete multiple users at once
* Toolbar buttons only appear when users are selected
* UI feedback and tooltips on all action buttons

✅ **Data Updates**

* `Block`: Updates `status` to `"blocked"` in `public.users`
* `Unblock`: Sets `status` to `"active"` in `public.users`
* `Delete`: Removes from `public.users` and from `auth.users` using Supabase Admin API

✅ **Edge Case Handling**

* Automatic logout if current user is blocked or deleted
* Session status is verified on every page load

✅ **Responsive Design & UX**

* Styled with Material UI for a responsive layout
* Tooltips, error messages, and status alerts for better usability

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nextjs-supabase-auth-panel.git
cd nextjs-supabase-auth-panel
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file at the project root and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> Get these values from **Supabase Dashboard > Project Settings > API**.

### 4. Run the Development Server

```bash
npm run dev
```

---

## 🧠 How It Works

* **Routing**: Uses Next.js App Router with protected client-side navigation.
* **Authentication**: Supabase manages login sessions via cookies and client SDK.
* **Authorization**: Admin dashboard is only accessible to authenticated users; unauthenticated users are redirected.
* **Data Sync**: Mirrors `auth.users` into `public.users` via Supabase function trigger.
* **User Actions**: Toolbar actions modify data via Supabase’s `update`, `delete`, and Admin API endpoints.
* **State Management**: User selection and session handling done via React state and hooks.
* **Security**: Service role key used securely on server components only (never exposed to client).

---

## 📝 License

MIT License
