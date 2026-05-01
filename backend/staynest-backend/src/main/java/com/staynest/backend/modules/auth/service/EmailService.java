package com.staynest.backend.modules.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            if (fromEmail == null || fromEmail.isBlank()) {
                throw new RuntimeException("Email service is not configured. Please set MAIL_USERNAME and MAIL_PASSWORD.");
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail.trim());
            message.setTo(toEmail);
            message.setText(body);
            message.setSubject(subject);
            mailSender.send(message);
            System.out.println("Email sent successfully to: " + toEmail);
        } catch (Exception e) {
            logger.error("SMTP send failed for {}", toEmail, e);
            throw new RuntimeException("Failed to send reset email. Please check SMTP configuration.", e);
        }
    }
}
