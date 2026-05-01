package com.staynest.backend.modules.auth.service;

import com.staynest.backend.modules.auth.dto.ChangePasswordRequest;
import com.staynest.backend.modules.auth.dto.ForgotPasswordRequest;
import com.staynest.backend.modules.auth.dto.LoginRequest;
import com.staynest.backend.modules.auth.dto.LoginResponse;
import com.staynest.backend.modules.auth.dto.ResetPasswordRequest;
import com.staynest.backend.modules.auth.dto.SignupRequest;
import com.staynest.backend.modules.auth.entity.User;
import com.staynest.backend.modules.auth.repository.UserRepository;
import com.staynest.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        String name = user.getFullName() != null ? user.getFullName() : "User";
        String otp = String.valueOf(100000 + SECURE_RANDOM.nextInt(900000));
        String deliveryMethod = request.getDeliveryMethod() == null
                ? "EMAIL"
                : request.getDeliveryMethod().trim().toUpperCase(Locale.ROOT);

        user.setPasswordResetOtp(passwordEncoder.encode(otp));
        user.setPasswordResetOtpExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        if ("EMAIL".equals(deliveryMethod) || "BOTH".equals(deliveryMethod)) {
            String subject = "Password Reset OTP - StayNest";
            String body = "Hello " + name + ",\n\n" +
                    "Your StayNest password reset OTP is: " + otp + "\n" +
                    "This OTP will expire in 10 minutes.\n\n" +
                    "If you didn't request this, please ignore this email.";
            emailService.sendSimpleEmail(user.getEmail(), subject, body);
        }

        if ("WHATSAPP".equals(deliveryMethod) || "BOTH".equals(deliveryMethod)) {
            if (request.getWhatsappNumber() == null || request.getWhatsappNumber().isBlank()) {
                throw new RuntimeException("WhatsApp number is required");
            }
            throw new RuntimeException("WhatsApp OTP provider is not configured yet");
        }

        return "OTP sent successfully.";
    }

    public String resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (user.getPasswordResetOtp() == null || user.getPasswordResetOtpExpiresAt() == null) {
            throw new RuntimeException("Please request a new OTP first");
        }

        if (user.getPasswordResetOtpExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new OTP");
        }

        if (!passwordEncoder.matches(request.getOtp().trim(), user.getPasswordResetOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetOtp(null);
        user.setPasswordResetOtpExpiresAt(null);
        userRepository.save(user);

        return "Password changed successfully!";
    }

    public String changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully!";
    }

    public String signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists!");
        }

        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new RuntimeException("Full name is required!");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ADMIN"); // Default role

        userRepository.save(user);
        return "User registered successfully!";
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        
        return new LoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail()
        );
    }
}
