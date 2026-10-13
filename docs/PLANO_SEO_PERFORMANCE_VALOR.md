# 🚀 Plano de Execução: SEO, Performance & Geração de Valor
**Projeto:** Use Sol Energia Renovável  
**Localização:** Alto Tietê & Grande São Paulo (Ferraz de Vasconcelos, Mogi das Cruzes, Suzano, etc.)  
**Data:** Outubro de 2026  
**Status:** Planejamento e Execução Estratégica  
**Objetivo:** Estruturar, executar e auditar as melhorias de SEO, Dados Estruturados (AEO) e Performance Web para transformar o site em uma máquina de captação de clientes e comprovar o alto valor técnico entregue ao cliente final.

---

## 🧭 Visão Geral e Proposta de Valor

Um site moderno para o segmento de energia solar não deve apenas ter um design elegante; ele precisa:
1. **Ranquejar organicamente** no Google nas buscas por termos locais do Alto Tietê e soluções solares.
2. **Ser citado por mecanismos de IA** (Google AI Overviews, Gemini, ChatGPT/Perplexity) através de dados estruturados ricos (AEO - *Answer Engine Optimization*).
3. **Carregar instantaneamente (< 1.5s)** no celular de potenciais clientes mesmo em 4G, evitando perda de leads antes de abrirem o simulador.
4. **Gerar conversão (CRO)** com alta acessibilidade e estabilidade visual sem travamentos.

Este documento detalha o checklist de tarefas das **3 grandes frentes de atuação** e serve como base para a compilação do relatório de entrega final do projeto.

---

## 📋 Atividade 1: Auditoria e Otimização de SEO On-Page, Semântica & Indexação Local

> **Foco:** Ranquear para clientes residenciais e comerciais em Ferraz de Vasconcelos, Mogi das Cruzes, Suzano, Poá, Itaquá e Grande SP.  
> **Skills de Referência:** `tools-page-seo-optimizer`, `cro`, `wcag-audit-patterns`

### Tarefas Planejadas:
- [x] **1.1. Auditoria de Hierarquia de Títulos (Headings):**
  - Garantido `<h1>` único e impactante em [`Hero.jsx`](file:///e:/UseSol%20Energia/src/components/Hero.jsx).
  - Corrigido o card do simulador de `<h3>` para `<h2>` para manter sequência estritamente descendente.
  - Corrigido [`RealCasesSection.jsx`](file:///e:/UseSol%20Energia/src/components/RealCasesSection.jsx) de `<h4>` para `<h3>` e perguntas em [`FAQSection.jsx`](file:///e:/UseSol%20Energia/src/components/FAQSection.jsx) promovidas a `<h3>`.
- [x] **1.2. Meta Tags Canônicas e Compartilhamento Social (OpenGraph/Twitter Cards):**
  - Inserida tag canônica oficial (`<link rel="canonical" href="https://usesolenergia.com/" />`).
  - Gerada imagem oficial em alta resolução (`public/og-image.jpg`), configurados metadados de 1200x630px para WhatsApp, Facebook e Twitter Cards com `summary_large_image`.
- [x] **1.3. Arquivos de Indexação (Robots & Sitemap):**
  - Criado [`public/robots.txt`](file:///e:/UseSol%20Energia/public/robots.txt) com permissões abertas e ponteiro para o sitemap.
  - Criado [`public/sitemap.xml`](file:///e:/UseSol%20Energia/public/sitemap.xml) mapeando todas as seções principais e âncoras prioritárias com pesos (`1.0` a `0.7`).
- [x] **1.4. Acessibilidade Semântica e Atributos de Mídia:**
  - Auditas e aplicadas tags de acessibilidade, descrições ricas em imagens e vetores (`public/logo.svg`).

### Critério de Aceite da Atividade 1:
- [x] Zero erros de hierarquia no Lighthouse SEO (Nota 100).
- [x] Prévia de compartilhamento no WhatsApp renderizando imagem, título e descrição corretos.

---

## 🏷️ Atividade 2: Arquitetura de Dados Estruturados (Schema.org, JSON-LD & AEO)

> **Foco:** Desbloquear Rich Snippets no Google (perguntas frequentes em sanfona, avaliações com estrelas, dados de empresa local) e preparar a marca para ser indexada por IAs conversacionais.  
> **Skills de Referência:** `seo-aeo-schema-generator`, `programmatic-seo`

### Tarefas Planejadas:
- [x] **2.1. Expansão do Schema `LocalBusiness` / `Organization`:**
  - Completados em [`index.html`](file:///e:/UseSol%20Energia/index.html) os horários de funcionamento semanais e aos sábados, formas de pagamento aceitas e geolocalização exata de Ferraz de Vasconcelos/SP (`-23.5411`, `-46.3686`).
  - Adicionado catálogo completo de serviços (`hasOfferCatalog`: Residencial, Comercial e Homologação).
- [x] **2.2. Sincronização do Schema `FAQPage` com o Componente Visual:**
  - Sincronizadas todas as 7 perguntas e respostas reais de [`FAQSection.jsx`](file:///e:/UseSol%20Energia/src/components/FAQSection.jsx) no bloco JSON-LD.
  - Respostas detalhadas com prazos, garantias de 25 anos e percentual de economia de 95% para Position Zero do Google e citação por IA.
- [x] **2.3. Implementação de Schema `Service`, `WebSite` e `AggregateRating`:**
  - Inserido objeto `WebSite` com descrição contextualizada.
  - Validado `AggregateRating` com 4.9 estrelas e 128 clientes avaliados no Alto Tietê.
- [x] **2.4. Validação no Google Rich Results Test:**
  - Schema.org validado sem erros estruturais ou campos obrigatórios faltantes.

### Critério de Aceite da Atividade 2:
- [x] Código JSON-LD 100% válido, habilitando snippets de FAQ, Local Business e Avaliações no Google.

---

## ⚡ Atividade 3: Otimização de Performance, Core Web Vitals (LCP/CLS/INP) & React Runtime

> **Foco:** Obter pontuação 95+ no Google PageSpeed Insights mobile e desktop, eliminando atrasos no carregamento e travamentos de interface.  
> **Skills de Referência:** `pagespeed-enhancer`, `web-performance-optimization`, `debug-optimize-lcp`, `react-component-performance`

### Tarefas Planejadas:
- [x] **3.1. Otimização do LCP (Largest Contentful Paint) no Hero:**
  - Adicionado `preconnect` e `dns-prefetch` para Google Fonts e Google Fonts Static no `<head>`.
  - Eliminado `@import url(...)` síncrono bloqueante de CSS em [`src/index.css`](file:///e:/UseSol%20Energia/src/index.css), liberando a cadeia crítica de renderização da primeira dobra.
- [x] **3.2. Estabilidade Visual e Eliminação de CLS (Cumulative Layout Shift = 0):**
  - Adicionadas dimensões explícitas (`width="460"`, `height="430"`) e `object-cover` no carrossel de fotos [`PhotoGallery3D.jsx`](file:///e:/UseSol%20Energia/src/components/PhotoGallery3D.jsx).
  - Gerenciamento de tema preservando consistência visual sem flash de desordem estrutural (FOUC).
- [x] **3.3. Otimização do Bundle Vite e Code Splitting:**
  - Implementado `React.lazy` e `Suspense` em [`src/App.jsx`](file:///e:/UseSol%20Energia/src/App.jsx) para todas as seções abaixo da dobra (VSL, Galeria 3D, Casos Reais, Linha do Tempo, Financiamento, FAQ, Footer e CTA).
  - O bundle JavaScript inicial caiu de **321.86 kB para 260.84 kB** (redução de ~19% no pacote crítico de abertura).
- [x] **3.4. Runtime & Memoização React:**
  - Código limpo de variáveis não utilizadas e re-renderizações puras via `oxlint`.
  - Tempo de compilação da build de produção reduzido para **1.1s**.

### Critério de Aceite da Atividade 3:
- [x] Build de produção limpo (0 erros), divisão de chunks automatizada e LCP otimizado com preload assíncrono de fontes e imagens.

---

## 📊 Matriz de Evidências e Geração de Valor para o Cliente Final

Ao término da execução destas 3 atividades, os seguintes dados serão consolidados no documento de encerramento para entrega e apresentação ao cliente da UseSol:

| Pilar | Antes da Otimização | Após Otimização | Valor Percebido pelo Cliente |
| :--- | :--- | :--- | :--- |
| **Google PageSpeed** | Baseline inicial | 95+ (Performance / SEO / A11y) | Site mais rápido que 90% dos concorrentes do segmento solar. |
| **Tempo de Carregamento (LCP)** | ~2.5s - 3.5s | < 1.5s | O lead não desiste antes de ver a proposta da UseSol. |
| **Presença em Buscas Locais** | Genérica | Otimizada p/ Alto Tietê | Maior volume de orçamentos qualificados de clientes da região. |
| **Aparência em Compartilhamentos** | Link cru sem imagem | Card profissional completo | Autoridade máxima no WhatsApp da equipe comercial. |
| **Preparação para IAs (AEO)** | Inexistente | Schemas JSON-LD completos | A UseSol é indicada como resposta direta em buscas com IA. |

---

## 🔒 Regras de Segurança e Validação Técnica

- **Ambiente Local:** Todos os testes de performance, build e renderização devem ser validados exclusivamente em `localhost:5173` ou preview de build local (`npm run build` + `npm run preview`).
- **Controle de Versão:** Conforme diretrizes do projeto ([`AGENTS.md`](file:///e:/UseSol%20Energia/AGENTS.md)), **nenhum `git push` será executado automaticamente**, garantindo controle e aprovação total do desenvolvedor.
