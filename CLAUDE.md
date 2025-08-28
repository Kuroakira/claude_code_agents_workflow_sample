# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository is a workflow sample for testing Claude Code agents functionality, specifically for demonstrating how to set up and use custom agents within Claude Code.

## Claude Code Agents

The repository contains several custom agent definitions in `.claude/agents/`:
- **mvp-planner**: Transforms vague product ideas into well-defined MVP specifications
- **bug-fixer**: Handles bug reproduction, testing, and patch creation
- **ui-stylist**: Refactors UI components to align with design token systems
- **modular-architect**: Designs and analyzes software architecture
- **reviewer-readonly**: Provides thorough code reviews without modifications

## Agent Setup Instructions

To use agents in Claude Code:
1. Open Claude Code with `claude` command
2. Select agents mode with `/agents` command
3. Create new agent by selecting "Project (.claude/agents/)"
4. Generate with Claude (recommended option)
5. Copy and paste agent content from the `.claude/agents/` directory

## Repository Structure

```
.claude/agents/     # Custom agent definitions
docs/              # Project documentation (currently empty)
CONTEXT.md         # Context file (empty)
PLAYBOOK.md        # Playbook file (empty)
README.md          # Setup instructions
```

## House Rules

- Return patch diffs, not prose.
- Respect /CONTEXT.md constraints.
- If unsure, propose 2 options with trade-offs (≤80 words).
- Keep changes surgical: max 3 files unless I expand scope.
- If more than 3 files tell me why and what