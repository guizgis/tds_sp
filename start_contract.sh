#!/bin/bash
pkill -9 -f contract-service || true
sleep 2
cd backend/contract-service
nohup java -Dhttp.proxyHost= -Dhttp.proxyPort= -Dhttps.proxyHost= -Dhttps.proxyPort= -DsocksProxyHost= -DsocksProxyPort= -Djava.net.useSystemProxies=false -Dspring.datasource.url="jdbc:postgresql://192.170.12.201:5432/tds?connectTimeout=30&socketTimeout=60&sslmode=disable" -jar target/contract-service-0.0.1-SNAPSHOT.jar > logs/contract-service.log 2>&1 &
echo "Contract service started in background."
