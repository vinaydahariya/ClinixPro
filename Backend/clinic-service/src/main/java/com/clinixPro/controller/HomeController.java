package com.clinixPro.controller;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    public String HomeControllerHandler(){
        return "clinic microservice for clinic appoinment system";
    }

}
