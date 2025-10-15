
# Kuama Control Center

A handy tool to keep track of company resources, clients, projects and automate invoices and time reports.
Other example of questions this tool should be able to answer are:

- Has a given employee reported all the supposed hours for a given month?
- Are we earning or loosing money on a given project?
- How much will we spend this month on salaries?
- How much will we earn this month?
- Which employee has worked the most hours this month?
- Which employee has solved the most tickets this month?
- Which employee has pushed the most code this month?

All data (or most data) should be collected from external services, rather than being manually inputted.

[ClickUp Board](https://app.clickup.com/9015903511/v/b/f/90155395126)

## TODO

HIGH
We need to know, for each project and client, if we're earning or loosing money on that project
How does it work in real life:
some clients (and project) are billed a fixed amount each month,
some clients (and project) pay a fixed rate per day

So we need to be able to specify for each project either a fixed amount that gets billed each month (and a date when the project should end) or a fixed amount rate per day.
Projects with "fixed rate per day" calculation:
the amount of work can be retrieved either via youtrack or easyredmine (this needs to be set via project setting)
For all projects we should be able to create a nice summary each month that summarizes what has be done (would be nice to be able to flag if we want the author or not) by reading project commit history (need to be able to associate a github repo to the project)

Projects with "fixed amount each month" calculation:
Is the amount - the full payroll sum of employees that worked over the project the given month

HIGH We need to know for each client "how much important" it is for the company (how much weights over the full company incomes)
LOW All data should be scoped over current year except charts that compare current year data v/s previous year
LOW Final steps, we should prep up a case history for each job we did - as near as we can -
MEDIUM And we should add-in stats for each employee (tasks done over the month, times spents, etc.)
MEDIUM rationalize modules following code project guidelines and renaming re-organizing which feature should live in which folder
MEDIUM introduce usequery/usemutation where is beneficial not to wait for the server to compute everything before delivering the page
MEDIUM apply the brutal theme to all UI
LOW: handle "missing employees" from payslips: do create and entry for them as "fired" or "dismissed". This is needed to handle both
old project teams and balances/stats, that needs to be split by the correct number of employees for its given time period.

## DONE

while parsing payrolls can be "handy", we need to parse the "bilancino" to retrieve the total
spent by the company for employees. Then we can do the total spent - the total net of the month, divide it among the
number of employees of the month, then the cost of an employee will be his net + the resulting number from the previous
calculation. Then it would be nice to see a graph over the years of the cost of each employee.
After that, while we do have a way to retrieve emitted invoices, we should also retrieve reeived invoices, this is for
the cash flow.
We should also add an estimated cashflow for the future based on the previous year expenses and the previous month
payrolls, counting for december that we should have double payrolls.
We should have a quick summary for employees
Finally, for a correct cash flow history, we should parse the monthly extract from the bank, we should be able to
categorize each row, both for incoming and for outgoing transactions.
LOW Switch prettier with biome
