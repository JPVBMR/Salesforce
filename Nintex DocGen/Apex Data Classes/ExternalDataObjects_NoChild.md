# Apex Data Relationships - Drawloop DocGen Packages

>**Note** The following samples demonstrates how to implement the **IApexDataSource** interface
to define and provide external data for use in Drawloop DocGen Pacages.

- First let's create an Apex Class to use in the Data section of our Drawloop package.
- This class must **implements Loop.IApexDataSource**
- Define the List of Objects this class can return:
  ```java    
    global class DrawloopApexExample implements Loop.IApexDataSource {
      public Set<string> getGlobalDescribe() {
          return new Set<String>{'MyObject1', 'MyObject2', 'MyObject3'};
      }
    (...)
  ```   
- Define the fields and structure of each object
  ```java
    public List<Loop.ExternalData.DataObject> describeObjects(List<string> objNames) {
      List<Loop.ExternalData.DataObject> output = new List<Loop.ExternalData.DataObject>();
      
      for (string objName : objNames) {
          List<Loop.ExternalData.FieldInfo> outputFields = new List<Loop.ExternalData.FieldInfo>();
          
          if (objName == 'MyObject1') {
              outputFields.add(new Loop.ExternalData.FieldInfo('Id', Schema.DisplayType.STRING)); 
              outputFields.add(new Loop.ExternalData.FieldInfo('MyCustomField2', Schema.DisplayType.STRING));
          }
          else if( objName == 'MyObject2'){
              outputFields.add(new Loop.ExternalData.FieldInfo('MyCustomField3', Schema.DisplayType.STRING));
              outputFields.add(new Loop.ExternalData.FieldInfo('MyCustomField4', Schema.DisplayType.STRING));
          }
          else if( objName == 'MyObject3'){
              outputFields.add(new Loop.ExternalData.FieldInfo('MyCustomField6', Schema.DisplayType.STRING));
          }

          output.add(new Loop.ExternalData.DataObject(objName, outputFields));
      }
      return output;
    }
  ```
- Define the List Of Childs for each object (in this case we don't have) **/
  ```java
    public Set<string> getChildRelationships(string objectName) {
      Set<string> childObjectNames = new Set<string>();
      return childObjectNames;
    }
  ```
- Build the Output Structure and do aditional code  
  ```java   
    public Loop.ExternalData.QueryResultSet query(Loop.ExternalData.QueryRequestInfo requestInfo) {
      /* Get Request Parameters */
      CASE_ID = requestInfo.RecordId; // Package Starting Object
      DRAWLOOP_PACKAGE_ID = requestInfo.DDPId;

      /* Set Output Structure */
      Loop.ExternalData.QueryResultSet results = new Loop.ExternalData.QueryResultSet();

      Loop.ExternalData.QueryResult results_obj1 = new Loop.ExternalData.QueryResult('MyObject1', new List<string> { 	
          'Id', 'MyCustomField2'	
       } );

      Loop.ExternalData.QueryResult results_obj2 = new Loop.ExternalData.QueryResult('MyObject2', new List<string> { 	
          'MyCustomField3', 'MyCustomField4'	
       } );

      Loop.ExternalData.QueryResult results_obj3 = new Loop.ExternalData.QueryResult('MyObject3', new List<string> { 	
          'MyCustomField6'	
       } );
       
       // do aditional processes...
       
      /* Set Objet field values (in this case we are just retrieving on record per object) but you can add the rows you want to the results_obj  **/
      results_obj1.rows.add(new List<String>{
        'myId', 'FC Porto'  
      });
      
      results_obj2.rows.add(new List<String>{
        'FC Porto', String.valueOf(System.today()) 
      });
      
      results_obj3.rows.add(new List<String>{
        'FC Porto'
      });


      for (string objectName : requestInfo.GetObjectNames()) {
          if (objectName == 'MyObject1'){
              results.add(results_obj1);
          }   
          if( objectName == 'MyObject2'){
              results.add(results_obj2);
          }
          if( objectName == 'MyObject3'){
              results.add(results_obj3);
          }
      }     
      return results;
    }
  ```
- Deploy the changes to the org and select those objects in the Data Section of the Drawloop Package.
