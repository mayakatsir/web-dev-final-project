#!/bin/bash

set -e

# Load vm.config (must define: username, password)
. ./vm.config
host="node60.cs.colman.ac.il"
app_dir="/home/$username/recipe-app"

echo "🚀 Deploying to $username@$host..."

echo "=== Cleaning up old deployment (if exists)... ==="
sshpass -p $password ssh $username@$host "pm2 delete recipe-app" || echo "PM2 process 'recipe-app' not running, skipping..."
echo "=== Removing old app files (if exists)... ==="
sshpass -p $password ssh $username@$host "rm -rf $app_dir/Server $app_dir/Client" || echo "App directories do not exist, skipping..."

sshpass -p $password ssh $username@$host "mkdir -p $app_dir" \
&& sshpass -p $password scp -r ../Server $username@$host:$app_dir \
&& sshpass -p $password scp -r ../Client $username@$host:$app_dir \
\
&& echo "=== [1/7] Installing server dependencies ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/Server && npm install" \
\
&& echo "=== [2/7] Installing client dependencies ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/Client && npm install" \
\
&& echo "=== [3/7] Building client ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/Client && npm run build" \
\
&& echo "=== [4/7] Copying client build into Server/client ===" \
&& sshpass -p $password ssh $username@$host "mkdir -p $app_dir/Server/client && cp -r $app_dir/Client/dist/. $app_dir/Server/client/" \
\
&& echo "=== [5/7] Removing Client folder ===" \
&& sshpass -p $password ssh $username@$host "rm -rf $app_dir/Client" \
\
&& echo "=== [6/7] Compiling server & pruning dev dependencies ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/Server && npm run build:prod" \
\
&& echo "=== [7/7] Starting server with PM2 ===" \
&& sshpass -p $password ssh $username@$host "cd $app_dir/Server && pm2 startOrRestart ecosystem.config.js" \
\
&& echo "✅ Deployment complete!"
