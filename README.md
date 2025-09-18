
## Kuama Control Center

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

ClickUp Board: https://app.clickup.com/9015903511/v/b/f/90155395126

## TODO

After that, while we do have a way to retrieve emitted invoices, we should also retrieve reeived invoices, this is for
the cash flow.
We should also add an estimated cashflow for the future based on the previous year expenses and the previous month
payrolls, counting for december that we should have double payrolls.

Finally, for a correct cash flow history, we should parse the monthly extract from the bank, we should be able to
categorize each row, both for incoming and for outgoing transactions.

Final steps, we should prep up a case history for each job we did - as near as we can -
And we should add-in stats for each employee (tasks done over the month, times spents, etc.)

TODO rename payroll -> payslip


## DONE
while parsing payrolls can be "handy", we need to parse the "bilancino" to retrieve the total
spent by the company for employees. Then we can do the total spent - the total net of the month, divide it among the
number of employees of the month, then the cost of an employee will be his net + the resulting number from the previous
calculation. Then it would be nice to see a graph over the years of the cost of each employee.