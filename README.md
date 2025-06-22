# Blog Post Manager

A simple blog post manager using [json-server](https://github.com/typicode/json-server) to provide a mock REST API for managing blog posts.

## Features

- View all blog posts
- View a single blog post by ID
- Add new blog posts
- Update existing blog posts
- Delete blog posts

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/PrincessOkaroni/Code-challenge-3
   cd code-challenge-3
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the mock API server:
   ```sh
   npx json-server --watch db.json
   ```
   By default, the server runs at [http://localhost:3000](http://localhost:3000).

## API Endpoints

- **GET /posts** — List all blog posts
- **GET /posts/:id** — Get a single post by ID
- **POST /posts** — Add a new post
- **PUT /posts/:id** — Replace a post
- **PATCH /posts/:id** — Update part of a post
- **DELETE /posts/:id** — Delete a post

## Example db.json

```json
{
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with JavaScript",
      "author": "Purity Okaroni",
      "content": "JavaScript is a versatile programming language that powers the web.",
      "image": "./images/js.png"
    }
  ]
}
```

## Notes

- Make sure port 3000 is free before starting the server.
- You can change the port with `--port`, e.g. `npx json-server --watch db.json --port 3001`.

## Author

Okaroni Purity
GitHub '''
https://github.com/PrincessOkaroni
'''

## License

This project is for educational purposes.
