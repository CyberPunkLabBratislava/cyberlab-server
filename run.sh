mkdir -p logs
chmod -R 777 logs
docker kill server
docker rm server
docker rmi server
docker-compose up -d
