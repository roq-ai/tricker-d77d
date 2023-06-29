const mapping: Record<string, string> = {
  companies: 'company',
  photos: 'photo',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
