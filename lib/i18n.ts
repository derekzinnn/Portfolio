/**
 * Lightweight i18n dictionary. EN is the primary language (default); PT-BR is
 * toggled from the navbar and persisted in localStorage. All user-facing copy
 * lives here so the components stay locale-agnostic.
 *
 * The runtime hook lives in hooks/use-locale.ts (client). Project structural
 * data (slugs, stack, URLs, mockups) stays in lib/constants.ts. Only the
 * translatable copy (category/description/highlight) lives here, keyed by slug.
 */

export type Locale = "en" | "pt";
export const LOCALES: Locale[] = ["en", "pt"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "derek-locale";

type ProjectCopy = {
  category: string;
  description: string;
  techHighlight: string;
};

export type Dictionary = {
  nav: { work: string; about: string; contact: string };
  toggleAria: string;
  skip: string;
  hero: {
    eyebrow: string;
    line1: string;
    line2: string;
    lede: string;
    scroll: string;
    drag: string;
  };
  positioning: { eyebrow: string; pre: string; accent: string; post: string };
  work: {
    eyebrow: string;
    headingA: string;
    headingB: string;
    intro: string;
    techLabel: string;
    visitLive: string;
    caseStudy: string;
    projects: Record<string, ProjectCopy>;
  };
  preview: {
    viewLive: string;
    loading: string;
    live: string;
    loadAria: (name: string) => string;
    title: (name: string) => string;
    alt: (name: string) => string;
  };
  about: {
    eyebrow: string;
    heading: string;
    p1: string;
    p2: string;
    capabilities: string;
    groups: Record<string, string>;
  };
  contact: {
    eyebrow: string;
    headingA: string;
    headingB: string;
    lede: string;
    location: string;
  };
  footer: { builtWith: string };
};

export const dict: Record<Locale, Dictionary> = {
  en: {
    nav: { work: "Work", about: "About", contact: "Contact" },
    toggleAria: "Language",
    skip: "Skip to content",
    hero: {
      eyebrow: "Full-stack developer · available for work",
      line1: "Real products,",
      line2: "built end to end",
      lede: "Marketplaces, inventory systems, and post-sale platforms, designed, built, and shipped to production. Node, React, and PostgreSQL, from schema to the last pixel.",
      scroll: "Scroll",
      drag: "Drag to rotate",
    },
    positioning: {
      eyebrow: "What I do",
      pre: "I'm Derek, a full-stack developer who turns business problems into ",
      accent: "polished, production software",
      post: ".",
    },
    work: {
      eyebrow: "Selected work",
      headingA: "Four products,",
      headingB: "shipped to production.",
      intro:
        "Each one is live software with real users: payments, inventory, and onboarding that had to work, not just demo well.",
      techLabel: "Tech",
      visitLive: "Visit live",
      caseStudy: "View case study",
      projects: {
        cutmakers: {
          category: "Flagship · Marketplace",
          description:
            "A two-sided marketplace connecting video creators with freelance editors, handling discovery, contracts, PIX escrow payments, and trust between strangers, end to end.",
          techHighlight:
            "Role-based dashboards, real-time chat, and a review system layered over a PIX escrow flow.",
        },
        "inova-stok": {
          category: "Production · Inventory",
          description:
            "A single-tenant inventory system for a car dealership where every stock movement is an event: fully auditable, reversible, and running in production.",
          techHighlight:
            "Event-sourced stock model deployed to production on Oracle Cloud Infrastructure.",
        },
        "voluire-club": {
          category: "Client · Real estate",
          description:
            "A post-sale platform built for a paying real-estate client, onboarding buyers and guiding them through everything that happens after the purchase is signed.",
          techHighlight:
            "RBAC and row-level security with QR-code onboarding for new buyers.",
        },
        "nic-crochet": {
          category: "Client · Storefront",
          description:
            "A handmade-crochet storefront for an independent maker: a product catalog, custom-order requests, and a calm shopping experience built to turn browsers into buyers.",
          techHighlight:
            "Product catalog and custom-order flow with an admin to manage pieces and orders.",
        },
      },
    },
    preview: {
      viewLive: "View live",
      loading: "Loading…",
      live: "Live",
      loadAria: (name) => `Load live preview of ${name}`,
      title: (name) => `${name} live preview`,
      alt: (name) => `${name} preview`,
    },
    about: {
      eyebrow: "About",
      heading: "Hi, I'm Derek.",
      p1: "I build full-stack web applications end to end, comfortable in a PostgreSQL schema, a TypeScript service, and a React component in the same afternoon.",
      p2: "I care about software that actually ships: clear data models, honest interfaces, and code the next developer can read. The projects here are live products with real users, not demos.",
      capabilities: "Capabilities",
      groups: {
        Frontend: "Frontend",
        Backend: "Backend",
        Data: "Data",
        Infra: "Infra",
      },
    },
    contact: {
      eyebrow: "Contact",
      headingA: "Let's build",
      headingB: "something real",
      lede: "Open to junior and internship developer roles, and to freelance projects. The fastest way to reach me is email. I usually reply within a day.",
      location: "Brazil · Remote-friendly · PT & EN",
    },
    footer: { builtWith: "built with three.js · lenis · anime.js" },
  },

  pt: {
    nav: { work: "Trabalho", about: "Sobre", contact: "Contato" },
    toggleAria: "Idioma",
    skip: "Pular para o conteúdo",
    hero: {
      eyebrow: "Desenvolvedor full-stack · disponível para trabalho",
      line1: "Produtos reais,",
      line2: "de ponta a ponta",
      lede: "Marketplaces, sistemas de estoque e plataformas de pós-venda, desenhados, construídos e colocados em produção. Node, React e PostgreSQL, do schema ao último pixel.",
      scroll: "Rolar",
      drag: "Arraste para girar",
    },
    positioning: {
      eyebrow: "O que eu faço",
      pre: "Sou o Derek, um desenvolvedor full-stack que transforma problemas de negócio em ",
      accent: "software polido e em produção",
      post: ".",
    },
    work: {
      eyebrow: "Trabalho selecionado",
      headingA: "Quatro produtos,",
      headingB: "no ar em produção.",
      intro:
        "Cada um é software no ar, com usuários reais: pagamentos, estoque e onboarding que precisavam funcionar de verdade, não só numa demo.",
      techLabel: "Tech",
      visitLive: "Ver ao vivo",
      caseStudy: "Ver estudo de caso",
      projects: {
        cutmakers: {
          category: "Destaque · Marketplace",
          description:
            "Um marketplace de dois lados que conecta criadores de vídeo a editores freelancer, cuidando de descoberta, contratos, pagamentos em custódia via PIX e da confiança entre desconhecidos, de ponta a ponta.",
          techHighlight:
            "Painéis por função, chat em tempo real e um sistema de avaliações sobre um fluxo de custódia via PIX.",
        },
        "inova-stok": {
          category: "Produção · Estoque",
          description:
            "Um sistema de estoque single-tenant para uma concessionária onde cada movimentação é um evento: totalmente auditável, reversível e rodando em produção.",
          techHighlight:
            "Modelo de estoque com event sourcing, implantado em produção na Oracle Cloud Infrastructure.",
        },
        "voluire-club": {
          category: "Cliente · Imobiliário",
          description:
            "Uma plataforma de pós-venda para um cliente imobiliário pagante, fazendo o onboarding de compradores e guiando tudo o que acontece depois da compra assinada.",
          techHighlight:
            "RBAC e segurança em nível de linha (RLS), com onboarding de compradores por QR code.",
        },
        "nic-crochet": {
          category: "Cliente · Loja",
          description:
            "Uma loja de crochê artesanal para uma criadora independente: catálogo de produtos, pedidos sob medida e uma experiência de compra tranquila, feita para transformar visitantes em clientes.",
          techHighlight:
            "Catálogo de produtos e fluxo de pedidos sob medida, com um admin para gerenciar peças e pedidos.",
        },
      },
    },
    preview: {
      viewLive: "Ver ao vivo",
      loading: "Carregando…",
      live: "Ao vivo",
      loadAria: (name) => `Carregar preview ao vivo de ${name}`,
      title: (name) => `${name} preview ao vivo`,
      alt: (name) => `Preview de ${name}`,
    },
    about: {
      eyebrow: "Sobre",
      heading: "Oi, eu sou o Derek.",
      p1: "Construo aplicações web full-stack de ponta a ponta, à vontade num schema PostgreSQL, num serviço TypeScript e num componente React na mesma tarde.",
      p2: "Me importo com software que realmente vai ao ar: modelos de dados claros, interfaces honestas e código que o próximo dev consegue ler. Os projetos aqui são produtos no ar, com usuários reais, não são demos.",
      capabilities: "Capacidades",
      groups: {
        Frontend: "Frontend",
        Backend: "Backend",
        Data: "Dados",
        Infra: "Infra",
      },
    },
    contact: {
      eyebrow: "Contato",
      headingA: "Vamos construir",
      headingB: "algo real",
      lede: "Aberto a vagas de desenvolvedor júnior e de estágio, e a projetos freelance. O jeito mais rápido de falar comigo é por email. Costumo responder em até um dia.",
      location: "Brasil · Aberto a remoto · PT & EN",
    },
    footer: { builtWith: "feito com three.js · lenis · anime.js" },
  },
};
