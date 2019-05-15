# Endpass Auth

## Table of contents

- [Concept](#concept)
- [Development](#development)

### Concept

Auth is a part of `@endpass/connect` (`connect` below) library.

All communication with `connect` is working through `bridgeMessenger` method. And starts with `METHODS.INITIATE` method which getting initial params from initialized `connect` instance.

`Screen` component must has own `Channel` instance (for example `Auth` – `authChannel`, `Permission` – `permissionChannel`) for answering with result of their processed actions (`ok`, `cancel`, `apply`, etc.).

`dialogStream` - is entry point for methods from `connect`, where method’s payload will be processed through middlewares set. Each `method` has `options` property for controlling different middlewares behavior (pass it or use).

Each middleware has responsibility only for one action (`store`, `save`, `open`, etc.).

### Add new `screen` component

It depends of new component flow using. If new screen similar to `Auth` screen, you should create new middleware like `withAuth`.

Or if this screen similar to `Account` (has not specific answer result and sending response with one of types), you should create new method in `METHODS` constant and define options for this method.

## Development

| Command     | Description                                            |
| ----------- | ------------------------------------------------------ |
| `build`     | Build application.                                     |
| `dev`       | Start application dev server.                          |
| `report`    | Create report                                          |
| `dev:lib`   | Starts library development environment.                |
| `build:lib` | Builds library.                                        |
| `test`      | Runs unit tests.                                       |
| `format`    | Formats code of packages with `eslint` and `prettier`. |
