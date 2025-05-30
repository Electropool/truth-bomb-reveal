
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
mysql -u dare_user -p dare_messages < /path/to/your/project/server/database.sql
```

## 3. Application Deployment

### Clone your repository
```bash
cd /var/www
sudo git clone https://github.com/yourusername/your-repo-name.git dare-app
sudo chown -R $USER:$USER /var/www/dare-app
cd /var/www/dare-app
```

### Setup Backend
```bash
cd server
npm install
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

### Setup Frontend
```bash
cd ..
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
cd server
pm2 start server.js --name "dare-backend"
pm2 save
pm2 startup
```

## 5. Nginx Configuration

### Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/dare-app
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React build)
    location / {
        root /var/www/dare-app/dist;
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
sudo ln -s /etc/nginx/sites-available/dare-app /etc/nginx/sites-enabled/
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

## 8. Automatic Updates and Monitoring

### Create update script
```bash
nano /var/www/dare-app/update.sh
```

Add this content:
```bash
#!/bin/bash
cd /var/www/dare-app
git pull origin main
npm install
npm run build
cd server
npm install
pm2 restart dare-backend
echo "Application updated successfully!"
```

### Make it executable
```bash
chmod +x /var/www/dare-app/update.sh
```

## 9. Testing

### Check if services are running
```bash
pm2 status
sudo systemctl status nginx
sudo systemctl status mysql
```

### Test the API
```bash
curl http://yourdomain.com/api/health
```

### Access your application
Visit `http://yourdomain.com` (or `https://yourdomain.com` if SSL is configured)

## 10. Maintenance Commands

### View backend logs
```bash
pm2 logs dare-backend
```

### Restart backend
```bash
pm2 restart dare-backend
```

### Update application
```bash
cd /var/www/dare-app
./update.sh
```

### Database backup
```bash
mysqldump -u dare_user -p dare_messages > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Troubleshooting

### If the API is not working:
1. Check PM2 status: `pm2 status`
2. Check backend logs: `pm2 logs dare-backend`
3. Check if port 3001 is listening: `netstat -tlnp | grep 3001`

### If frontend is not loading:
1. Check Nginx status: `sudo systemctl status nginx`
2. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify build files exist: `ls -la /var/www/dare-app/dist/`

### If database connection fails:
1. Check MySQL status: `sudo systemctl status mysql`
2. Test database connection: `mysql -u dare_user -p dare_messages`
3. Check environment variables in `/var/www/dare-app/server/.env`

## Security Notes

1. Always use strong passwords for database users
2. Keep your system updated: `sudo apt update && sudo apt upgrade`
3. Consider using fail2ban for additional security
4. Regularly backup your database
5. Monitor your server resources

## Support

If you encounter any issues:
1. Check the logs for error messages
2. Ensure all services are running
3. Verify your environment configuration
4. Check firewall settings

Your Dare messaging app should now be fully functional with global message persistence!
```
