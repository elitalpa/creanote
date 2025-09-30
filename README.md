# creanote

Easily create organized notes.

## Links

- Website: [creanote.eliapps.com](https://creanote.eliapps.com/)
- Package on NPM: [npmjs.com/package/creanote](https://www.npmjs.com/package/creanote)
- Source Code on GitHub: [github.com/elitalpa/creanote](https://github.com/elitalpa/creanote#readme)

## About

Storing notes in a plain text format like markdown ensures simplicity, portability, and long-term access without the risk of lock-in. It’s flexible, supported by many tools, and easy to move across systems.

Creanote helps you create and manage your notes.

## Get it

### Requirements

- install node (v20 LTS or higher) : [nodejs.org/en/download/prebuilt-binaries](https://nodejs.org/en/download/prebuilt-binaries)

- npm is included with node

Check if it's installed and which version you have :

```sh
node -v  # v20 or higher
npm -v   # make sure it's up to date
```

### Install

You can either use creanote with `npx` (without installing it) :

```sh
npx creanote --help
```

or you can install it and have it available on your system with :

```sh
npm install -g creanote
creanote --help
```

## Usage

### help

Use the `--help` option to see available commands.

```sh
creanote --help
```

### initialize

First, you will need to go to the directory of your notes and initialize creanote with :

```sh
creanote init
```

This will create a hidden `.creanote` directory with the following structure :

```txt
.creanote/
├── config.json   # info and settings for creanote
└── templates/
    ├── daily.md  # default template for daily notes
    └── note.md   # default template for regular notes
```

### add

Use the `add` command to add a daily note or a regular note.

```sh
creanote add note # will add a file as 2024-12-02.md
creanote add daily # will add a file in daily/2024/2024-12/week-49/2024-12-02.md
```

### daily notes

The goal of the `add daily` command is to end up with a structure similar to this for your daily notes :

```
daily
├── 2023
│   ├── 2023-01
│   ├── 2023-02
│   ├── ...
│   └── 2023-12
├── 2024
│   ├── 2024-01
│   ├── 2024-02
│   ├── ...
│   └── 2024-12
│       ├── week-49
│       ├── week-50
│       ├── week-51
│       │   ├── 2024-12-16.md
│       │   ├── ...
│       │   └── 2024-12-22.md
│       └── week-52
│           ├── 2024-12-23.md
│           ├── 2024-12-24.md
│           ├── 2024-12-25.md
│           ├── 2024-12-26.md
│           ├── 2024-12-27.md
│           ├── 2024-12-28.md
│           └── 2024-12-29.md
```

### config

You can change the paths of the templates used and where the notes are created in the `.creanote/config.json` file :

```json
{
  "info": {
    ...
  },
  "settings": {
    "templatePath": {
      "daily": ".creanote/templates/daily.md",
      "note": ".creanote/templates/note.md"
    },
    "addPath": {
      "daily": "./notenv-v/daily",
      "note": "./notenv-v"
    }
  }
}
```

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide.

## License

Built by [@elitalpa](https://github.com/elitalpa).  
Licensed under the [MIT license](./LICENSE).
