export interface NavSection {
  id: string;
  label: string;
}

export const NAV_SECTIONS: readonly NavSection[] = [
  { id: 'hero', label: 'Início' },
  { id: 'skills', label: 'Skills' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
] as const;
