package com.tds.connector;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ConnectorServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConnectorServiceApplication.class, args);
    }
}
