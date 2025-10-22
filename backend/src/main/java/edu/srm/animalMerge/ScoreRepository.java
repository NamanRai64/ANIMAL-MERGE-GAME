package edu.srm.animalMerge;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

//Corrected ScoreRepository.java
public interface ScoreRepository extends JpaRepository<Score, Long> {

 /**
  * Finds the top 10 scores, ordered by score descending, and then by discoveries descending.
  * This method name is automatically translated into a SQL query by Spring Data JPA.
  * @return A list of the top 10 scores.
  */
 List<Score> findTop10ByOrderByScoreDescDiscoveriesDesc(); // Note: Removed 'By' and the 'limit' parameter
}
