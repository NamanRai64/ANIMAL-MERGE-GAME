package edu.srm.animalMerge;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "app_user")
public class User implements UserDetails {

	private static final long serialVersionUID = 1L;
	@Id
    private String username;
    @Column(nullable = false, unique = true)
    private String fullname;
    // ADDED: The hashed password field is essential for security
    @Column(nullable = false)
    private String password;
    // ADDED: A simple field for the user's role/authority
    private String role = "ROLE_USER"; 
    // Constructors
    public User() {}
    
    public User(String username, String fullname, String password) {
		super();
		this.username = username;
		this.fullname = fullname;
		this.password = password;
	}
    
	// --- UserDetails Implementation ---

    public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Simple implementation: grant the user's defined role
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getUsername() {
        return username;
    }

    // For a real application, you might want logic to handle account expiration, etc.
    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}