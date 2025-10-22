package edu.srm.animalMerge;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller to handle saving and retrieving high scores.
 */
@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "*")
public class ScoreController {

    private final ScoreRepository scoreRepository;

    public ScoreController(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    /**
     * Accepts a new score submission with username.
     */
    @PostMapping
    public ResponseEntity<?> submitScore(@RequestBody ScoreSubmissionRequest request) {
        try {
            // Create the Score Entity with username
            Score newScore = new Score();
            newScore.setUserId(request.getUsername()); // Store the actual username
            newScore.setScore(request.getScore());
            newScore.setDiscoveries(request.getDiscoveries());
            newScore.setTimestamp(LocalDateTime.now());
            
            // Save to DB
            Score savedScore = scoreRepository.save(newScore);
            
            return new ResponseEntity<>(savedScore, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error submitting score: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves the top 10 scores for the leaderboard.
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        try {
            // Find the top 10 scores, sorted by score and then discoveries
            List<Score> leaderboard = scoreRepository.findTop10ByOrderByScoreDescDiscoveriesDesc();
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching leaderboard: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}