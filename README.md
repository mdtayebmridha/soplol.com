This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3007](http://localhost:3007) with your browser to see the result.

## Store database

The store uses PostgreSQL through Prisma. On the VPS, use a dedicated database named `soplol_store` and app role `soplol_app`; keep PostgreSQL bound to localhost so it is not exposed to the public network. Set `DATABASE_URL` and `DIRECT_URL` in the deployment environment to the same local PostgreSQL URL (there is no pooler). `.env.example` shows the variable names and local URL shape; replace the placeholder password privately. For local development from another machine, use an SSH tunnel rather than exposing port 5432. Keep database credentials out of Git and chat.

For local development, place env files such as `.env.local` in the project root beside `package.json`; Next.js does not load `src/.env.local`. The root `.env.local` is ignored by Git.

After adding both URLs, run `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed` from the project root.
After deployment, `GET /api/health/database` reports whether `DATABASE_URL` is configured and the app can execute a database query; it does not expose credentials or database contents.

## Admin access

Admin routes are private and require the `ADMIN_ACCESS_KEY` environment variable. Set it to a strong random secret of at least 32 characters in your local environment or deployment settings. Sign in at `/admin-access`; without a configured key, admin routes remain locked.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Customer sign-up and sign-in use database-backed customer records, scrypt password hashes, and revocable HTTP-only session cookies. Orders can be placed as a guest; signed-in orders are linked to the customer account.

Online payment uses the SSLCommerz hosted checkout flow when valid server-side credentials and `APP_URL` are configured. The app validates provider callbacks server-to-server before marking an order paid. Until credentials are configured, online payment remains disabled and Cash on Delivery is the only available option. Keep merchant credentials out of client-side variables.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
