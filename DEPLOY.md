# How to Launch RDPFast 🚀

Your high-performance RDP selling platform is built. To get a public link (e.g., `rdpfast.com`), follow these steps.

## 1. Get Your Keys
You need accounts for these services:

1.  **Vultr:** [Create Account](https://www.vultr.com/) -> API -> Enable API -> Copy Key.
2.  **Stripe:** [Create Account](https://stripe.com/) -> Developers -> API Keys -> Copy `Secret Key` & `Publishable Key`.
3.  **GitHub:** Create a new repository named `rdp-fast`.

## 2. Push Code to GitHub
Run these commands in your terminal (inside the `rdp-fast` folder):

```bash
git remote add origin https://github.com/YOUR_USERNAME/rdp-fast.git
git branch -M main
git push -u origin main
```

## 3. Deploy to Vercel
1.  Go to [Vercel.com](https://vercel.com) and log in.
2.  Click **"Add New Project"** -> Import from GitHub -> Select `rdp-fast`.
3.  **Configure Environment Variables** (Copy these in):

| Name | Value |
|------|-------|
| `VULTR_API_KEY` | (Your Vultr Key) |
| `STRIPE_SECRET_KEY` | (Your Stripe Secret sk_test...) |
| `STRIPE_PUBLISHABLE_KEY` | (Your Stripe Public pk_test...) |
| `STRIPE_WEBHOOK_SECRET` | (Get this after creating a webhook endpoint in Stripe Dashboard) |
| `NEXTAUTH_URL` | `https://your-project-name.vercel.app` |
| `NEXTAUTH_SECRET` | (Generate one: `openssl rand -base64 32`) |
| `DATABASE_URL` | (See Step 4 below) |

## 4. Database Setup (Postgres)
Vercel requires a cloud database.
1.  In your Vercel Project -> Storage -> Create **Vercel Postgres**.
2.  It will automatically add the `DATABASE_URL` to your environment variables.
3.  Go to the "Deployments" tab in Vercel and redeploy if needed.

## 5. Final Step: Sync Database
Once deployed, Vercel might ask you to run migrations. Or you can connect from your local machine:
```bash
npx prisma db push
```
(Ensure your `.env` has the cloud database URL when you run this).

---
**Done!** You now have a live SaaS platform selling RDPs.
