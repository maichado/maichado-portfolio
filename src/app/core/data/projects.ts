/**
 * Catálogo de projetos do portfólio. Conteúdo migrado da Trajetória.
 * Projetos corporativos: sem live links / repositórios públicos por padrão.
 */

export type StackTagId = 'angular' | 'flutter' | 'react' | 'ionic' | 'typescript' | 'mfe';

export interface ProjectMetricRow {
  label: string;
  value: string;
}

export interface ProjectCard {
  id: string;
  title: string;
  client: string;
  period: string;
  description: string;
  stack: readonly StackTagId[];
  /** Quatro métricas (STACK / ATUAÇÃO / ESCOPO / PERÍODO) para o cartão. */
  metrics: readonly ProjectMetricRow[];
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
    client: 'Capgemini · Bradesco',
    period: '2025 – atual',
    description:
      'Arquitetura e liderança técnica de plataforma contábil (ICEF) com múltiplos squads.',
    stack: ['angular', 'typescript', 'mfe'],
    metrics: [
      { label: 'Stack', value: 'Angular 19+ · Single-spa · TypeScript' },
      { label: 'Atuação', value: 'Tech Lead Frontend' },
      { label: 'Escopo', value: '7 microfrontends independentes' },
      { label: 'Qualidade', value: 'Cobertura de testes ≥90% · SonarQube' },
      { label: 'CI/CD', value: 'GitHub Actions · Deploy autônomo' },
      {
        label: 'Impacto',
        value: 'Plataforma enterprise em produção no maior banco privado do Brasil',
      },
    ],
    viaCapgemini: true,
    featured: true,
  },
  {
    id: 'bombeiros-sp',
    title: 'App Crítico Offline-First',
    client: 'Capgemini · Bombeiros SP',
    period: '2024 – atual',
    description:
      'Coleta de Dados para atendimentos externos — funciona com ou sem conexão.',
    stack: ['flutter'],
    metrics: [
      { label: 'Stack', value: 'Flutter · Dart' },
      { label: 'Atuação', value: 'Dev Mobile Sênior' },
      { label: 'Escopo', value: 'App offline-first para atendimento em campo' },
      { label: 'Diferencial', value: 'Sincronização online e offline em tempo real' },
      { label: 'Contexto', value: 'Maior corporação de bombeiros do Brasil' },
      {
        label: 'Impacto',
        value: 'App usado em operações reais de emergência nas ruas de SP',
      },
    ],
    viaCapgemini: true,
    featured: true,
  },
  {
    id: 'volkswagen',
    title: 'VWeu · FsConecta',
    client: 'Capgemini · Volkswagen',
    period: '2022 – 2023',
    description:
      'Assumiu projeto crítico solo e garantiu todas as entregas dentro do prazo.',
    stack: ['react', 'typescript'],
    metrics: [
      { label: 'Stack', value: 'React Native · iOS · REST APIs' },
      { label: 'Atuação', value: 'Dev mobile iOS' },
      { label: 'Escopo', value: 'Reescrita completa de 2 apps corporativos' },
      { label: 'Entrega', value: 'RH · Financeiro · Benefícios · Férias' },
      { label: 'Contexto', value: 'Convocado para salvar projeto sem entrega' },
      {
        label: 'Impacto',
        value: '2 apps entregues com sucesso em multinacional alemã',
      },
    ],
    viaCapgemini: true,
    featured: true,
  },
  {
    id: 'bradesco-seguros',
    title: 'Bradesco Seguros',
    client: 'Capgemini · Bradesco Seguros',
    period: '2021 – 2022',
    description:
      'Liderança do desenvolvimento mobile com foco em usabilidade e performance.',
    stack: ['ionic', 'angular'],
    metrics: [
      { label: 'Stack', value: 'Ionic · REST APIs · UX Design' },
      { label: 'Atuação', value: 'Dev Frontend Mobile' },
      { label: 'Escopo', value: 'Previdência Privada · Novas funcionalidades' },
      { label: 'Qualidade', value: 'Testes de usabilidade com usuários reais' },
      { label: 'Processo', value: 'Colaboração com times de UX e backend' },
      {
        label: 'Impacto',
        value: 'Entrega que superou expectativas — feedback positivo do cliente',
      },
    ],
    viaCapgemini: true,
  },
  {
    id: 'bitz-open-finance',
    title: 'BITZ · Open Finance',
    client: 'Capgemini · BITZ',
    period: '2021',
    description:
      'Integração com endpoints regulatórios do Banco Central em app com milhões de usuários.',
    stack: ['angular', 'typescript'],
    metrics: [
      { label: 'Stack', value: 'Kotlin · Android nativo' },
      { label: 'Atuação', value: 'Dev Mobile' },
      { label: 'Escopo', value: 'Open Finance · Integração Banco Central' },
      { label: 'Regulatório', value: 'Conformidade total com exigências do BACEN' },
      { label: 'Processo', value: 'Testes de usabilidade · Interface responsiva' },
      {
        label: 'Impacto',
        value: 'App destacado no mercado com feedback positivo dos usuários',
      },
    ],
    viaCapgemini: true,
  },
  {
    id: 'pulsati-rede-dor',
    title: 'Telemedicina · Rede D\'Or',
    client: 'Pulsati',
    period: '2020 – 2021',
    description:
      'Migração completa com videochamada integrada entregue em período crítico de pandemia.',
    stack: ['flutter'],
    metrics: [
      { label: 'Stack', value: 'Flutter · Segurança de dados' },
      { label: 'Atuação', value: 'Dev Mobile' },
      { label: 'Escopo', value: 'Migração Ionic → Flutter · Telechamada médica' },
      { label: 'Segurança', value: 'Proteção de dados de pacientes e profissionais' },
      { label: 'Contexto', value: 'Desenvolvido durante a pandemia sob alta demanda' },
      {
        label: 'Impacto',
        value: 'Telemedicina para a maior rede privada de saúde do Brasil',
      },
    ],
  },
  {
    id: 'sales-sense-app',
    title: 'App · Consulta de estoque',
    client: 'Sales Sense',
    period: '2020 – 2023',
    description:
      'Entrega completa em Flutter seguida de decisão e execução de migração para React Native.',
    stack: ['flutter', 'react'],
    metrics: [
      { label: 'Stack', value: 'Flutter → React Native' },
      { label: 'Atuação', value: 'Dev Mobile PJ solo' },
      { label: 'Escopo', value: 'App completo do zero + migração arquitetural' },
      { label: 'Decisão', value: 'Liderou escolha técnica de migrar para React Native' },
      { label: 'Duração', value: '3 anos de produto ativo em produção' },
      {
        label: 'Impacto',
        value: 'Cliente retido por 3 anos consecutivos por resultado consistente',
      },
    ],
  },
  {
    id: 'nexello-apps',
    title: 'Nexello Supre e Nexello Agenda',
    client: 'Nexello',
    period: '2019 – 2020',
    description:
      'Primeiro contato com Flutter — dois apps completos publicados e integrados ao sistema existente.',
    stack: ['flutter'],
    metrics: [
      { label: 'Stack', value: 'Flutter · Android · iOS' },
      { label: 'Atuação', value: 'Dev Mobile' },
      { label: 'Escopo', value: '2 apps do zero integrados ao sistema web legado' },
      { label: 'Entrega', value: 'Nexello Agenda · Nexello Supre' },
      { label: 'Publicação', value: 'Play Store + App Store' },
      {
        label: 'Impacto',
        value: 'Apps em produção usados pelos clientes da empresa até hoje',
      },
    ],
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
