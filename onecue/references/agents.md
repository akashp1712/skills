# AGENTS.md snippet

Memorable’s install is one command, then a one-line harness note. OneCue M1 is the same shape.

Append this to the project `AGENTS.md` (or `CLAUDE.md`) after installing the skill:

```md
## OneCue

This repo uses OneCue for durable project memory.

When we learn a decision, rejected approach, constraint, or debugging discovery that the code cannot say by itself, remember it with the reason.

When later work might repeat that learning, search `.onecue/memories/` and inject at most one cue — or stay silent.

Install: `npx skills add akashp1712/skills --skill onecue`
```

Do not paste this unless the user asked to wire the repo or ran install.
