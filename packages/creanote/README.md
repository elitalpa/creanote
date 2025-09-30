# Creanote CLI

Easily create organized notes.

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
    ├── daily.md           # default template for daily notes
    ├── note.md            # default template for regular notes
    └── excalidraw.excalidraw  # default template for drawings
```

### add

Use the `add` command to add a daily note or a regular note.

```sh
creanote add note # will add a file as 2024-12-02.md
creanote add daily # will add a file in daily/2024/2024-12/week-49/2024-12-02.md
creanote add excalidraw # will add an Excalidraw drawing file
```

You can also specify a custom filename:

```sh
creanote add note --filename "my-custom-note"
```

### ai

Use AI-powered features to generate notes, ask questions, or chat interactively.

```sh
creanote ai ask "What is a note?"  # Ask a question and get a response
creanote ai chat                       # Start an interactive chat session
creanote ai add note "Project ideas"  # Generate an AI note about a topic
```

The AI features require configuration during `creanote init` or can be set up later by running `creanote init` again.

### sync

Synchronize your notes with a Git repository to keep them backed up and synced across devices.

```sh
creanote sync  # Pull changes, show local changes, and push to remote
```

The sync feature uses Git and requires configuration during `creanote init`.

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

Settings can be changed and customised in the `.creanote/config.json` file :

```json
{
  "info": {},
  "settings": {
    "basePath": "./",
    "templates": [
      {
        "name": "daily",
        "description": "Daily note",
        "path": ".creanote/templates/daily.md",
        "ext": "md",
        "target": "daily/{{year}}/{{year}}-{{month}}/week-{{week}}/{{year}}-{{month}}-{{day}}.{{ext}}"
      },
      {
        "name": "note",
        "description": "Regular note",
        "path": ".creanote/templates/note.md",
        "ext": "md",
        "target": "{{year}}-{{month}}-{{day}}.{{ext}}"
      },
      {
        "name": "excalidraw",
        "description": "Excalidraw drawing",
        "path": ".creanote/templates/excalidraw.excalidraw",
        "ext": "excalidraw",
        "target": "draw/{{year}}-{{month}}-{{day}}.{{ext}}"
      }
    ]
  }
}
```

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide.

## License

Built by [@elitalpa](https://github.com/elitalpa).  
Licensed under the [MIT license](./LICENSE).
