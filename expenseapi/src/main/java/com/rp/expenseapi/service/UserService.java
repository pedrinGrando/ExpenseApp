package com.rp.expenseapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.rp.expenseapi.dto.auth.AuthenticatedUserDTO;
import com.rp.expenseapi.dto.auth.LoginRequestDTO;
import com.rp.expenseapi.dto.user.UserDTO;
import com.rp.expenseapi.model.User;
import com.rp.expenseapi.repository.UserRepository;
import com.rp.expenseapi.security.JwtResponse;
import com.rp.expenseapi.security.JwtTokenUtil;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    @Value("${jwt.secret}")
    String secret;
    
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    public UserDTO createUser(UserDTO userDTO) {
        User user = this.convertToEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        UserDTO createdUserDto = this.convertToDTO(userRepository.save(user));
        return createdUserDto;
    }

    public JwtResponse authenticateUser(LoginRequestDTO loginRequestDTO) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequestDTO.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
                UserDTO userDTO = this.convertToDTO(user);
                return generateToken(userDTO, loginRequestDTO.getPassword());
            }
        }
        return null;
    }

    private JwtResponse generateToken(UserDTO dto, String password) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(dto.getEmail(), password));
        User user = userRepository.findByEmail(dto.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Email inválido"));
        String jwt = jwtTokenUtil.generateToken(user);
        AuthenticatedUserDTO authenticatedUserDTO = new AuthenticatedUserDTO(dto.getName(), dto.getEmail(), dto.getBirthDate());
        return JwtResponse.builder()
                          .token(jwt)
                          .authenticatedUser(authenticatedUserDTO)
                          .build();
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                      .id(user.getId())
                      .name(user.getName())
                      .email(user.getEmail())
                      .password(user.getPassword())
                      .birthDate(user.getBirthDate()) // Conversão do campo birthDate
                      .build();
    }

    private User convertToEntity(UserDTO userDTO) {
        return User.builder()
                   .id(userDTO.getId())
                   .name(userDTO.getName())
                   .email(userDTO.getEmail())
                   .password(userDTO.getPassword())
                   .birthDate(userDTO.getBirthDate()) // Conversão do campo birthDate
                   .build();
    }
}
