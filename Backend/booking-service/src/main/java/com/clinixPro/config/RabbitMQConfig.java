package com.clinixPro.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String BOOKING_QUEUE = "booking-queue";
    public static final String BOOKING_DLQ = "booking-queue-dlq";

    public static final String BOOKING_EXCHANGE = "booking-exchange";
    public static final String BOOKING_DLQ_EXCHANGE = "booking-dlq-exchange";

    public static final String BOOKING_ROUTING_KEY = "booking.key";
    public static final String BOOKING_DLQ_ROUTING_KEY = "booking.key.dlq";

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(
            ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter jackson2JsonMessageConverter
    ) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jackson2JsonMessageConverter);
        return rabbitTemplate;
    }

    // MAIN EXCHANGE
    @Bean
    public DirectExchange bookingExchange() {
        return new DirectExchange(BOOKING_EXCHANGE);
    }

    // DLQ EXCHANGE
    @Bean
    public DirectExchange bookingDLQExchange() {
        return new DirectExchange(BOOKING_DLQ_EXCHANGE);
    }

    // MAIN QUEUE with DLQ binding
    @Bean
    public Queue bookingQueue() {
        return QueueBuilder.durable(BOOKING_QUEUE)
                .withArgument("x-dead-letter-exchange", BOOKING_DLQ_EXCHANGE)
                .withArgument("x-dead-letter-routing-key", BOOKING_DLQ_ROUTING_KEY)
                .build();
    }

    // DLQ QUEUE
    @Bean
    public Queue bookingDLQ() {
        return QueueBuilder.durable(BOOKING_DLQ).build();
    }

    @Bean
    public Binding bookingBinding() {
        return BindingBuilder.bind(bookingQueue()).to(bookingExchange()).with(BOOKING_ROUTING_KEY);
    }

    @Bean
    public Binding bookingDLQBinding() {
        return BindingBuilder.bind(bookingDLQ()).to(bookingDLQExchange()).with(BOOKING_DLQ_ROUTING_KEY);
    }
}
