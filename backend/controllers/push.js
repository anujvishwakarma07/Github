const fs = require('fs').promises;
const path = require('path');
const { S3_BUCKET, s3 } = require('../config/aws-config');

async function pushCode(params) {
    const repoPath = path.resolve(process.cwd(), ".mygit");
    const commitsPath = path.join(repoPath, "commits");
    


    try {
        const commitDirs = await fs.readdir(commitsPath);
        
        for(const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            
            const files = await fs.readdir(commitPath);
            for(const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent,
                }

                await s3.upload(params).promise();
            }
        }

        console.log("All commits pushed to S3");
        

    } catch (error) {
        console.error("Error on pushing to s3", error);
    }
}

module.exports = {pushCode};