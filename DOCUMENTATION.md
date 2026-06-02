# Project Documentation: Custom Version Control System

Welcome to the central documentation for our Custom Git CLI project! This document outlines the architecture, flow, technologies, and features of the system we are building.

---

## 🏗️ Project Architecture & Flow

This project is designed to mimic the core behavior of Git, providing a local version control system that syncs with remote cloud storage (AWS S3).

### The Overall Flow:
1. **User Input:** The user runs a command in the terminal (e.g., `node index.js add file.txt`).
2. **CLI Parser (Yargs):** `index.js` acts as the entry point. Yargs intercepts the command, validates the arguments, and routes the request to the correct controller.
3. **Controllers (Business Logic):** Each command has its own dedicated file inside the `backend/controllers/` folder. This modular approach keeps the code clean and easy to maintain.
4. **Local Tracking:** (Future Feature) The system will hash files, track changes, and store commits locally inside a hidden folder (similar to `.git`).
5. **Remote Sync:** (Future Feature) Using AWS SDK, the system will allow pushing local commits to an S3 bucket and pulling them down to other machines.

---

## 🛠️ Core Technologies

- **Node.js**: The backend runtime used to execute JavaScript outside the browser and interact with the file system.
- **Yargs**: The CLI framework. 
  - *Why Yargs?* Standard Node.js gives us raw arguments in `process.argv` which are hard to parse. Yargs automatically formats these inputs, handles option flags (like `-m`), enforces required arguments, and generates an automatic `--help` guide for users.
- **AWS SDK**: (Upcoming) Will be used to connect our local repositories to the cloud via S3.

---

## 🚀 Features & Command Reference

The following commands represent the core API of our tool.

### 1. Repository Management
- **`init`**
  - **Purpose:** Initializes a new, empty repository.
  - **Technical Implementation:**
    - Utilizes Node.js native `fs.promises` to interact with the file system asynchronously.
    - Creates a hidden `.myGit` tracking folder at the root of the project to store all version history (similar to how `.git` operates).
    - Generates a `commits` subdirectory inside `.myGit` to store snapshot data.
    - Creates a `config.json` file to store environment configuration (like the AWS S3 bucket name) which will be used for pushing and pulling later.

### 2. Staging & Committing
- **`add <file>`**
  - **Purpose:** Stages a file, marking its current state to be included in the next commit.
  - **Technical Implementation:**
    - Checks for the `.myGit` tracking folder and creates a `staging` directory inside it.
    - Uses Node.js native `fs.copyFile` to duplicate the specified file from the working directory into the `.myGit/staging` area.
- **`commit <message>`**
  - **Purpose:** Snapshots all staged files and saves them permanently in the local history with a descriptive message.

### 3. Remote Synchronization
- **`push`**
  - **Purpose:** Uploads all local commits to the remote AWS S3 storage.
- **`pull`**
  - **Purpose:** Fetches the latest commits from AWS S3 and merges them into the local repository.

### 4. Version Restoration
- **`revert <commitId>`**
  - **Purpose:** Rolls back the repository's files to match the state they were in at a specific `commitId`.

---

## 💻 Developer Guide

To run any of the commands locally during development, navigate to the `backend` directory and use node:

```bash
node index.js <command> [options]
```

**Example:**
```bash
node index.js commit "Initial project setup"
```

---

## 📝 Commit History & Progress

### Commit: Core CLI Setup & Documentation
**Status:** ✅ Completed
**Details of work completed in this phase:**
- **Folder Structure:** Initialized the standard project architecture.
- **Yargs Integration:** Set up the main entry point (`index.js`) using Yargs to parse all CLI commands.
- **Controller Wiring:** Created the foundational controller files (`init`, `add`, `commit`, `push`, `pull`, `revert`) and linked them to the CLI commands.
- **Bug Fixes:** Resolved module export typos (`moduel.exports` -> `module.exports`) and corrected the `commit` command syntax to properly parse positional arguments.
- **Documentation:** Created this comprehensive documentation file to track ongoing progress and architecture.

### Commit: Implement `init` Command Logic
**Status:** ✅ Completed
**Details of work completed in this phase:**
- **Repository Initialization:** Implemented the core logic for the `init` command in `backend/controllers/init.js`.
- **Directory Creation:** The command now successfully creates the hidden `.myGit` tracking folder and the `commits` subfolder (`.myGit/commits`).
- **Configuration Setup:** Automatically generates a `config.json` file inside the repository to store environment credentials (like `S3_Bucket`, to be configured later).

### Commit: Implement `add` Command Logic
**Status:** ✅ Completed
**Details of work completed in this phase:**
- **Argument Passing:** Updated the CLI parser in `index.js` to correctly pass the positional `file` argument to the controller.
- **Staging Area Creation:** Implemented the `addFile` function in `backend/controllers/add.js` to dynamically create the `.myGit/staging` folder if it doesn't exist.
- **File Staging:** Added logic using `fs.copyFile` to duplicate the targeted file into the staging area so it is ready for the next commit snapshot.

---
*Note: This documentation serves as a living document and will be updated with each new commit as the underlying logic for file hashing, tree creation, and S3 integration is implemented.*
