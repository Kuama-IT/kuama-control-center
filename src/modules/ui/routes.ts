export const routes = {
  clients: () => "/clients",
  client: (id: number) => `/clients/${id}`,
  employees: () => "/k-employees",
  employee: (id: number) => `/k-employees/${id}`,
  dashboard: () => "/k-dashboard",
  settings: () => "/settings",
};
