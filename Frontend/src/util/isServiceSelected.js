export const isServiceSelected = (services, id) => services.some(
    service => service?.id === id
);
