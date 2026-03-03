# AGENTS.md

Plataforma de e-commerce para microempreendedores: vitrine digital para clientes realizarem pedidos + painel administrativo para gestão de pedidos e pagamentos.

---

## Stack

### Frontend (ativo)
- Next.js 16+ com App Router
- React 19 + TypeScript 5
- Vanilla CSS com Design System (tokens semânticos — nunca valores hardcoded)
- Lucide React, clsx

### Backend (planejado)
- NestJS 11+, PostgreSQL 15+, Prisma 5+, API RESTful

### Serviços
- Auth: Clerk (JWT, HttpOnly cookies, SameSite=strict)
- DB: Supabase → AWS RDS (futuro)
- Deploy: Vercel → AWS EKS (futuro)
- Notificações: Resend → AWS SES (futuro)
- CI/CD: GitHub Actions

---

## Estrutura do Frontend

```
frontend/src/
├── app/
│   ├── (admin)/          # categories, customers, dashboard, orders, products
│   ├── (auth)/           # login
│   └── (shop)/           # cart, orders
├── components/
│   ├── ui/               # Badge, Button, Card, etc. (reutilizáveis)
│   ├── layout/           # Header, Sidebar, Footer
│   └── admin/            # componentes do painel admin
└── lib/
    ├── mock-data.ts       # dados mock para desenvolvimento
    └── utils.ts
```

---

## Regras de Negócio Críticas

### Autenticação e Acesso
- Cliente: pode navegar e montar carrinho **sem login**; precisa estar **logado para confirmar pedido**
- Admin: **sempre autenticado** para qualquer ação

### Produtos
- Produtos inativos → não aparecem na vitrine
- Produtos sem estoque → aparecem desabilitados (não removidos)

### Clientes
- Clientes com pedidos → não podem ser excluídos, apenas **desativados**

### Pedidos
- Mínimo 1 produto para confirmar pedido
- Recalcular total ao alterar quantidade
- Pagamento é **manual** (admin registra); sem integração com gateway no MVP

### Transições de Status dos Pedidos
```
Novo → Pago → Preparação → Faturado → Despachado → Entregue
Novo → Cancelado
Qualquer estado (exceto Entregue e Cancelado) → Cancelado
```

### Badges de Status

| Status     | Tone    |
|------------|---------|
| Novo       | neutral |
| Pago       | success |
| Preparação | info    |
| Faturado   | info    |
| Despachado | info    |
| Entregue   | success |
| Cancelado  | error   |

---

## Padrões de Código

- **Arquitetura**: SOLID + Clean Architecture
- **NestJS**: controllers → services → repositories, com DTOs, guards, interceptors
- **Frontend**: componentes modulares, tokens semânticos, validação em tempo real, confirmação antes de ações destrutivas
- **Acessibilidade**: navegação por teclado, estados de loading e vazio em todas as listagens
- **APIs**: RESTful, versionadas via URI (`/v1/resource`), autenticação Bearer JWT
- **Transações**: obrigatórias em operações multi-tabela
- **Auditoria**: todas as tabelas devem ter `created_at` e `updated_at`

---

## Escopo do MVP

**Incluído:**
- Vitrine de produtos funcional
- Fluxo de pedidos completo
- Autenticação com Clerk
- Integração com Supabase
- Painel administrativo básico

**Fora do MVP (não implementar agora):**
- Upload de imagens (usar URL)
- Gateway de pagamento
- Multi-tenancy
- Testes automatizados (preparar arquitetura)
- Observabilidade avançada

---

## Domínios

**Entidades:** Categoria, Produto, Cliente, Pedido, Item de Pedido

**Status do Pedido:** Novo, Pago, Preparação, Faturado, Despachado, Entregue, Cancelado

**Métodos de Pagamento:** Cartão de Crédito, Cartão de Débito, Pix, Dinheiro

---

## Documentação de Referência

- `docs/prd.md` — Requisitos e critérios de aceitação
- `docs/spec_tech.md` — Arquitetura detalhada
- `docs/spec_ui.md` — Interfaces e fluxos de navegação