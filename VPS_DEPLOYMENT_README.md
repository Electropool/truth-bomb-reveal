
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
cd server
# Install all backend dependencies
npm install

# Verify installation
npm list
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

### Test backend manually first
```bash
# Test if the server runs without PM2
node server.js
```
If you see "Connected to MySQL database" and "Server running on port 3001", press Ctrl+C and continue.

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

Edit with your domain:
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

## 8. Troubleshooting Common Issues

### If PM2 shows "errored" status:

1. **Check if dependencies are installed:**
```bash
cd /var/www/secretmsg/server
ls -la node_modules/
```

2. **If node_modules is missing, install dependencies:**
```bash
npm install
```

3. **Check if .env file exists and has correct values:**
```bash
cat .env
```

4. **Test database connection:**
```bash
mysql -u dare_user -p dare_messages -e "SHOW TABLES;"
```

5. **Restart PM2 after fixing issues:**
```bash
pm2 restart secretmsg
pm2 logs secretmsg
```

### If getting "MODULE_NOT_FOUND" error:
```bash
cd /var/www/secretmsg/server
rm -rf node_modules package-lock.json
npm install
pm2 restart secretmsg
```

## 9. Automatic Updates and Monitoring

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

### Make it executable
```bash
chmod +x /var/www/secretmsg/update.sh
```

## 10. Testing

### Check if services are running
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql
```

### Test the API
```bash
curl http://localhost:3001/api/health
curl http://yourdomain.com/api/health
```

### Access your application
Visit `http://yourdomain.com` (or `https://yourdomain.com` if SSL is configured)

## 11. Maintenance Commands

### View backend logs
```bash
pm2 logs secretmsg
```

### Restart backend
```bash
pm2 restart secretmsg
```

### Update application
```bash
cd /var/www/secretmsg
./update.sh
```

### Database backup
```bash
mysqldump -u dare_user -p dare_messages > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Quick Fix for Current Error

If you're currently getting the PM2 error, run these commands:

```bash
# Stop PM2 process
pm2 stop secretmsg
pm2 delete secretmsg

# Go to server directory and install dependencies
cd /var/www/secretmsg/server
npm install

# Verify dependencies are installed
ls -la node_modules/express
ls -la node_modules/mysql2

# Start again
pm2 start server.js --name "secretmsg"
pm2 save
pm2 logs secretmsg
```

## Security Notes

1. Always use strong passwords for database users
2. Keep your system updated: `sudo apt update && sudo apt upgrade`
3. Consider using fail2ban for additional security
4. Regularly backup your database
5. Monitor your server resources

Your Dare messaging app should now be fully functional with global message persistence!
