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
- ``git clone <repo_url>``
- ``cd <repo>``
- ``npm i``
- ``npm i -g pm2``
- ``use filezilla to upload env file (if needed)``
- ``pm2 start app.js (this should be the starting file of the backend)``
- ``<comment>: server should be up now. To check, go to IP_address:PORT in the browser``
- ``<comment>: if it still does not work, proceed further``
- ``sudo iptables -L <comment>: PORT isnot present in this list``
- ``sudo iptables -A INPUT -p tcp --dport <PORT> -j ACCEPT <comment>: to add PORT in the above table``
- ``sudo apt install netfilter-persistent <comment>: used to persist the changes of the above table``
- ``sudo iptables -L <comment>: to verify that the changes are still present``
- ``sudo netfilter-persistent save <comment>: to save the changes``
``pm2 restart app.js``

### Extra Info & Useful Commands
- ``pm2 kill``
- ``pm2 flush``
- ``pm2 logs``
- ``pm2 restart``