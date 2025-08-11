package com.clinixPro.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity httpSecurity) {
        httpSecurity
                .authorizeExchange(exchanges -> exchanges
                        // ✅ Public endpoints
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers("/api/notifications/ws/**").permitAll()


                        // ✅ Allow GET requests for public data
                        .pathMatchers(HttpMethod.GET, "/api/clinics/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/service-offering/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/reviews/clinic/**").permitAll()

                        // ✅ Secure POST/PUT/DELETE reviews
                        .pathMatchers(HttpMethod.POST, "/api/reviews/**").hasAnyRole("CUSTOMER", "CLINIC_OWNER", "ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/reviews/**").hasAnyRole("CUSTOMER", "CLINIC_OWNER", "ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/reviews/**").hasAnyRole("CUSTOMER", "CLINIC_OWNER", "ADMIN")

                        // ✅ Secure clinics
                        .pathMatchers(HttpMethod.POST, "/api/clinics/**").hasAnyRole("CUSTOMER","CLINIC_OWNER", "ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/clinics/**").hasAnyRole("CLINIC_OWNER", "ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/clinics/**").hasAnyRole("CLINIC_OWNER", "ADMIN")

                        // ✅ Restricted endpoints for Clinic Owner
                        .pathMatchers("/api/categories/clinic-owner/**",
                                "/api/notifications/clinic-owner/**",
                                "/api/service-offering/clinic-owner/**")
                        .hasRole("CLINIC_OWNER")

                        // ✅ Secure other APIs
                        .pathMatchers("/api/categories/**",
                                "/api/notifications/**",
                                "/api/bookings/**",
                                "/api/payments/**",
                                "/api/service-offering/**",
                                "/api/users/**")
                        .hasAnyRole("CUSTOMER", "CLINIC_OWNER", "ADMIN")

                        // Any other request
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oAuth2ResourceServerSpec ->
                        oAuth2ResourceServerSpec.jwt(jwtSpec ->
                                jwtSpec.jwtAuthenticationConverter(grantAuthoritiesExtractor())
                        )
                );

        httpSecurity.csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return httpSecurity.build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "https://clinic-booking-three.vercel.app",
                "http://localhost:5170"
        ));
        corsConfiguration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        corsConfiguration.setAllowedHeaders(Collections.singletonList("*"));
        corsConfiguration.setExposedHeaders(Collections.singletonList("Authorization"));
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }

    private Converter<Jwt, ? extends Mono<? extends AbstractAuthenticationToken>> grantAuthoritiesExtractor() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }
}
