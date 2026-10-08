package com.hamarashops.auth.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(
            @Value("${spring.datasource.url:}") String url,
            @Value("${spring.datasource.username:sa}") String username,
            @Value("${spring.datasource.password:}") String password) {

        String effectiveUrl = url;
        String effectiveUsername = username;
        String effectivePassword = password;

        if (effectiveUrl == null || effectiveUrl.isBlank() || effectiveUrl.startsWith("<")) {
            log.info("SPRING_DATASOURCE_URL placeholder or empty detected; defaulting to local H2 file database");
            effectiveUrl = "jdbc:h2:file:./data/authdb;MODE=MySQL;DB_CLOSE_DELAY=-1;AUTO_SERVER=TRUE";
            effectiveUsername = (effectiveUsername == null || effectiveUsername.startsWith("<")) ? "sa" : effectiveUsername;
            effectivePassword = (effectivePassword == null || effectivePassword.startsWith("<")) ? "" : effectivePassword;
        }

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setJdbcUrl(effectiveUrl);
        dataSource.setUsername(effectiveUsername);
        dataSource.setPassword(effectivePassword);

        if (effectiveUrl.startsWith("jdbc:h2:")) {
            dataSource.setDriverClassName("org.h2.Driver");
        } else if (effectiveUrl.startsWith("jdbc:mysql:")) {
            dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        }

        return dataSource;
    }
}
