export const routes = {
  clients: () => "/k-clients",
  employees: () => "/k-employees",
  dashboard: () => "/k-dashboard",
  settings: () => "/settings",
  client: (id: number) => `/k-clients/${id}`,
  employee: (id: number) => `/k-employees/${id}`,
};
