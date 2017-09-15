echo Building alexellis2/href-counter:build

sudo docker build -t asrestapp:build . -f Dockerfile.build

sudo docker run --name extract asrestapp:build 
sudo docker cp extract:/tmp/src/app/target/TokenVerifier.jar .  
sudo docker rm -f extract

echo Building asrestapp:latest

sudo docker build --no-cache -t asrestapp:latest .  