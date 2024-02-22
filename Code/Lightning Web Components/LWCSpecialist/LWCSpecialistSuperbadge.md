# LWC Specialist Overview


|      Objects       | Description                                                                                             |
|---------------------------|---------------------------------------------------------------------------------------------------------|
|      Boat__c              |Represents boat records with fields such as Name, Boat_Type__c (lookup), etc.|
|      Boat_Type__c         |Stores the available boat types in the org. |
|      BoatReview__c        |Stores ratings and comments for boats with fields like Rating__c and Comment__c.|

| LWC                 | Description                                                                                   |
|---------------------|-----------------------------------------------------------------------------------------------|
| boatSearch          | Parent component responsible for coordinating boat search functionality.                     |
| boatSearchForm      | Child component within boatSearch, providing UI elements for boat search parameters.          |
| boatSearchResults   | Child component within boatSearch, displaying search results and boat gallery.               |
| boatTile            | Child component within boatSearchResults, representing a tile for each boat in the gallery.   |




1. **Custom Objects:**
   - **Boat__c:** Represents boat records with fields such as Name, Picture__c, Owner__c, Price__c, Length__c, Boat_Type__c (Lookup), etc.
   - **Boat_Type__c:**: Stores the available boat types in the org.
   - **BoatReview__c:** Stores ratings and comments for boats with fields like Rating__c and Comment__c.
     
2. [BoatDataService]() - Provides methods to fetch boat types, boat details, and boat ratings from Salesforce.
     
3. [BoatSearchForm]()
     - LWC for boat search functionality.
     - Wired getBoatTypes function from BoatDataService apex class.
     - Combobox to select boat types and trigger search.
     - Fires **search** event with the boatTypeId in the detail
  
  4. [BoatTile]() 
     - LWC to display a tile for each boat in the gallery.
     - Dynamically displays boat information.
     - Fires **selectBoat** event with the Id of the boat that was selected
       
  
  5. **BoatDetails:** 
     - LWC to show detailed information about a selected boat.
     - Fetches boat details from Salesforce using Apex and displays them.
  
  6. **BoatRatings:** 
     - Custom Lightning web component to display and submit ratings for boats.
     - Integrates with Apex to fetch existing ratings and allows users to submit new ratings.

### Metadata Used:
1. **Apex Class:**
   - **BoatDataService:** Provides methods to fetch boat types, boat details, and boat ratings from Salesforce.






9. **Apex Test Classes:**
   - Contains test methods to ensure the functionality of Apex classes like BoatDataService.
