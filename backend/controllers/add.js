const fs = require('fs').promises;
const path = require('path');

async function addFile(filePath) {
    const repoPath = path.resolve(process.cwd(), ".mygit");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingPath, {recursive: true});
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(stagingPath, fileName));
        console.log(`File ${fileName} is added to the staging area`);
    } catch (error) {
        console.error('Error in adding file', error);
    }
}


module.exports = {addFile};


