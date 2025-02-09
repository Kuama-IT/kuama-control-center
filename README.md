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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## TODOs

- [x] YouTrack client integration (projects, issues, time reports)
- [ ] Project tables (k-clients, k-employees, k-projects)
- [ ] Sync data
- [ ] Authentication: Login with YouTrack
- [ ] Gitlab client integration (projects, issues, time reports)
- [ ] Dashboard: who is absent this week?
- [ ] payroll ocr?
- [ ] payroll estimates
- [ ] estimated annual turnover
- [ ] estimated annual profit
- [ ] fatture in cloud integration (generate invoices based on time reports & tasks & and send them)
- [ ] k-employee profile: remember a field that allows to set the hourly cost of the employee
- [ ] GitHub stats: pr stats? line of code stats?
- [ ] YouTrack stats: issues stats? time reports stats? open issues stats? closed issues stats?
- [ ] k-employee stats: earned until today? worked hours until today? reported worked hours until today? vacanze? malattie? ferie? expected worked hours from contract?

## Gotchas

A project may have

- a monthly amount to invoice (with invoice row description)
- a daily rate to be multiplied by the number of days worked (with invoice row description)
  Invoices should be managed by client, and should propose a first version of the rows of the invoice, that can be edited by the user before sending the invoice.
- If invoicing for a given project is based on time spent not reported to YT, we should be able to say "hey, this is the provider, go reading the time reports from this provider and generate the invoice based on that". Current providers that need support are easyredmine and Jira. Otherwise, spent time should be read from YT

## ROADMAP

- [x] Authentication: Login with YouTrack
- [ ] Authentication: User role (admin|employee)
- [x] Make prettier check only relevant files
- [ ] Dashboard: who is absent this week?
- [ ] Dashboard: monthly overall commits graphs
- [ ] Dashboard: monthly overall time reports graphs
- [ ] Dashboard: monthly expected expenses graphs
- [ ] Dashboard: monthly expected revenues graphs
- [ ] Rework sync logics: each client should provide a set of credentials to be used to sync data. Logical flow should be -> get all spent time by credentials -> understand which project and which issue (we probably don't care to sync them over YT) -> import to db
- [ ] Employee profile: reported hours until today
- [ ] Employee profile: performed commits until today
- [ ] Employee profile: list of payrolls
- [ ] Employee profile: total amount earned until today
- [ ] Employee profile: total cost for the company until today
- [ ] Employee profile: total earnings for company until today
- [ ] Employee profile: List of projects he's working on this month
- [ ] Client profile: List of projects
- [ ] Client profile: List of credentials. Do we need to associate credentials to projects?
- [ ] Client profile: Contract settings (see gotchas)
- [ ] Client profile: List of invoices
- [ ] Client profile: Earned until today (by year)
- [ ] Client profile: Spent (by employee) until today (by year)
- [ ] Client profile: Generate invoice button
- [ ] Client profile: Reports button
- [x] Projects: Team
- [x] Projects: previews slider
- [ ] Projects: list of issues being worked on
- [ ] Site Navigation (header, menu...)
