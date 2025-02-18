# Apex Specialist Superbadge
>:information_source: What You'll Be Doing to Earn This Superbadge
>- Automate record creation using Apex triggers
>- Synchronize Salesforce data with an external system using asynchronous REST callouts
>- Schedule synchronization using Apex code
>- Test automation logic to confirm Apex trigger side effects
>- Test integration logic using callout mocks
>- Test scheduling logic to confirm action gets queued
>- Apex Triggers
>- Asynchronous Apex
>- Apex Integration
>- Apex Testing

### Standard Objects
- **Maintenance Request (renamed Case)** — Service requests for broken vehicles, malfunctions, and routine maintenance.
- **Equipment (renamed Product)** — Parts and items in the warehouse used to fix or maintain RVs.

### Custom Objects
- **Vehicle** — Vehicles in HowWeRoll’s rental fleet.
- **Equipment Maintenance Item** — Joins an Equipment record with a Maintenance Request record, indicating the equipment needed for the maintenance request.

### Entity Diagram
  ![image](https://github.com/user-attachments/assets/141702f4-8461-4ac0-9e54-ef3797367a1d)

## Development Step By Step:

#### 1. Automate record creation using Apex triggers
   
- Build a programmatic process that automatically schedules regular checkups on the equipment based on the date that the equipment was installed.
- When an existing maintenance request of type Repair or Routine Maintenance is closed, create a new maintenance request for a future routine checkup.
  - This new maintenance request is tied to the same Vehicle and Equipment Records as the original closed request.
  - For record keeping purposes the existing equipment maintenance items must remain tied to the original close request so new records must be created.
  - This new request's Type should be set as Routine Maintenance.
  - The Subject should not be null and the Report Date field reflects the day the request was created.
  - Remember, all equipment has maintenance cycles.

- Calculate the maintenance request due dates by using the maintenance cycle defined on the related equipment records.
  - If multiple pieces of equipment are used in the maintenance request, define the due date by applying the shortest maintenance cycle to today’s date.

- Create the apex trigger named MaintenanceRequest and apex handler class named MaintenanceRequestHelper.
  ```java 
  trigger MaintenanceRequest on Case (before update, after update) {
     MaintenanceRequestHelper.updateWorkOrders(Trigger.newMap, Trigger.oldMap);
  }
  ```

  ```java 
  public with sharing class MaintenanceRequestHelper {

    private static final String CASE_CLOSED_STATUS_PICKLIST_VALUE = 'Closed';
    private static final Integer INTEGER_MAX_VALUE = 200000;
    // Static flag to track if the method has already been executed
    private static Boolean hasExecuted = false;
    
    public static void updateWorkOrders(Map<Id, SObject> newMap, Map<Id, SObject> oldMap) {
        List<Case> lstCaseToInsert = new List<Case>();
        Map<Integer, List<Equipment_Maintenance_Item__c>> mapItemsByCaseIndex = new Map<Integer, List<Equipment_Maintenance_Item__c>>();

        if (hasExecuted) {
            return;  // Exit if already executed
        }
        // Set flag to true to prevent future execution in the same transaction
        hasExecuted = true;

        // Map items by Maintenance Request (Case) ID
        Map<Id, List<Equipment_Maintenance_Item__c>> mapItemsByRequestId = getItemsByCaseID(newMap.keySet());


        // Process Maintenance Requests
        Integer caseIndex = 0;
        for (Id requestId : newMap.keySet()) {
            Case updatedCase = (Case) newMap.get(requestId);
            Case oldCase = (Case) oldMap.get(requestId);

            // Check if status changed to Closed
            Set<String> caseTypes = new Set<String>{'Repair','Routine Maintenance'};
            Boolean isStatusChangedToClosed = oldCase?.Status != updatedCase.Status &&
                                              updatedCase.Status == CASE_CLOSED_STATUS_PICKLIST_VALUE;

            /* Should perform logic only for Repair/Routine Maintenace Closed Case */
            if (isStatusChangedToClosed && caseTypes.contains(updatedCase.Type)) {
                // Calculate the shortest maintenance cycle
                List<Equipment_Maintenance_Item__c> itemsForRequest = mapItemsByRequestId.get(updatedCase.Id);
                Integer shortestCycleInDays = itemsForRequest != null ? calculateCycleInDays(itemsForRequest) : 0;

                // Create new Routine Maintenance Request
                Case newRoutineRequest = new Case(
                    Vehicle__c = updatedCase.Vehicle__c,
                    Type = 'Routine Maintenance',
                    Subject = 'Routine Maintenance for Vehicle ' + updatedCase.Vehicle__c,
                    Date_Reported__c = Date.today(),
                    Date_Due__c = Date.today().addDays(shortestCycleInDays)
                );
                lstCaseToInsert.add(newRoutineRequest);

                // Create Equipment Maintenance Items for the new Maintenance Request
                if (mapItemsByRequestId.containsKey(updatedCase.Id)) {
                    for (Equipment_Maintenance_Item__c item : mapItemsByRequestId.get(updatedCase.Id)) {
                        Equipment_Maintenance_Item__c newItem = new Equipment_Maintenance_Item__c(
                            Maintenance_Request__c = newRoutineRequest.Id,
                            Equipment__c = item.Equipment__c
                        );
                        if(!mapItemsByCaseIndex.containsKey(caseIndex)) {
                            mapItemsByCaseIndex.put(caseIndex, new List<Equipment_Maintenance_Item__c>{newItem});
                        } else {
                            mapItemsByCaseIndex.get(caseIndex).add(newItem);
                        }
                    }
                }
                caseIndex++;
            }
        }

        // Insert new Maintenance Requests and Equipment Maintenance Items
        if (!lstCaseToInsert.isEmpty()) {
            insert lstCaseToInsert;
            System.debug('Cases to insert: ' + lstCaseToInsert);
        }

        /* Update case id (Maintenance_Request__c) of each item w/ the inserted case IDs */
        List<Equipment_Maintenance_Item__c> lstItemsToInsert = new List<Equipment_Maintenance_Item__c>();
        if(lstCaseToInsert.size() == mapItemsByCaseIndex.keySet().size()){
            for (Integer index : mapItemsByCaseIndex.keySet()) {
                Id caseID = lstCaseToInsert[index]?.Id;
                for(Equipment_Maintenance_Item__c item : mapItemsByCaseIndex.get(index)){
                    item.Maintenance_Request__c = caseID;
                    lstItemsToInsert.add(item);
                }
            }
        }

        if (!lstItemsToInsert.isEmpty()) {
            insert lstItemsToInsert;
            System.debug('Items to insert: ' + lstItemsToInsert);
        }


    }

    private static Integer calculateCycleInDays(List<Equipment_Maintenance_Item__c> items) {
        Integer cycleInDays = INTEGER_MAX_VALUE;

        for (Equipment_Maintenance_Item__c item : items) {
            if (item.Equipment__r?.Maintenance_Cycle__c != null &&
                item.Equipment__r.Maintenance_Cycle__c < cycleInDays) {
                cycleInDays = (Integer) item.Equipment__r.Maintenance_Cycle__c;
            }
        }
        
        return cycleInDays == INTEGER_MAX_VALUE ? 0 : cycleInDays;
    }

    private static Map<Id, List<Equipment_Maintenance_Item__c>> getItemsByCaseID(Set<Id> caseIDs){
        Map<Id, List<Equipment_Maintenance_Item__c>> mapItemsByRequestId = new Map<Id, List<Equipment_Maintenance_Item__c>>();
        for (Equipment_Maintenance_Item__c item : [
            SELECT Id, Maintenance_Request__c, Equipment__c, Equipment__r.Maintenance_Cycle__c
            FROM Equipment_Maintenance_Item__c
            WHERE Maintenance_Request__c IN :caseIDs
        ]) {
            if (!mapItemsByRequestId.containsKey(item.Maintenance_Request__c)) {
                mapItemsByRequestId.put(item.Maintenance_Request__c, new List<Equipment_Maintenance_Item__c>{ item });
            } else {
                mapItemsByRequestId.get(item.Maintenance_Request__c).add(item);
            }
        }
        return mapItemsByRequestId;
    }
  }
  ```
