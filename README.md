Check how the setup in the [article](https://medium.com/realworld-ai-use-cases/the-claude-code-workflow-you-can-copy-6265009df76d) works.

# Worklog
1. open claude code with the following command
```
claude
```

2. select agents mode with the following command
```
/agents
```

3. select "Create new agent"
4. select "Project (.claude/agents/)
- I just wanted to check how it works so I didn't select the Personal option.
5. select "Generate with Claude (recommended)
6. Copy & paste the each content of agents like mvp-planner.
7. type Enter or Return
8. execute the following command to generate CLADUE.md
```
/init
```
9. tell claude code to add the following text in CLAUDE.md
House Rules:
- Return patch diffs, not prose.
- Respect /CONTEXT.md constraints.
- If unsure, propose 2 options with trade-offs (≤80 words).
- Keep changes surgical: max 3 files unless I expand scope.
- If more than 3 files tell me why and what
10. prompt the following.
```
We'll build the cutting edge ui todo list so you should write about the product in ./docs/01-scope.md and add about the architecture of it in CONTEXT.md.
```
11. prompt the following.
```
Read CONTEXT.md and 01-scope.md.
Propose a clear MVP plan with a JSON backlog.
List what we will NOT build.
Then wait.
```

Check if the "mvp-planner" is working

12. prompt the following.
```
Write the JSON Backlog in the 03-tasks.md
```
13. prompt the following.
```
So let's begin from MVP-001.
```
This prompt doesn't tell claude code to use the agents like ui-stylist.
And I'd like it to finish only MVP-001 but it was done with MVP-001~MVP-006.
14. prompt the following.
```
ui-stylist please check the ui.
```
But the prompt make it use the ui-stylist agent. I'll try to use the other agents like this prompt.
15. prompt the following.
```
reviewer-readonly please review the code.
```
This prompt also worked and the reviewer-readonly agent worked.
