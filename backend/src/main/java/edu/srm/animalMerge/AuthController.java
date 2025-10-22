package edu.srm.animalMerge;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows all origins
public class AuthController {

	private final UserService userService;

	public AuthController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request) {
		try {
			User newUser = userService.registerUser(request);
			// Return a simple response DTO instead of the full User object to avoid
			// exposing the password hash
			return new ResponseEntity<>("User registered successfully with username: " + newUser.getUsername(),
					HttpStatus.CREATED);
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			return new ResponseEntity<>("An error occurred during registration.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping(value = "/auth", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> loginUser(@RequestBody RegistrationRequest request) {
		try {
			boolean isValid = userService.verifyPassword(request.getUsername(), request.getPassword());
            
            if (isValid) {
                // Load user details for response
                UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
                
                Map<String, String> response = new HashMap<>();
                response.put("message", "Login successful");
                response.put("username", userDetails.getUsername());
                
                System.out.println("Login successful for user: " + request.getUsername());
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                System.out.println("Invalid password for user: " + request.getUsername());
                return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
            }
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}catch(UsernameNotFoundException e) {
			System.out.println("invalid userneme or password" );
			return new ResponseEntity<>("INvalid Username or password: " ,HttpStatus.UNAUTHORIZED);
		}
		catch (Exception e) {
			return new ResponseEntity<>("An error occurred during registration.", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}