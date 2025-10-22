package edu.srm.animalMerge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MergeRecipeRepository extends JpaRepository<MergeRecipe, String> {
 // findById will use the primary key, which is the inputKey string.
 Optional<MergeRecipe> findById(String inputKey);
}
