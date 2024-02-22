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


