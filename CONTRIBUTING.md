# Contributing

Thanks for your interest in contributing.  
Please review this document before submitting your fist pull request and check for similar open issues or similar pull requests.

## Contribute with an issue

You can create an issue regarding a bug or a feature request in this repository. Please make sure to check if a similar issue or pull request doesn't exist yet before creating a new one.

## Contribute with a code change

### Fork & Clone

If you would like to contribute to the code, you will first need to [fork this repository](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo#forking-a-repository) and clone it on your machine.

### Development environment

Once cloned, you can install the dependencies.

```sh
npm install
```

Run the cli.

```sh
npm run dev
```

And try the cli commands with `npm run start -- ` followed by the commands and options like :

```sh
npm run start -- --help
```

### Before Committing

Before creating a commit, please make sure your code is formatted correctly by running :

```sh
npm run format:check
```

and fix its formatting with :

```sh
npm run format:fix
```

You can also run the ci command to make sure everything is ok (code format, linting, types, tests, etc..)

```sh
npm run ci
```

### Tests

[Vitest](https://vitest.dev/) is used for testing.

Please make sure all tests are passing (using `npm run test`).  
If your changes might need tests, please also make sure to add them.

### Commit Conventions

For commit messages, this project follows the following convention :

```
type(scope): description
```

`type` being :

- `feat:` introducing new code or new features
- `fix:` fixing bugs
- `build:` changes related to the Build System and dependencies
- `test:` adding or changing tests
- `ci:` changes regarding continuous integration (GitHub actions)
- `docs:` adding or updating documentation
- `chore:` Routine tasks or changes that do not fit in other categories

For more information, you can take a look at :

- [www.conventionalcommits.org](https://www.conventionalcommits.org/en/v1.0.0/)
- [Angular's Commit Message Guidelines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

### pull request

After committing and pushing your changes to your fork, you can [open a new pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).
