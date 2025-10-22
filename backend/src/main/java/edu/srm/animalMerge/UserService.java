package edu.srm.animalMerge;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Spring will automatically inject UserRepository (from your uploaded files) and PasswordEncoder (from SecurityConfig)
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Required by Spring Security. Loads the UserDetails object for a given username.
     * Maps to the requested loadUserByUsername(username).
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Your UserRepository already provides findByUsername
        Optional<User> user = userRepository.findByUsername(username);
        
        return user.orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
    public UserDetails loadUserByUsername(RegistrationRequest request) throws UsernameNotFoundException {
        // Your UserRepository already provides findByUsername
        Optional<User> user = userRepository.findByUsername(request.getUsername());
        
        return user.orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getUsername()));
    }
    public User registerUser(RegistrationRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + request.getUsername());
        }

        // 1. Encode the password before saving
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        // 2. Create and save the new User entity
        User newUser = new User(request.getUsername(),request.getFullname(), encodedPassword);
        
        return userRepository.save(newUser);
    }
    public boolean verifyPassword(String username, String rawPassword) {
        try {
            UserDetails userDetails = loadUserByUsername(username);
            return passwordEncoder.matches(rawPassword, userDetails.getPassword());
        } catch (UsernameNotFoundException e) {
            return false;
        }
    }
    
}