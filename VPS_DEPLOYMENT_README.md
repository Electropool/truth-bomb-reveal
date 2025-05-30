
# VPS Deployment Guide for Dare Messaging App

This guide will help you deploy your Dare messaging app on your own VPS with a complete backend system.

## Prerequisites

- VPS with Ubuntu 20.04+ (or similar Linux distribution)
- Root or sudo access
- Domain name pointed to your VPS (optional but recommended)

## 1. Server Setup

### Update your system
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (v18+)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install MySQL
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Install Nginx (for reverse proxy)
```bash
sudo apt install nginx -y
```

### Install PM2 (for process management)
```bash
sudo npm install -g pm2
```

## 2. Database Setup

### Login to MySQL
```bash
sudo mysql -u root -p
```

### Create database and user
```sql
CREATE DATABASE dare_messages;
CREATE USER 'dare_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON dare_messages.* TO 'dare_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Import database schema
```bash
mysql -u dare_user -p dare_messages < /var/www/secretmsg/server/database.sql
```

## 3. Application Deployment

### Clone your repository
```bash
cd /var/www
sudo git clone https://github.com/yourusername/your-repo-name.git secretmsg
sudo chown -R $USER:$USER /var/www/secretmsg
cd /var/www/secretmsg
```

### Setup Backend (CRITICAL - Install Dependencies First!)
```bash
cd /var/www/secretmsg/server
# Install all backend dependencies
npm install

# Verify installation
npm list
ls -la node_modules/
```

### Create environment file
```bash
cp .env.example .env
nano .env
```

Edit the .env file with your database credentials:
```
DB_HOST=localhost
DB_USER=dare_user
DB_PASSWORD=your_secure_password_here
DB_NAME=dare_messages
PORT=3001
```

### Test backend manually first (IMPORTANT!)
```bash
# Test if the server runs without PM2
node server.js
```
If you see "Connected to MySQL database" and "Server running on port 3001", press Ctrl+C and continue.

**If you get MODULE_NOT_FOUND errors, run:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Setup Frontend
```bash
cd /var/www/secretmsg
npm install
```

### Create frontend environment file
```bash
cp .env.example .env
nano .env
```

**IMPORTANT:** Edit with your domain (this is crucial for API connectivity):
```
REACT_APP_API_URL=https://yourdomain.com/api
```

### Build the frontend
```bash
npm run build
```

## 4. Start Services

### Start backend with PM2
```bash
cd /var/www/secretmsg/server

# Make sure we're in the right directory with dependencies
pwd
ls -la node_modules/

# Start with PM2
pm2 start server.js --name "secretmsg"
pm2 save
pm2 startup

# Check if it's running
pm2 status
pm2 logs secretmsg
```

**If PM2 shows "errored" status:**
```bash
# Check logs for specific errors
pm2 logs secretmsg

# Common fixes:
cd /var/www/secretmsg/server
npm install
pm2 restart secretmsg
```

## 5. Nginx Configuration

### Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/secretmsg
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React build)
    location / {
        root /var/www/secretmsg/dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/secretmsg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 6. SSL Certificate (Optional but Recommended)

### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Get SSL certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 7. Firewall Configuration

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

## 8. CRITICAL DEBUGGING STEPS

### Step 1: Check if backend is running
```bash
pm2 status
pm2 logs secretmsg
```

### Step 2: Test API directly
```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Should return: {"status":"OK","timestamp":"..."}
```

### Step 3: Test from outside
```bash
# Replace yourdomain.com with your actual domain
curl http://yourdomain.com/api/health
curl https://yourdomain.com/api/health
```

### Step 4: Check Nginx logs if API fails
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Step 5: Test dare creation from command line
```bash
# Test creating a dare via API
curl -X POST http://localhost:3001/api/dares
```

## 9. Common Issues and Fixes

### Issue: "Failed to create dare" error

**Cause:** Frontend cannot connect to backend API

**Fix 1:** Check if backend is running
```bash
pm2 status
pm2 logs secretmsg
```

**Fix 2:** Check API URL configuration
```bash
# In your frontend .env file, make sure:
REACT_APP_API_URL=https://yourdomain.com/api
# NOT localhost!
```

**Fix 3:** Rebuild frontend after changing .env
```bash
cd /var/www/secretmsg
npm run build
sudo systemctl reload nginx
```

### Issue: PM2 shows "errored" status

**Fix:**
```bash
cd /var/www/secretmsg/server
rm -rf node_modules package-lock.json
npm install
pm2 restart secretmsg
```

### Issue: Database connection fails

**Fix:**
```bash
# Test database connection
mysql -u dare_user -p dare_messages -e "SHOW TABLES;"

# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Issue: Nginx 502 Bad Gateway

**Fix:**
```bash
# Check if backend is running on port 3001
netstat -tlnp | grep 3001

# Restart services
pm2 restart secretmsg
sudo systemctl restart nginx
```

## 10. Testing Checklist

Before considering deployment complete, test these:

1. ✅ Backend health check: `curl http://localhost:3001/api/health`
2. ✅ API through Nginx: `curl http://yourdomain.com/api/health`
3. ✅ Create dare via API: `curl -X POST http://yourdomain.com/api/dares`
4. ✅ Website loads: Visit `http://yourdomain.com`
5. ✅ Create dare via website: Click "Start Your Dare" button
6. ✅ Send message: Visit the share link and send a message
7. ✅ View messages: Check if messages appear on the main page

## 11. Monitoring Commands

### View all logs
```bash
# Backend logs
pm2 logs secretmsg

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

### Check service status
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql
```

### Restart everything
```bash
pm2 restart secretmsg
sudo systemctl restart nginx
sudo systemctl restart mysql
```

## 12. Automatic Updates

### Create update script
```bash
nano /var/www/secretmsg/update.sh
```

Add this content:
```bash
#!/bin/bash
cd /var/www/secretmsg
git pull origin main

# Update frontend
npm install
npm run build

# Update backend
cd server
npm install
pm2 restart secretmsg

echo "Application updated successfully!"
```

Make it executable:
```bash
chmod +x /var/www/secretmsg/update.sh
```

## Quick Deployment Commands Summary

```bash
# 1. Install dependencies in server directory
cd /var/www/secretmsg/server
npm install

# 2. Create and configure .env
cp .env.example .env
# Edit .env with your database credentials

# 3. Start with PM2
pm2 start server.js --name "secretmsg"

# 4. Configure frontend API URL
cd /var/www/secretmsg
cp .env.example .env
# Edit .env: REACT_APP_API_URL=https://yourdomain.com/api

# 5. Build frontend
npm run build

# 6. Configure and start Nginx
# (Follow Nginx configuration steps above)

# 7. Test everything
curl http://localhost:3001/api/health
curl http://yourdomain.com/api/health
```

Your Dare messaging app should now be fully functional with global message persistence!
