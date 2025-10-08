export const payslipsServer = {
  async importFromPubblicaWebPayslips() {
    // get all payslips in pubblica web their document id is not present inside payslips table
    // for each record, ensure to populate both employee table with possible missing data and payslips table
    // WARNING: this method should be invoked AFTER populating the employees table, since payslip has a reference on employee
  },
};
