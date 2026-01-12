package com.tds.contract;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ContractApplication {
    public static void main(String[] args) {
        SpringApplication.run(ContractApplication.class, args);
    }
}
