# Amazon Writing

One Claude skill for Amazon narrative **specs** — for **humans** in meetings and **agents** in spec-driven development.

**Wedge (Q&A):** [four-answers](../four-answers/)

## Install

```bash
npx skills add akashp1712/skills --skill amazon-writing
npx skills add akashp1712/skills --skill four-answers
```

Trigger: `/amazon-writing`

## Document types

| Type | Humans | Agents |
|------|--------|--------|
| **PR/FAQ** | Working Backwards review | **Primary feature spec** |
| **1-pager** | Fast decision | Gate before implementation |
| **6-pager** | Silent-read meeting | Multi-sprint context |
| **Tenets** | Team alignment | Hard constraints |
| **COE** | Post-incident | Update specs + mechanisms |
| **Lint** | Pre-meeting review | Pre-implementation review |

Deep guides in `docs/` — especially [spec-driven.md](docs/spec-driven.md).

## Spec-driven development

PR/FAQ is the contract: humans say FUND/KILL/REVISE; agents implement only against approved spec.

```
Draft PR/FAQ → lint → meeting → FUND → agent builds → COE if wrong
```

## Why one skill?

Like [Evercall](https://evercall.ai): one product, not eight installs. Depth lives in `docs/*.md`, not separate skills.

## License

MIT
