---
title: pairing-obsidian-git
date: 2026-03-19T18:58:43-0400
draft: true
categories:
  - Technology
tags: []
description: ""
summary: ""
image: ""
---


Updating content on your website can sometimes be difficult, especially if you’re constrained by your deployment model or framework. Fortunately for me, I did not have these constraints for my personal website. I have built my [website](https://hamzahch.com) with Hugo, a static-site generator that uses Markdown files, and deployed it via GitHub Actions on GitHub Pages. Due to the flexible nature of my deployment model, I took this further and implemented a workflow that lets me sync content between my GitHub repository with the Obsidian vault on my devices.

The workflow is as follows:
```mermaid
flowchart LR
	A(Obsidian) <-. Sync .-> B(GitHub repo) .->|Build| C(GitHub Actions) .->|Deploy| D(GitHub Pages)
```

### Configuring Git in Obsidian
The initial setup starts at Obsidian. On desktop, I created a new Obsidian vault and initialized a Git repository in it. I then configured the [Git community plugin](https://github.com/Vinzent03/obsidian-git) and enabled auto pull and auto commit-and-sync after pulling the remote repository and opening the vault in Obsidian. This was rather straightforward to set up and the solution was nicely confined within a single app — Obsidian. However, on iOS, the [plugin](https://github.com/Vinzent03/obsidian-git)has some limitations and I had to integrate another application — [GitSync](https://apps.apple.com/us/app/gitsync/id6744980427) — to get the workflow functional. Configuration steps on desktop and iOS were pretty similar from there. I again created a new vault and used [GitSync](https://apps.apple.com/us/app/gitsync/id6744980427) to initialize and sync into the vault folder.

### Configuring Templates in Obsidian
From Obsidian, go to `Settings —> Core Plugins —> Templates` and insert `_templates/` in the `Template Folder Location` field. Then, in `_templates/`, I created Markdown files defining the frontmatter properties for blog posts and project posts as follows:

```
---
title: "{{title}}"
date:
  {{date:YYYY-MM-DDTHH:mm:ssZZ}}
draft: true
categories: []
tags: []
description: ""
summary: ""
image: ""
---
```

Now, whenever I’m creating a new post within Obsidian, I can hit `Cmd + P` —> `Templates: Insert Template` and choose to automatically populate the frontmatter using the respective template.  By toggling the `draft` property, I can also control whether the post becomes live or stays hidden on my website.

### Configuring GitHub Actions
In `/.github/workflows/deploy.yaml` in the root of my repository, I defined the following workflow:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install Node dependencies
        run: npm ci

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: '0.157.0'
          extended: true

      - name: Build
        run: hugo --minify

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          publish_branch: gh-pages
          cname: [MY_DOMAIN].com
```

Now, upon every commit, GitHub Actions automatically builds the hugo site in an Ubuntu container and deploys it to production in the `gh-pages` branch. The workflow setup is now complete. If you see this post live, it was actually deployed via this workflow!