
![Metabolica Logo](img/images/metabolica.png "Metabolica UI")


# Metabolica UI

Metabolica is a software-suite for cell factory engineering.

This package contains the essentials for the UI of Metabolica:

- A pluggable UI wireframe upon which components can be written
- A few standard components: `login`, `app.docs`, `app.project`
- A few modules for component interaction: `app`, `xrefs`, `sharing`, `search`
- Some shared legacy code that will be moved into individual modules later on.


## Installation

At the moment, `metabolica` is still a private package. To install it, check out this repository or use NPM:

```
npm install github:biosustain/metabolica-ui --save
```


## Development

Ensure you have a recent version of Node.js installed on your system.

First, check out the repository. In the root directory, run:

```
npm install
```

Run the development server:

```
npm start
```