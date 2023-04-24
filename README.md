# Education_app_Backend
Backend for education app

## Installing Mongodb and something relative: Backup and restore
  ### 1. Install Mongodb:
  #### - Click this link to download and install mongodb: https://www.mongodb.com/try/download/community.
  #### - Follow this video to install: https://youtu.be/RP4enc7z1Lw.
  ### 2. Install MongoDB Command Line Database Tools
  #### - Click this link to download and install: https://www.mongodb.com/try/download/database-tools (`msi`)
  #### - Add this path: 'C:\Program Files\MongoDB\Tools\100\bin' to path at environments variables.
## Opening BACKEND Project
### 1. Restore database:
#### - copy path Where contains file `Test-project.gzip` in `backend` project ( Mine is `E:\Software-Engineering\backend\src\data` ).
#### - open cmd and paste : `mongorestore --gzip --archive=`your path`\Test-project.gzip --db Test-project --drop`( Mine is `mongorestore --gzip --archive=E:\Software-Engineering\backend\src\data\Test-project.gzip --db Test-project --drop`).
### 2. Then open your MongoDB Compass and You can see your database has been added.
## Eventually, run command line: 'npm install' then 'npm start'  to run project. Don't forget to `ctrl + s` after update database (That Test-project file will be updated).
## OOPs: If you run project with this fault: 'Error: spawn ENOENT'. Don't worry, you can comment this code and you just need run command line in cmd or terminal ***before you push to github***:
### `mongodump --gzip --archive=your_path_in_step1\Test-project.gzip --db Test-project`
### Because it will backup your database into this Test-project.gzip That have already been into this backend project.
### 
## That's it :))
