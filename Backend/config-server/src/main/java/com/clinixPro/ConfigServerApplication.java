package com.clinixPro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.config.server.EnableConfigServer;
import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
@EnableConfigServer
@EnableDiscoveryClient
public class ConfigServerApplication {

	public static void main(String[] args) {
        // .env file load
        Dotenv dotenv = Dotenv.load();
        System.setProperty("GITHUB_USERNAME", dotenv.get("GITHUB_USERNAME"));
        System.setProperty("GITHUB_TOKEN", dotenv.get("GITHUB_TOKEN"));
		SpringApplication.run(ConfigServerApplication.class, args);
	}

}
