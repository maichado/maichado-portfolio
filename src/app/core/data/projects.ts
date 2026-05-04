/**
 * Catálogo de projetos do portfólio. Conteúdo migrado da Trajetória.
 * Projetos corporativos: sem live links / repositórios públicos por padrão.
 */

export type StackTagId = 'angular' | 'flutter' | 'react' | 'ionic' | 'typescript' | 'mfe';

export interface ProjectCard {
  id: string;
  title: string;
  client: string;
  period: string;
  description: string;
  stack: readonly StackTagId[];
  /** Gradient CSS string aplicado ao cover (sem screenshot). */
  cover: string;
  /** Indica que o projeto foi realizado via Capgemini Brasil. */
  viaCapgemini?: boolean;
  /** Marca o projeto como destaque (cards maiores). */
  featured?: boolean;
  /** Links opcionais — corporativos quase nunca têm. */
  links?: { live?: string; repo?: string };
}

export const STACK_LABEL: Record<StackTagId, string> = {
  angular: 'Angular',
  flutter: 'Flutter',
  react: 'React Native',
  ionic: 'Ionic',
  typescript: 'TypeScript',
  mfe: 'Microfrontends',
};

export const PROJECTS: readonly ProjectCard[] = [
  {
    id: 'bradesco-icef',
    title: 'ICEF · Microfrontends Angular',
    client: 'Bradesco · Capgemini',
    period: '2024 — atual',
    description:
      'Liderança técnica em Angular 19 e microfrontends. Coordenação de 7 repositórios e múltiplos squads, com foco em padronização, performance e entrega contínua em ambiente regulado.',
    stack: ['angular', 'typescript', 'mfe'],
    cover: 'linear-gradient(135deg, #cc092f 0%, #2b1d1f 60%, #08080b 100%)',
    viaCapgemini: true,
    featured: true,
  },
  {
    id: 'bombeiros-sp',
    title: 'App Crítico Offline-First',
    client: 'Corpo de Bombeiros · SP',
    period: '2023 — 2024',
    description:
      'Aplicativo Flutter de missão crítica, com operação offline e online, sincronização confiável e atuação sob pressão operacional real.',
    stack: ['flutter'],
    cover: 'linear-gradient(135deg, #cc092f 0%, #2b1d1f 60%, #08080b 100%)',
    viaCapgemini: true,
    featured: true,
  },
  {
    id: 'volkswagen',
    title: 'VWeu · FsConecta',
    client: 'Volkswagen',
    period: '2022 — 2023',
    description:
      'Único desenvolvedor React Native dos apps corporativos VWeu e FsConecta — integrações, releases e evolução ponta a ponta.',
    stack: ['react', 'typescript'],
    cover: 'linear-gradient(135deg, #ffffff 0%, #f4f8fc 44%, #e8f0fa 100%)',
    viaCapgemini: true,
    featured: true,
  },
  {
    id: 'bradesco-seguros',
    title: 'Bradesco Seguros',
    client: 'Bradesco · Ionic',
    period: '2021 — 2022',
    description:
      'Soluções Ionic com foco em experiência e prazo. Entrega que superou expectativas do cliente e dos stakeholders.',
    stack: ['ionic', 'angular'],
    cover: 'linear-gradient(135deg, #cc092f 0%, #2b1d1f 60%, #08080b 100%)',
    viaCapgemini: true,
  },
  {
    id: 'bitz-open-finance',
    title: 'BITZ · Open Finance',
    client: 'Bradesco BITZ',
    period: '2021',
    description:
      'Iniciativas de Open Finance com integração ao Banco Central, alto rigor de compliance técnico e fluxos sensíveis.',
    stack: ['angular', 'typescript'],
    cover: 'linear-gradient(135deg, #cc092f 0%, #2b1d1f 60%, #08080b 100%)',
    viaCapgemini: true,
  },
  {
    id: 'pulsati-rede-dor',
    title: 'Telemedicina · Rede D\'Or',
    client: 'Pulsati',
    period: '2020 — 2021',
    description:
      'Flutter em produto de telechamada e atendimento para a Rede D\'Or, com fluxos sensíveis e foco em performance.',
    stack: ['flutter'],
    cover: 'linear-gradient(135deg, #ffffff 0%, #f4f8fc 44%, #e8f0fa 100%)',
  },
  {
    id: 'nexello-apps',
    title: 'Dois Apps · Lojas Publicadas',
    client: 'Nexello',
    period: '2019 — 2020',
    description:
      'Dois aplicativos Flutter construídos do zero e publicados na Play Store e App Store, da arquitetura à publicação.',
    stack: ['flutter'],
    cover: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 24%, #ffffff 76%, #ede9fe 100%)',
  },
] as const;

export const STACK_COLOR: Record<StackTagId, string> = {
  angular: 'var(--tag-angular)',
  flutter: 'var(--tag-flutter)',
  react: 'var(--tag-react)',
  ionic: 'var(--tag-ionic)',
  typescript: 'var(--tag-typescript)',
  mfe: 'var(--tag-mfe)',
};
