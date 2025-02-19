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

### :white_check_mark: Automate record creation using Apex triggers
   
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
### :white_check_mark: Synchronize Salesforce data with an external system
- Implement an Apex class (called WarehouseCalloutService) that implements the queueable interface and makes a callout to the external service used for warehouse inventory management.
- This service receives updated values in the external system and updates the related records in Salesforce.
- Enqueue the job at least once to confirm that it's working as expected.

```java
public class WarehouseCalloutService implements Queueable, Database.AllowsCallouts {

    private static final String WAREHOUSE_URL = 'https://th-superbadge-apex.herokuapp.com/equipment';
    
    @future(callout=true)
    public static void syncEquipmentsWithExternalSystem(){
        /* Specify Http Request Properties */
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint(WAREHOUSE_URL);
        req.setMethod('GET');
        req.setHeader('Content-Type', 'application/json');

        /* Send the request and save response */
        HttpResponse res = http.send(req);
        
        List<Product2> lstEquipmentsToUpdate = new List<Product2>();

        
        if (res.getStatusCode() == 200){
            List<Object> jsonResponse = (List<Object>)JSON.deserializeUntyped(res.getBody());
            
            //class maps the following fields: replacement part (always true), cost, current inventory, lifespan, maintenance cycle, and warehouse SKU
            //warehouse SKU will be external ID for identifying which equipment records to update within Salesforce
            for (Object eq : jsonResponse){
                Map<String,Object> mapJson = (Map<String,Object>)eq;
                Product2 equipmentX = new Product2();
                equipmentX.Replacement_Part__c = (Boolean) mapJson.get('replacement');
                equipmentX.Name = (String) mapJson.get('name');
                equipmentX.Maintenance_Cycle__c = (Integer) mapJson.get('maintenanceperiod');
                equipmentX.Lifespan_Months__c = (Integer) mapJson.get('lifespan');
                equipmentX.Cost__c = (Integer) mapJson.get('cost');
                equipmentX.Warehouse_SKU__c = (String) mapJson.get('sku');
                equipmentX.Current_Inventory__c = (Double) mapJson.get('quantity');
                equipmentX.ProductCode = (String) mapJson.get('_id');
                lstEquipmentsToUpdate.add(equipmentX);
            }
            
            if (lstEquipmentsToUpdate.size() > 0){
                upsert lstEquipmentsToUpdate;
                System.debug('Your equipment was synced with the warehouse one');
            }
        
        }        
    }
    
    public void execute(QueueableContext context){
		  syncEquipmentsWithExternalSystem();
    }
    
    
}
```

### :white_check_mark: Schedule synchronization
- Build scheduling logic that executes your callout and runs your code daily.
- The name of the schedulable class should be WarehouseSyncSchedule, and the scheduled job should be named WarehouseSyncScheduleJob.
- ```java
  global with sharing class WarehouseSyncSchedule implements Schedulable {
    global void execute(SchedulableContext sc){
        System.enqueueJob(new WarehouseCalloutService());
    }
  }
  
  // Execute in anonymous apex
  String jobID = System.schedule('WarehouseSyncScheduleJob', '0 0 2 * * ?', new WarehouseSyncSchedule());
  ```

### :white_check_mark: Create Unit Tests

- Create an apex test class named - **MaintenanceRequestHelperTest**
```java
  @IsTest
public with sharing class MaintenanceRequestHelperTest {
    @TestSetup
    static void setupTestData() {
        // Create test Vehicle
        Vehicle__c vehicle = new Vehicle__c(
            Name = 'Test Vehicle', 
            VIN_Number__c = 'VIN12345'
        );
        insert vehicle;

       // Create a test Equipment (renamed Product) that meets lookup filter conditions
        Product2 equipment1 = new Product2(Name = 'Brake Pads', ProductCode = 'EQ123', IsActive = true, Maintenance_Cycle__c = 30, Family = 'Spare Parts', Replacement_Part__c=true);
        Product2 equipment2 = new Product2(Name = 'Engine Oil', ProductCode = 'EQ456', IsActive = true, Maintenance_Cycle__c = 45, Family = 'Spare Parts', Replacement_Part__c=true);
        insert new List<Product2>{equipment1, equipment2};

        // Create test Maintenance Requests (Cases)
        List<Case> maintenanceRequests = new List<Case>();
        for (Integer i = 0; i < 3; i++) {
            maintenanceRequests.add(new Case(
                Vehicle__c = vehicle.Id,
                Type = 'Repair',
                Subject = 'Test Repair Request ' + i,
                Status = 'Open',
                Date_Reported__c = Date.today()
            ));
        }
        insert maintenanceRequests;

        // Create multiple Equipment Maintenance Items per Maintenance Request
        List<Equipment_Maintenance_Item__c> equipmentItems = new List<Equipment_Maintenance_Item__c>();
        for (Case req : maintenanceRequests) {
            // Assign multiple pieces of equipment to each case
            equipmentItems.add(new Equipment_Maintenance_Item__c(Maintenance_Request__c = req.Id, Equipment__c = equipment1.Id));
            equipmentItems.add(new Equipment_Maintenance_Item__c(Maintenance_Request__c = req.Id, Equipment__c = equipment2.Id));
        }
        insert equipmentItems;
    }

    @isTest
    static void testTriggerCreatesRoutineMaintenanceWithMultipleItems() {
        // Retrieve test Maintenance Requests
        List<Case> maintenanceRequests = [SELECT Id, Vehicle__c, Status, Type FROM Case WHERE Type = 'Repair'];

        // Verify test data exists
        System.assert(maintenanceRequests.size() > 0, 'Test maintenance requests should exist.');

        // Update requests to "Closed" to trigger logic
        for (Case req : maintenanceRequests) {
            req.Status = 'Closed';
        }

        Test.startTest();
        update maintenanceRequests;
        Test.stopTest();

        // Verify Routine Maintenance Requests were created
        List<Case> routineRequests = [SELECT Id, Type, Vehicle__c FROM Case WHERE Type = 'Routine Maintenance'];
        System.assertEquals(maintenanceRequests.size(), routineRequests.size(), 'A Routine Maintenance case should be created for each closed Repair request.');

        // Verify Equipment Maintenance Items were copied correctly
        List<Equipment_Maintenance_Item__c> newEquipmentItems = [SELECT Id, Maintenance_Request__c, Equipment__c FROM Equipment_Maintenance_Item__c];
        System.assert(newEquipmentItems.size() > maintenanceRequests.size(), 'Each new Routine Maintenance case should have multiple Equipment Maintenance Items.');

        // Ensure multiple equipment items were added to a single case (hitting mapItemsByCaseIndex.get(caseIndex).add(newItem);)
        Map<Id, Integer> caseToEquipmentCount = new Map<Id, Integer>();
        for (Equipment_Maintenance_Item__c item : newEquipmentItems) {
            if (!caseToEquipmentCount.containsKey(item.Maintenance_Request__c)) {
                caseToEquipmentCount.put(item.Maintenance_Request__c, 1);
            } else {
                caseToEquipmentCount.put(item.Maintenance_Request__c, caseToEquipmentCount.get(item.Maintenance_Request__c) + 1);
            }
        }
        for (Integer count : caseToEquipmentCount.values()) {
            System.assert(count > 1, 'Each Routine Maintenance request should have multiple Equipment Maintenance Items.');
        }
    }   
}
```

- Create a mock class named - **WarehouseCalloutServiceMock** - to simulate the callout respons from the external system:
```java
@isTest
global class WarehouseCalloutServiceMock implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest req) {
        // Simulate a valid JSON response
        String mockJsonResponse = '[{'+
            '"replacement": true,'+
            '"name": "Brake Pads",' +
            '"maintenanceperiod": 30,' +
            '"lifespan": 24,' +
            '"cost": 100,' +
            '"sku": "SKU123",' +
            '"quantity": 50,' +
            '"_id": "EQ12345"' +
        '}]';

        HttpResponse res = new HttpResponse();
        res.setHeader('Content-Type', 'application/json');
        res.setBody(mockJsonResponse);
        res.setStatusCode(200);
        return res;
    }
}
```

- Create a test class named - **WarehouseCalloutServiceTest** - to test the callout to the external system:
```java
@isTest
private class WarehouseCalloutServiceTest {

    @isTest
    static void testSyncEquipmentsWithExternalSystem() {
        // Set up the mock response
        Test.setMock(HttpCalloutMock.class, new WarehouseCalloutServiceMock());

        // Verify no Product2 records exist before the callout
        Test.startTest();
        	WarehouseCalloutService.syncEquipmentsWithExternalSystem();
        Test.stopTest();

        // Query the inserted Product2 records
        List<Product2> equipments = [SELECT Name, Maintenance_Cycle__c, Lifespan_Months__c, 
                                      Cost__c, Warehouse_SKU__c, Current_Inventory__c, ProductCode
                                      FROM Product2 WHERE Warehouse_SKU__c = 'SKU123'];

        // Assertions to validate that data is inserted correctly
        System.assertEquals(1, equipments.size(), 'One equipment record should be created.');
        System.assertEquals('Brake Pads', equipments[0].Name);
        System.assertEquals(30, equipments[0].Maintenance_Cycle__c);
        System.assertEquals(24, equipments[0].Lifespan_Months__c);
        System.assertEquals(100, equipments[0].Cost__c);
        System.assertEquals('SKU123', equipments[0].Warehouse_SKU__c);
        System.assertEquals(50.0, equipments[0].Current_Inventory__c);
        System.assertEquals('EQ12345', equipments[0].ProductCode);
    }

    @isTest
    static void testQueueableExecution() {
        // Set up the mock response
        Test.setMock(HttpCalloutMock.class, new WarehouseCalloutServiceMock());

        Test.startTest();
        	System.enqueueJob(new WarehouseCalloutService());
        Test.stopTest();

        // Ensure a job is enqueued
        System.assertEquals(1, [SELECT COUNT() FROM AsyncApexJob WHERE JobType = 'Queueable'], 
                            'A Queueable job should be enqueued.');
    }
}
```

- Create a test class named - **WarehouseSyncScheduleTest** - to test the job scheduler:
```java
@isTest
private class WarehouseSyncScheduleTest {
    
    @isTest
    static void testWarehouseSyncScheduling() {
        // Set up the mock response for the callout
        Test.setMock(HttpCalloutMock.class, new WarehouseCalloutServiceMock());

        // Start test execution block
        Test.startTest();
        
            // Schedule the job
            String jobId = System.schedule('Test Warehouse Sync', '0 0 12 * * ?', new WarehouseSyncSchedule());
            
        // Stop test execution block
        Test.stopTest();

        // Query the scheduled job
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, State 
                          FROM CronTrigger WHERE Id = :jobId];

        // Assertions to validate scheduling
        System.assertNotEquals(null, jobId, 'Job ID should not be null.');
        System.assertEquals('0 0 12 * * ?', ct.CronExpression, 'Cron expression should match.');
        System.assertEquals('WAITING', ct.State, 'Scheduled job should be in WAITING state.');

        // Check that the Queueable job was enqueued
        System.assertEquals(1, [SELECT COUNT() FROM AsyncApexJob WHERE JobType = 'Queueable'], 
                            'A Queueable job should be enqueued.');
    }
}

```
