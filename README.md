## Introduction
Sweet little CLI todo app absolutely optimally running in NodeJS. The point was to just make a little convenient alternative to standalone desktop GUI apps / webapps for freaks who hate using their mouse - they are surely the type to love a NodeJS CLI utility, right?

## Quick Setup
#### Linux / MacOS / WSL
Zsh: ```git clone https://github.com/vaclavek-kamil/todo-cli-app.git ~/.local/share/todo-cli && echo "alias todo='node ~/.local/share/todo-cli'" >> ~/.zshrc && source ~/.zshrc```

Bash: ```git clone https://github.com/vaclavek-kamil/todo-cli-app.git ~/.local/share/todo-cli && echo "alias todo='node ~/.local/share/todo-cli'" >> ~/.bashrc && source ~/.bashrc```

## Controls
| Key       | Action                   |
|-----------|--------------------------|
| "todo"    | Start the program        |
| `n`       | Create a task            |
| `d`       | Delete a task            |
| `space`   | Mark/unmark a task       |
| `↑ / ↓`   | Navigate existing tasks  |
| `q`       | Quit                     |
| `s`       | Save changes and quit    |
