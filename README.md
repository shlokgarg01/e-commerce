# Project Setup

### For help/reference
- https://youtu.be/IbJMb-qsgaY?si=iEjpfaQWy8MnxJvj

### Frontend
- run ``npm run build`` in frontend folder in the server.

### Backend
- ``ssh username@ip_address``
- ``sudo apt update``
- ``sudo apt upgrade``
- ``sudo apt install nodejs``
- ``sudo apt install git``
- ``sudo apt install npm``
- ``git clone <repo_url>``
- ``cd <repo>``
- ``npm i``
- ``npm i -g pm2``
- ``use filezilla to upload env file (if needed)``
- ``pm2 start server.js (this should be the starting file of the backend)``
- ``<comment>: server should be up now. To check, go to IP_address:PORT in the browser``
- ``<comment>: if it still does not work, proceed further``
- ``sudo iptables -L <comment>: PORT isnot present in this list``
- ``sudo iptables -A INPUT -p tcp --dport <PORT> -j ACCEPT <comment>: to add PORT in the above table``
- ``sudo apt install netfilter-persistent <comment>: used to persist the changes of the above table``
- ``sudo iptables -L <comment>: to verify that the changes are still present``
- ``sudo netfilter-persistent save <comment>: to save the changes``
- ``pm2 restart app.js``
- ``sudo systemctl start mongod``
- ``sudo systemctl stop nginx``

### To Map Domain to your VPS Server's IP
- ``sudo apt-get install nginx``
- ``nano /etc/nginx/sites-available/domain.com``
- ``  server {
    listen 80;
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;
            server_name yourDomain.com www.yourDomain.com;
            location / {
                    proxy_pass http://localhost:3000;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
                }
    }`` -- In this, just change your PORT in proxy_pass
- ``Change the running PORT of your application to 80 & everything will work perfectly fine``
- ``sudo lsof -i :80`` -- To check NGINX status
- ``sudo systemctl stop nginx`` -- To stop NGINX server
For reference, refer this link
- [Reference Blog](https://www.thapatechnical.com/2023/01/how-to-host-react-js-website-live-on.html)


### Extra Info & Useful Commands
- ``pm2 kill``
- ``pm2 flush``
- ``pm2 logs``
- ``pm2 restart``


### MongoDB Setup on production
- Install mongod
- Then run this to start the mongo shell - ``mongosh``
- Switch to your database - ``use <db_name>``
- Create a database admin user for all auth based access
    - ``db.createUser({ user: "adminUser", pwd: "strongPassword123", roles: [ { role: "userAdminAnyDatabase", db: "admin" }, { role: "readWriteAnyDatabase", db: "admin" } ] })``
- Once the database User is created, then we need to enable the authentication on the database
    - sudo nano /etc/mongod.conf
    - Enable the below in the above file
        - ```
            security:
                authorization: "enabled"
            ```
    - Then start or restart mongodb as per your need ``sudo systemctl restart mongod`` or ``sudo systemctl start mongod``

The mongo server is up & running perfectly fine.

#### **Useful commands**
1. To start the mongo shell as an authenticated user - ``mongosh -u <user_name> -p --authenticationDatabase <db_name>`` This will ask you the password once you press enter.
2. Get all users in the db - ``db.getUsers()``
3. MongoDB Status - ``sudo systemctl status mongod``
4. MongoDB Start - ``sudo systemctl start mongod``
5. MongoDB Stop - ``sudo systemctl stop mongod``


### Errors Faced
- On checking logs using ``pm2 logs`` ifyou get this error `` session: options?.session ``, then upgrade nodejs to latest version using these 2 commands `` sudo npm install -g n`` `` sudo n stable `` and restart the server (ref - https://www.hostingadvice.com/how-to/update-node-js-latest-version/)
