package com.shippingdost.shipping.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // No need CSRF for our API bro
            .csrf(csrf -> csrf.disable()) 
            
            // Connecting React and backend here
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of(
                        "http://localhost:5173", 
                        "https://shipping-dost.netlify.app/" 
                ));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                config.setAllowedHeaders(List.of("*"));
                return config;
            }))
            
            // Opening the paths for testing and H2
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/**").permitAll() 
                .requestMatchers("/h2-console/**").permitAll() 
                .anyRequest().authenticated()
            )
            
            // H2 console needs this otherwise it won't open in browser
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }
}
