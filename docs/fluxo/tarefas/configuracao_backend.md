# Configuração Backend

## Configuração antigravity

- Crie um diretório chamado monorepo no diretório .agent/skills.
- Crie um arquivo com o nome SKILLS.md no diretório .agent/skills/monorepo.
- No arquivo SKILLS.md, cole o conteúdo disponível em https://antigravity.codes/agent-skills/architecture/monorepo-management.
- Crie um diretório chamado nestjs no diretório .agent/skills.
- Crie um arquivo com o nome SKILLS.md no diretório .agent/skills/nestjs.
- No arquivo SKILLS.md, cole o conteúdo disponível em https://antigravity.codes/agent-skills/architecture/kadajett-agent-nestjs-skills.

## Ajustes no AGENTS.md

- No arquivo AGENTS.md, adicione o conteúdo a seguir:

```bash
## Persona do agente de Backend
- **Objetivo:** Construir aplicações escaláveis, modulares e testáveis com NestJS.
- **Lógica de decisão:** Priorize as restrições definidas em `docs/prd.md`, `docs/spec_tech.md` e `docs/spec_ui.md` sobre os padrões padrão.
- **Consciência de referência:** Verifique se uma biblioteca compartilhada existe em `libs/` antes de criar uma nova utilidade em `backend`.

## Contexto de Entrada 
- Quando uma alteração é solicitada, verifique `docs/prd.md` para garantir alinhamento com o negócio.
- Sempre faça referência cruzada `docs/spec_tech.md` e `docs/spec_ui.md` para consistência do esquema de banco de dados.

## Requisitos de saída
- Forneça testes unitários (Jest) para cada novo serviço gerado.
- Seguir a estrutura de pastas: src/modules/[module-name]/{controllers, services, dto, entities}.
```

## Configuração do backend

- Acesse o painel Agent.
- Acione o comando "+", Start a New Conversation.
- Cole o prompt a seguir:

```bash
Atue como um Especialista em Engenharia de Software com foco em Arquitetura NestJS e Monorepos. Seu objetivo é inicializar e implementar o core do projeto a ser desenvolvido no diretório backend.

Contexto de Entrada:
Utilize obrigatoriamente os arquivos de referência anexados para guiar todas as decisões:

prd.md: Para entender os objetivos de negócio e requisitos funcionais.

spec.md: Para seguir as definições técnicas, contratos de API e integrações.

design.md: Para aplicar os padrões arquiteturais (Ex: Clean Architecture, Hexagonal) e esquemas de dados.

Tarefa:
Gere a estrutura de pastas, os módulos principais, serviços e controllers baseados nestes documentos. Garanta que o código utilize os padrões de injeção de dependência do NestJS e esteja preparado para o ambiente monorepo.

Antes de gerar o código, apresente uma árvore de diretórios proposta para validação.

```

- Analise o plano de implementação.
- Solicite a criação incremental, focando apenas na implementação do core, database e no módulo catalog:


```bash
Inicie a implementação do plano de forma incremental criando apenas as estruturas core e database, além do módulo de catálogo
```



Implemente a integração do backend, módulo catálogo com o frontend
