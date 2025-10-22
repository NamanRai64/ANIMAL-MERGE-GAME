package edu.srm.animalMerge;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "merge_recipes")
public class MergeRecipe {

 // Note: We use the INPUT_KEY as the ID for efficient primary key lookup
 @Id
 private String inputKey;

 private String outputAnimal;

 // Getters and Setters (Omitted for brevity)
 public String getInputKey() {
     return inputKey;
 }
 
 public void setInputKey(String inputKey) {
     this.inputKey = inputKey;
 }
 public String getOutputAnimal() {
     return outputAnimal;
 }
 public void setOutputAnimal(String outputAnimal) {
     this.outputAnimal = outputAnimal;
 }
 @Override
 public String toString() {
 	return "MergeRecipe [inputKey=" + inputKey + ", outputAnimal=" + outputAnimal + "]";
 }
 
 // ID and POINTS fields can be included if you need them in Java logic
 // private Long id;
 // private Integer points;
}