// Vite's base includes the repository path when building for GitHub Pages.
export const media = (filename: string) => `${import.meta.env.BASE_URL}media/${filename}`;
