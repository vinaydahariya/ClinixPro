package com.clinixPro;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.PostConstruct;

@SpringBootTest
class BookingServiceApplicationTests {

	@Test
	void contextLoads() {
	}

    @Value("${SPRING_APPLICATION_NAME}")
    private String appName;

    @PostConstruct
    @Test
    public void init() {
        System.out.println("Loaded from .env: " + appName);
    }

}
