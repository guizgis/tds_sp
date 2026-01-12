package com.tds.identity.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 允许跨域发送 Cookie
        config.setAllowCredentials(true);
        
        // 允许所有源 (使用 OriginPatterns 以支持 allowCredentials)
        config.addAllowedOriginPattern("*");
        
        // 允许所有 Header
        config.addAllowedHeader("*");
        
        // 允许所有方法 (GET, POST, OPTIONS 等)
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}