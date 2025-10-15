export const routes = {
    clients: () => "/clients",
    client: (id: number) => `/clients/${id}`,
    employees: () => "/employees",
    employee: (id: number) => `/employees/${id}`,
    dashboard: () => "/k-dashboard",
    settings: () => "/settings",
};
