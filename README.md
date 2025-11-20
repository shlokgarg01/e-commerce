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


### MongoDB Setup on production
- Install mongod using the below commands
  ```
      curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
      sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
        
      echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] \
      https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | \
      sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
        
      sudo apt update
      sudo apt install -y mongodb-org
        
      sudo systemctl start mongod
      sudo systemctl enable mongod
  ```

- Then run this to start the mongo shell - ``mongosh``
- Switch to your database - ``use <db_name>``
- Create a database admin user for all auth based access
- 
    ```
    db.createUser({ user: "user", pwd: "password", roles: [ { role: "userAdminAnyDatabase", db: "admin" }, { role: "readWriteAnyDatabase", db: "admin" } ] })
    ```
- Once the database User is created, then we need to enable the authentication on the database
    - sudo nano /etc/mongod.conf
    - Enable the next 2 changes in the above file
      ```
      security:
        authorization: "enabled"
      ```
    - Also allow access to the server db from everywhere.
      ```
      bindIp: 127.0.0.1 -> bindIp: 0.0.0.0 // Replace the IP in this line
      ```
    - Then start or restart mongodb as per your need ``sudo systemctl restart mongod`` or ``sudo systemctl start mongod``

The mongo server is up & running perfectly fine.

### To Map a new domain to your VPS Server's IP
- ``sudo apt-get install nginx``
- Update the DNS records on the domain to point to the VPS server.
- ``nano /etc/nginx/sites-available/default``
- Add the below content to the above file
    ```
    server {
        server_name domain.com www.domain.com;

        location / {
            proxy_pass http://127.0.0.1:4000; # Use the PORT on which the backend is running
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```
- ``nano /etc/nginx/sites-available/domain.com``
- Add the below content the above file.
    ```  
    server {
        listen 80;
        server_name localhost;

        root /var/www/html;
        index index.html index.htm;

        location / {
            try_files $uri $uri/ =404;
        }
    }
    ```
- ``sudo lsof -i :PORT`` -- To check NGINX status
- ``sudo systemctl restart nginx``

### To Map  sub-domain to your VPS Server's IP
- Set up & run the server
- Create the directory ``sudo vim /etc/nginx/sites-available/sub-domain.com``
- Add the below content to the file
    ```
    server {
        listen 80;  
        server_name sub-domain.com;

        location / {
            proxy_pass http://127.0.0.1:4000; # update the PORT of the backend here
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```
- Enable the site ``sudo ln -s /etc/nginx/sites-available/sub-domain.com /etc/nginx/sites-enabled/``
- Test & reload nginx 
    ```
    sudo nginx -t
    sudo systemctl reload nginx
    ```
- The site should be up & running

### Certbot
- Directly run this command to generate the SSL certificate ``sudo certbot --nginx -d domain.com // This works for new domain & sub-domain both``
- If you get error that certbot is not install, then follow the below steps
-
    ```
    sudo apt update
    sudo apt install snapd -y // install snapd
    sudo snap install --classic certbot // install certbot using snapd
    sudo ln -s /snap/bin/certbot /usr/bin/certbot // link certbot to /usr/bin
    sudo certbot --nginx -d domain.com // install SSL certificate
    ```


#### **Useful commands**
- ``pm2 kill``
- ``pm2 flush``
- ``pm2 logs``
- ``pm2 restart``
- To start the mongo shell as an authenticated user - ``mongosh -u <user_name> -p --authenticationDatabase <db_name>`` This will ask you the password once you press enter.
- Get all users in the db - ``db.getUsers()``
- MongoDB Status - ``sudo systemctl status mongod``
- MongoDB Start - ``sudo systemctl start mongod``
- MongoDB Stop - ``sudo systemctl stop mongod``


### Errors Faced
- On checking logs using ``pm2 logs`` ifyou get this error `` session: options?.session ``, then upgrade nodejs to latest version using these 2 commands `` sudo npm install -g n`` `` sudo n stable `` and restart the server (ref - https://www.hostingadvice.com/how-to/update-node-js-latest-version/)
