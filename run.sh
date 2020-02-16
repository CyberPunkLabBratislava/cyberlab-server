# This scripts relies on the image parking-classifier being installed in the server
docker-compose down
mkdir -p logs/server
mkdir -p logs/mongo
chmod -R 777 logs
docker kill server
docker rm server
docker rmi server
docker-compose up -d
