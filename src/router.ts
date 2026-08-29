/** Simple pathname <-> tab mapping so every page has its own URL. */
export const TAB_PATH: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  rooms: '/rooms',
  gallery: '/gallery',
  testimonials: '/testimonials',
  contact: '/contact',
  booking: '/book',
  brochure: '/brochure',
  admin: '/admin',
};

const PATH_TAB: Record<string, string> = Object.entries(TAB_PATH).reduce(
  (acc, [tab, path]) => {
    acc[path] = tab;
    return acc;
  },
  {} as Record<string, string>
);

export const pathToTab = (pathname: string): string => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return PATH_TAB[clean] ?? 'home';
};

export const tabToPath = (tab: string): string => TAB_PATH[tab] ?? '/';
