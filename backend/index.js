const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv/config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const { initRepo } = require('./controllers/init');
const { addFile } = require('./controllers/add');
const { commitMessage } = require('./controllers/commit');
const { pushCode } = require('./controllers/push');
const { pullCommit } = require('./controllers/pull');
const { revertCommit } = require('./controllers/revert');
const { error } = require('console');


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
    const app = express();
    const PORT = process.env.PORT;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGO_URI;
    mongoose
        .connect(mongoURI)
        .then(() => { console.log(`MongoDB connected Successfully`) })
        .catch((error) => console.error('Error on connecting db', error));

    app.use(cors({ origin: "*" }));

    app.get('/', (req, res) => {
        res.send('Hello! Welcome.. ');
    })

    let user = '123abc'
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors : {
            origin : "*",
            methods: ['GET', 'POST'],
        }
    });

    io.on("connection", (socket) => {
        socket.on('joinRoom', (userID) => {
            user = userID;
            console.log("========");
            console.log(user);
            console.log('======');
            socket.join(userID);
        })
    })


    const db = mongoose.connection;
    db.once("open", async() => {
        console.log("CRUD opetation called");
        //Crud operations
    })

    httpServer.listen(PORT, () => {
        console.log(`App is listening on the port : ${PORT}`);
    })


    console.log('Server logic called!');
}

