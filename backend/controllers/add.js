const path = require('path');
const fs = require('fs').promises;
async function addFile(filePath) {
    const repoPath = path.resolve(process.cwd(), ".myGit");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingPath, {recursive : true});
        const fileName = path.basename(filePath);
        await fs.copyFile(filePath, path.join(stagingPath, fileName));
        console.log(`File name ${fileName} added to the staging area!`)

    } catch (error) {
        
    }
}

module.exports = {addFile};