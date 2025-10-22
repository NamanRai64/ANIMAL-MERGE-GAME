package edu.srm.animalMerge;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.Optional;

@Service
public class MergeService {

 private final MergeRecipeRepository recipeRepository;

 public MergeService(MergeRecipeRepository recipeRepository) {
     this.recipeRepository = recipeRepository;
 }

 public String findMergeResult(String itemA, String itemB) {
     if (itemA == null || itemB == null) return null;

     // 1. Normalize: Get the base animal name (e.g., "Cat" from "Cat 🐈")
     String baseA = itemA.split(" ")[0];
     String baseB = itemB.split(" ")[0];

     // 2. Sort: Create a consistent array for sorting
     String[] items = {baseA, baseB};
     Arrays.sort(items);
     
     // 3. Concatenate: Create the search key (e.g., "CatDog")
     String combinationKey = items[0] + items[1];

     // 4. Database Lookup
     Optional<MergeRecipe> recipe = recipeRepository.findById(combinationKey);
     System.out.println("recipe fetched from db is: " + recipe);
     // 5. Return the output animal or null
     return recipe.map(MergeRecipe::getOutputAnimal).orElse(null);
 }
}