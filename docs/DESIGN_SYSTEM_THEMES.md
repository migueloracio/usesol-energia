# Design System: Estudo de Temas (Modo Verde vs Modo Laranja)
**Projeto:** Use Sol Energia Renovável  
**Data:** 10 de Outubro de 2026  
**Objetivo:** Permitir a alternância dinâmica em tempo real entre o **Modo Verde (Institucional/Bio-Solar)** e o **Modo Laranja (Identidade Visual Oficial/Uniforme)** para apresentação e decisão do cliente.

---

## 1. Origem e Contexto da Marca

A partir da identidade visual oficial fornecida (logotipo e uniformes da equipe de instalação):
- **Tipografia "usesol":** Verde Floresta Profundo (`#0E5A36`).
- **Fundo Institucional e Uniformes dos Funcionários:** Laranja Solar / Âmbar Quente (`#F7A838`).
- **Símbolo Solar (Letra "o"):** Coroa de raios geométricos em Branco Puro (`#FFFFFF`) com centro laranja.
- **Slogan:** "energia renovável" em verde floresta.

---

## 2. Comparativo dos Temas

### 🌿 Modo Verde (Bio-Solar Floresta)
- **Foco:** Sustentabilidade, economia verde, ecologia e solidez institucional.
- **Primária:** Verde Floresta (`#005a36` / `#0E5A36`).
- **Acento / Luz:** Esmeralda (`#10B981` / `#34D399`).
- **Fundo Noturno:** Grafite Petróleo Escuro (`#02140D` / `#041D14`).
- **Botões de Ação:** Gradientes verdes com alto contraste sobre branco e escuro.

### ☀️ Modo Laranja (Solar Energy & Uniforme)
- **Foco:** Energia, vitalidade, proximidade com a vestimenta da equipe de campo e com o fundo oficial do logotipo.
- **Primária:** Laranja Solar Oficial (`#F7A838` / `#F59E0B`).
- **Hover / Escuro:** Laranja Quente Intenso (`#EA8815` / `#D97706`).
- **Contraste / Texto:** Verde Floresta Oficial (`#0E5A36`) para selos e autoridade.
- **Fundo Noturno:** Grafite Âmbar Profundo (`#140C04` / `#1F1408`).
- **Botões de Ação:** Gradientes Laranja Solar vibrante com sombra dourada quente.

---

## 3. Tabela de Tokens de Cores (CSS Custom Properties)

| Token Semântico | Modo Verde (`[data-theme="green"]`) | Modo Laranja (`[data-theme="orange"]`) | Aplicação |
| :--- | :--- | :--- | :--- |
| `--theme-primary` | `#005a36` | `#F7A838` | Botões principais, sliders, títulos de destaque |
| `--theme-primary-hover` | `#00472b` | `#EA8815` | Estados de hover e foco em botões |
| `--theme-primary-text` | `#FFFFFF` | `#1A1103` ou `#FFFFFF` | Texto interno de botões com alto contraste |
| `--theme-accent` | `#10B981` | `#F59E0B` | Badges, ícones de brilho, anéis de foco |
| `--theme-accent-light` | `#D1FAE5` | `#FEF3C7` | Fundos de cards suaves e caixas de cálculo |
| `--theme-glow` | `rgba(16, 185, 129, 0.25)` | `rgba(247, 168, 56, 0.28)` | Halo de luz em volta de cards e carrossel 3D |
| `--theme-dark-bg` | `#02140D` | `#130C05` | Seções escuras (Hero, Carrossel, Rodapé) |
| `--theme-dark-surface` | `#041D14` | `#1D1308` | Cards e containers em seções escuras |

---

## 4. Estrutura de Implementação Técnica

1. **Atributo `data-theme` na raiz (`<html>` ou `<div id="root">`):**
   - O estado é gerenciado via `localStorage` e React State com suporte imediato a troca dinâmica.
2. **Componente `ThemeSwitcher.jsx`:**
   - Barra discreta e sofisticada flutuante (ou na Navbar) com alternância com um clique:
     - `🌿 Modo Verde`
     - `☀️ Modo Laranja`
3. **Decisão Final do Cliente (Concluída em 12/10/2026):**
   - **Resultado:** O cliente aprovou e definiu como padrão oficial da marca o **☀️ Modo Laranja (Solar Energy & Uniforme)**.
   - **Ações Realizadas:**
     - O botão `ThemeSwitcher` foi desativado e removido da `Navbar`.
     - O CSS `:root` e o HTML raiz (`data-theme="orange"`) foram fixados no esquema laranja.
     - `ThemeContext` foi configurado com `DEFAULT_THEME = 'orange'` permanente.
