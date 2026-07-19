# Project Documentation: Custom Version Control System

Welcome to the central documentation for our Custom Git CLI project! This document outlines the architecture, flow, technologies, and features of the system we are building.

---

## 🏗️ Project Architecture & Flow

This project is designed to mimic the core behavior of Git, providing a local version control system that syncs with remote cloud storage (AWS S3).

### The Overall Flow:
1. **User Input:** The user runs a command in the terminal (e.g., `node index.js add file.txt`).
2. **CLI Parser (Yargs):** `index.js` acts as the entry point. Yargs intercepts the command, validates the arguments, and routes the request to the correct controller.
3. **Controllers (Business Logic):** Each command has its own dedicated file inside the `backend/controllers/` folder. This modular approach keeps the code clean and easy to maintain.
4. **Local Tracking:** The system stores commit snapshot folders and metadata files inside a hidden `.mygit` tracking folder.
5. **Remote Sync:** Using the AWS SDK, the system allows pushing local commits to an S3 bucket (with pulling functionality coming up next).

---

## 🛠️ Core Technologies

- **Node.js**: The backend runtime used to execute JavaScript outside the browser and interact with the file system.
- **Yargs**: The CLI framework. 
  - *Why Yargs?* Standard Node.js gives us raw arguments in `process.argv` which are hard to parse. Yargs automatically formats these inputs, handles option flags (like `-m`), enforces required arguments, and generates an automatic `--help` guide for users.
- **AWS SDK (v2)**: Used to connect our local repository to Amazon S3 to store commits in the cloud.

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
  - **Technical Implementation:**
    - Generates a unique `commitId` using the `uuid` package.
    - Creates a new commit directory (`.mygit/commits/<commitId>`) to store the snapshot.
    - Uses Node.js native `fs.readdir` to read all currently staged files in `.mygit/staging`.
    - Iterates over the staged files and uses `fs.copyFile` to copy them into the new commit directory.
    - Writes a `commit.json` file inside the commit directory using `fs.writeFile` to store metadata (the commit message and timestamp).

### 3. Remote Synchronization
- **`push`**
  - **Purpose:** Uploads all local commits to the remote AWS S3 storage.
  - **Technical Implementation:**
    - Imports client configuration from `backend/config/aws-config.js` containing Region and Bucket Name.
    - Reads all commit directories located in `.mygit/commits/` using `fs.readdir`.
    - For each commit directory:
      - Reads all contained files (e.g., staging copies, `commit.json` metadata).
      - Converts the file contents to buffers using `fs.readFile`.
      - Uploads files asynchronously to the S3 bucket using the SDK's `s3.upload().promise()`.
      - Structures the uploaded S3 keys as `commits/<commitId>/<filename>`.
- **`pull`**
  - **Purpose:** Fetches the latest commits from AWS S3 and merges them into the local repository.
  - **Technical Implementation:**
    - Contacts S3 using `s3.listObjectsV2` for files with the prefix `commits/`.
    - Parses S3 keys to reconstruct the commit folder structure under `.mygit/commits/`.
    - Recursively creates local folders for each remote commit using `fs.mkdir`.
    - Pulls down file buffers via `s3.getObject` and writes them into their corresponding local locations using `fs.writeFile`.

### 4. Version Restoration
- **`revert <commitId>`**
  - **Purpose:** Rolls back the repository's files to match the state they were in at a specific `commitId`.
  - **Technical Implementation:**
    - Locates the specified commit folder `.mygit/commits/<commitId>`.
    - Uses `fs.readdir` (promisified) to read all files captured in that commit's snapshot.
    - Resolves the working directory path (`.mygit/..`).
    - Loops through the files and overwrites/restores them to the working directory using `fs.copyFile` (promisified).

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

### Commit: Implement `commit` Command Logic
**Status:** ✅ Completed
**Details of work completed in this phase:**
- **UUID Integration:** Integrated the `uuid` package to generate unique identifiers for each commit.
- **Commit Directory Structure:** Programmed the system to dynamically create unique subdirectory targets (`.mygit/commits/<commitId>`).
- **File Copying & Snapshotting:** Implemented file iteration over the staging directory using `fs.readdir` and used `fs.copyFile` to duplicate staged files into the commit snapshot directory.
- **Metadata Storage:** Added logic to store commit metadata (user message and ISO timestamp) inside a `commit.json` file in the snapshot directory.
- **Bug Fixes:** Resolved the unawaited `fs.readFile` and directory-read (`EISDIR`) errors in the commit controller, changing it to an awaited `fs.readdir` call.

### Commit: Implement `push` Command Logic & AWS S3 Integration
**Status:** ✅ Completed
**Details of work completed in this phase:**
- **AWS Configuration Setup:** Created `backend/config/aws-config.js` to manage AWS region configuration (`ap-south-1`) and configure the S3 client instance.
- **Push Controller Implementation:** Built the core logic in `backend/controllers/push.js` to scan `.mygit/commits` and retrieve individual commit folders.
- **Dynamic Key Uploads:** Programmed the system to iterate through files within each commit directory and upload them to the S3 bucket under keys matching the structure `commits/<commitId>/<filename>`.
- **Debugging & Syntax Fixes:** Rectified an unawaited `fs.readdir()` call in the push controller that prevented execution, and removed debug logs.
- **Credentials Guide:** Established local AWS authentication via the shared credentials file (`~/.aws/credentials`) to safely connect the local CLI application to AWS S3.

### Commit: Implement `pull` and `revert` Commands Logic
**Status:** ✅ Completed
**Details of work completed in this phase:**
- **Remote Synchronization (Pull):** Implemented the `pullCommit` function in `backend/controllers/pull.js` to retrieve all commit objects from the AWS S3 bucket and recreate the commits locally.
- **Rollback Mechanism (Revert):** Coded the `revertCommit` logic in `backend/controllers/revert.js` using promisified file system methods to overwrite current files in the root folder with a selected commit's snapshots.
- **Integration & Parameter Fixes:** Updated the `revert` command handler inside `index.js` with an anonymous wrapper function `(argv) => { revertCommit(argv.commitId) }` to correctly extract the parsed string argument from Yargs' `argv` object.

---
*Note: This documentation serves as a living document and will be updated with each new commit as the underlying logic for file hashing, tree creation, and S3 integration is implemented.*
