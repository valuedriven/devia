# Sistema de Design

## Contexto

Construir o frontend do **DevAI (E-commerce Simples com IA)** --- uma
plataforma de e-commerce para microempreendedores com foco em
simplicidade radical.

---

## Princípios de Engenharia

-   Simplicidade radical
-   Feedback visual claro
-   Transições de estado previsíveis
-   Estrutura de componentes atômica
-   Estilização orientada por tokens

---

## Stack Alvo

-   React ou Next.js
-   Design System baseado em tokens
-   Arquitetura modular de componentes
-   Pronto para integração com backend de estados

---

## Tokens de Design

### Cores

-   brand.primary → #2563EB
-   feedback.success → #10B981
-   feedback.error → #EF4444
-   surface.bg → #F9FAFB
-   text.main → #111827

### Tipografia

-   Fonte: Inter, Roboto, sans-serif
-   H1 → 24px / Negrito
-   Body → 16px / Regular
-   Badge → 12px / Semi-negrito

---

## Componentes Base

### Botão Primário

-   Raio: 8px
-   Fundo: brand.primary
-   Texto: branco
-   Estados: padrão / hover (escurecer 5%) / desabilitado (opacidade
    0.6)

### Badge de Status

-   Formato pílula (raio 999px)
-   Variações: neutral, success, error
-   Success → Pago/Entregue
-   Error → Cancelado

### Card de Produto

-   Proporção da imagem: 1:1
-   Padding: 16px
-   Título com no máximo 2 linhas
-   Preço com destaque visual

### Form

-   Layout vertical padrão
-   Espaçamento entre campos: 16px
-   Labels sempre visíveis (não usar apenas placeholder)
-   Mensagens de erro abaixo do campo, usando feedback.error
-   Botão primário alinhado à direita no desktop e full-width no mobile

### Input

-   Altura mínima: 40px
-   Border-radius: 8px
-   Border padrão: 1px solid #E5E7EB
-   Focus: outline com brand.primary
-   Estados: default / focus / error / disabled
-   Placeholder com opacidade reduzida (não substituir label)

### Header

-   Altura mínima: 64px
-   Fundo: surface.bg ou branco
-   Título da página alinhado à esquerda
-   Área de ações (ex: logout, perfil) alinhada à direita
-   Deve permanecer fixo no topo em telas administrativas

### Footer

-   Padding vertical: 24px
-   Texto secundário em menor destaque
-   Pode conter:
    -   Informações institucionais
    -   Links úteis
    -   Contato do microempreendedor
-   Layout centralizado no mobile e distribuído no desktop

---

## Layout

-   Largura máxima: 1200px
-   Espaçamento do grid: 16px
-   Escala de espaçamento: 4, 8, 12, 16, 24, 32

----