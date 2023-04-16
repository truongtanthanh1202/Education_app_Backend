# Education_app_Backend
Backend for education app

## Installing Mongodb and something relative: Backup and restore
  ### 1. Install Mongodb:
  #### - Click this link to download and install mongodb: https://www.mongodb.com/try/download/community-kubernetes-operator.
  #### - Follow this video to install: https://youtu.be/RP4enc7z1Lw.
  ### 2. Install MongoDB Command Line Database Tools
  #### - Click this link to download and install: https://www.mongodb.com/try/download/community-kubernetes-operator (`msi`)
  #### - Add this path: 'C:\Program Files\MongoDB\Tools\100\bin' to path at environments variables.
## Opening BACKEND Project
### 1. Restore database:
#### - copy path Where contains file `Test-project.gzip` in `backend` project ( Mine is `E:\Software-Engineering\backend\src\data` ).
#### - open cmd and paste : `mongorestore --gzip --archive=`your path`\Test-project.gzip --db Test-project --drop`( Mine is `mongorestore --gzip --archive=E:\Software-Engineering\backend\src\data\Test-project.gzip --db Test-project --drop`).
### 2. Then open your MongoDB Compass and You can see your database has been added.
## Eventually, run command line: 'npm install' then 'npm start'  to run project. Don't forget to `ctrl + s` after update database (That Test-project file will be updated).
## That's it :))
