package edu.srm.animalMerge;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api")
public class MergeController {

 private final MergeService mergeService;

 public MergeController(MergeService mergeService) {
     this.mergeService = mergeService;
 }

 
 @GetMapping(value = "/merge", produces = MediaType.APPLICATION_JSON_VALUE)
 public ResponseEntity<Map<String, String>> getMergeItem(
	        @RequestParam(name = "itemA", required = true) String itemA,
	        @RequestParam(name = "itemB", required = true) String itemB
	    )  
 {
	// Log or process the parameters
     System.out.println("Received GET request for ID: " + itemA + " and Type: " + itemB);
     String result = mergeService.findMergeResult( itemA , itemB );
     // Return a JSON response
     Map<String, String> response = new HashMap<>();
     response.put("result", result);
     System.out.println("respomse: "+response);
     return ResponseEntity.ok(response);
 }
}
