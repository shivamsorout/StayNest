package com.staynest.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("shivamsorout3@gmail.com");
            message.setTo(toEmail);
            message.setText(body);
            message.setSubject(subject);
            mailSender.send(message);
            System.out.println("✅ Real Email Sent Successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ SMTP Error: " + e.getMessage());
            System.out.println("\n--- DEVELOPMENT FALLBACK: EMAIL LOGGED TO CONSOLE ---");
            System.out.println("TO: " + toEmail);
            System.out.println("SUBJECT: " + subject);
            System.out.println("BODY:\n" + body);
            System.out.println("------------------------------------------------------\n");
        }
    }
}
