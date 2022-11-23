# syndicate
A game that is suspiciously close to a board game about properties and rent

# Project Setup
## Prerequisites
- [Node.js](https://nodejs.org/en/) (v16.14.0)
- [npm](https://www.npmjs.com/) (v8.3.1)


## Workspace Setup
- Prettier
- ESLint
- EditorConfig for VS Code

## Running the game
There are 2 parts to this game: the server and the client. The server is a Node.js server that hosts the game and the client is a Vue app that connects to the server and allows you to play the game.
1. Install [Node.js](https://nodejs.org/en/)
2. Clone the repository
3. In 1 terminal, run `cd server && npm install && npm run dev`
4. In a 2nd terminal, run `cd app && npm install && npm run dev`
5. Open `127.0.0.1:3001` in your browser

## Linting
1. Run `npm run lint` to lint the code
