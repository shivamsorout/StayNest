package com.staynest.backend.modules.auth.service;

import com.staynest.backend.modules.auth.dto.ForgotPasswordRequest;
import com.staynest.backend.modules.auth.dto.LoginRequest;
import com.staynest.backend.modules.auth.dto.LoginResponse;
import com.staynest.backend.modules.auth.dto.SignupRequest;
import com.staynest.backend.modules.auth.entity.User;
import com.staynest.backend.modules.auth.repository.UserRepository;
import com.staynest.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        String name = user.getFullName() != null ? user.getFullName() : "User";
        
        // In a real app, you would generate a token and a link
        String resetLink = "http://localhost:5173/reset-password?token=dummy-token";
        
        String subject = "Password Reset - StayNest";
        String body = "Hello " + name + ",\n\n" +
                "You requested a password reset. Please click the link below to reset your password:\n" +
                resetLink + "\n\n" +
                "If you didn't request this, please ignore this email.";
        
        emailService.sendSimpleEmail(user.getEmail(), subject, body);
        
        return "Reset link sent to your email!";
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
