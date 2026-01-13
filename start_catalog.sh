#!/bin/bash
pkill -9 -f catalog-service || true
sleep 2
cd backend/catalog-service
nohup java -Dhttp.proxyHost= -Dhttp.proxyPort= -Dhttps.proxyHost= -Dhttps.proxyPort= -DsocksProxyHost= -DsocksProxyPort= -Djava.net.useSystemProxies=false -Dspring.datasource.url="jdbc:postgresql://192.170.12.201:5432/tds?connectTimeout=30&socketTimeout=60&sslmode=disable" -jar target/catalog-service-0.0.1-SNAPSHOT.jar > logs/catalog-service.log 2>&1 &
echo "Catalog service started in background."
