// src/main/java/com/example/game/MergeRequest.java (Adjust package name as needed)

package edu.srm.animalMerge; // Assuming your package is edu.srm.animalMerge

public class MergeRequest {
    // These names MUST match the JSON keys sent from the JavaScript frontend
    private String itemA; 
    private String itemB;

    // The Controller needs these GETTER methods (The fix for your error)
    public String getItemA() {
        return itemA;
    }

    public String getItemB() {
        return itemB;
    }

    // Setters are useful but not strictly necessary for a request object
    public void setItemA(String itemA) {
        this.itemA = itemA;
    }

    public void setItemB(String itemB) {
        this.itemB = itemB;
    }
}