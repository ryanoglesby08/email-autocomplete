# Email Composer

A simple email composer showcasing an autocomplete field.

## Quick start

```bash
yarn install
yarn start
```

## Usage

Run the tests (in watch mode)

```bash
yarn test

# Run tests without watch mode
CI=true yarn test
```

Start the dev server.
Open http://localhost:3000 to view it in the browser.

```bash
yarn start
```

Serve the production bundle.
Open http://localhost:5000 to view it in the browser.

```bash
yarn build
yarn serve
```

## Core technologies

- [create-react-app](https://github.com/facebook/create-react-app) as a project bootstrapper
- [React](https://reactjs.org/) as the core UI library
- [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for XHR requests
- [react-testing-library](https://github.com/kentcdodds/react-testing-library) and [jest-dom](https://github.com/gnapse/jest-dom) for React component testing and assertions
- [prettier](https://prettier.io/) to format my code

## Notes

I did not consider some things because I had spent more than the recommended 4 hours.

- There are a couple of accessibility warnings in the console
- Dealing with empty search results
- Client side validations. Since the API performs validations, I left this out.
- Handling network errors in the autocomplete search
- Additional styling
