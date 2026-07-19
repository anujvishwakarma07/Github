const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { initRepo } = require('./controllers/init');
const { addFile } = require('./controllers/add');
const { commitMessage } = require('./controllers/commit');
const { pushCode } = require('./controllers/push');
const { pullCommit } = require('./controllers/pull');
const { revertCommit } = require('./controllers/revert');


yargs(hideBin(process.argv))
    .command(
        "start",
        "Starting the server",
        {},
        startServer
    )
    .command(
        "init",
        "Initialized the new repository",
        {},
        initRepo
    )
    .command(
        "add <file>",
        "Add a file to the repository",
        (yargs) => {
            yargs.positional("file", {
                describe: "File to add to the staging area",
                type: "string",
            })
        },
        (argv) => {
            addFile(argv.file);
        }
    )
    .command(
        "commit <message>",
        "Changes commited",
        (yargs) => {
            yargs.positional("message", {
                describe: "Write the commit message",
                type: "string",
            })
        },
        (argv) => {
            commitMessage(argv.message);
        },
    )
    .command(
        "push",
        "push to the s3",
        {},
        pushCode,
    )
    .command(
        "pull",
        "Pull commits from s3",
        {},
        pullCommit,
    )
    .command(
        "revert <commitId>",
        "Revert to the specific commit",
        (yargs) => {
            yargs.positional("commitId", {
                describe: "Commit ID to revert to",
                type: "string",
            })
        },
        (argv) => {
            revertCommit(argv.commitId);
        }
    )
    .demandCommand(1, "You need at least one command").help().argv;

function startServer() {
    console.log('Server logic called!');
}

