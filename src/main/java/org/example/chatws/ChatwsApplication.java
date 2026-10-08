package org.example.chatws;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.concurrent.ExecutionException;

@SpringBootApplication
public class ChatwsApplication {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        SpringApplication.run(ChatwsApplication.class, args);
    }

}