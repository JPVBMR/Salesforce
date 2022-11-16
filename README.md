# Salesforce Docs & Solutions

### Relevant Links
  
  - Salesforce Academy CGI Trailmix : https://trailhead.salesforce.com/pt-BR/users/rgpbrito/trailmixes/salesforce-academy-cgi
  - Setup Visual Studio Code : https://www.apexhours.com/how-to-setup-visual-studio-code-for-salesforce/
  - How Use Lightning Component in Visualforce page : 
    - https://www.greytrix.com/blogs/salesforce/2021/03/30/how-to-use-lightning-component-in-visualforce-page/
    - https://developer.salesforce.com/docs/component-library/documentation/en/lwc/use_visualforce
  - Understanding Salesforce Files : https://driveconnect.me/blog/contentdocument-contentversion-and-contentdocumentlink/
  - Parse CSV File in Apex : https://nicocrm.wordpress.com/2011/03/06/parse-csv-file-in-salesforce-apex/
  - Custom Toast in Lightning : https://newstechnologystuff.com/2019/02/09/custom-toast-component-in-lightning/
   

### Salesforce Multi-Factor Authentication for nBS
>**Note** Multi factor authentication is a way of protecting user accounts against threats with the intent of stealing the account and have unauthorized access to a Salesforce environment. This protection consists of using multiple factors as a way of identifying the true owner of the user account, this includes a user+password combination with the addition of presenting a code from an authenticator app. Email, SMS and phone calls are not a form of MFA authorized by Salesforce.

  - To enable MFA for specific users you have to **enable Multi-Factor-Auth** on Systems Permissions of their Profiles and/ or assign a specific Permission Set w/ those System Permissions.
  - Check how to implement it as a user [here](Resources/Multi-Factor-Authentication.pdf)
  
### Nintex DocGen - Drawloop : Documents Generation
 
  #### Generate Apex Data Relationships in Drawloop Docgen [ 3 SF Objects ]
  >🤯 This example shows how to get data grouped by a parent object (Patient Product List), repeating by row all the Patient Product List Items records related to the parent object. Each Patient Product List Items record as a lookup to the object Product2, related by GCS_Product__c. Each Product2 have a field named Shipping_UoM that needs to match with the field Unit_Of_Measure__c of the Product_UoM object in order to get the correct Conversion_Factor_c. For this example it's used the Account as starting object of the package. 

```java

/******************************************************************************************************
Apex Class Name    : B2CCore_PPLItem_ByRow
Version            : Initial Version 
Created Date       : 15/11/2022
Release	           : R19
Function           : Class used to generate Apex Data Relationships in Drawloop Docgen in order to put  Product_UoM__c.Conversion_Factor_c in the same tag object (repeated by row)
*                    To be used in the "Patient Flowchart" DocGen packages.
*                    
* 
Modification Log:
-------------------------------------------------------------------------------------------------------
* Developer                         Date                         Description
* -----------------------------------------------------------------------------------------------------
* José Bravo                        15/11/2022                   Initial Version
* Renato Rosa						15/11/2022                   Initial Version
*******************************************************************************************************/


global class B2CCore_PPLItem_ByRow implements Loop.IApexDataSource {

    public Set<string> getGlobalDescribe() {
        return new Set<String>{
            'PPL_BySection', 'Section_Row'
        };
    }
    
    public List<Loop.ExternalData.DataObject> describeObjects(List<string> objNames) {
        List<Loop.ExternalData.DataObject> output = new List<Loop.ExternalData.DataObject>();
        for (string objName : objNames) {
            List<Loop.ExternalData.FieldInfo> outputFields = new List<Loop.ExternalData.FieldInfo>();
            if (objName == 'PPL_BySection') {
                outputFields.add(new Loop.ExternalData.FieldInfo('Id', Schema.DisplayType.ID));
                outputFields.add(new Loop.ExternalData.FieldInfo('GroupName', Schema.DisplayType.STRING));
            }
            else if( objName == 'Section_Row'){
                outputFields.add(new Loop.ExternalData.FieldInfo('Line', Schema.DisplayType.STRING));
                outputFields.add(new Loop.ExternalData.FieldInfo('Factor_Uom', Schema.DisplayType.STRING));
                outputFields.add(new Loop.ExternalData.FieldInfo('Product2Code', Schema.DisplayType.STRING));
                outputFields.add(new Loop.ExternalData.FieldInfo('Product2Description', Schema.DisplayType.STRING));
                outputFields.add(new Loop.ExternalData.FieldInfo('DailyQty', Schema.DisplayType.STRING));
                
                Loop.ExternalData.FieldInfo outputInfo = new Loop.ExternalData.FieldInfo('RowGroup', Schema.DisplayType.REFERENCE);
                outputInfo.referenceTo = 'PPL_BySection';
                outputFields.add(outputInfo);
            }

            output.add(new Loop.ExternalData.DataObject(objName, outputFields));
        }
        return output;
    }
    
    public Set<string> getChildRelationships(string objectName) {
        Set<string> childObjectNames = new Set<string>();
        if (objectName == 'PPL_BySection')
        	childObjectNames.add('Section_Row');
        return childObjectNames;
    }

    public Loop.ExternalData.QueryResultSet query(Loop.ExternalData.QueryRequestInfo requestInfo) {
    
        /* Get PPL associated with Starting Obj Account Id  */
        Id accountId = requestInfo.RecordId;
        List<GCS_Account_Product_List__c> lstPPLs = [SELECT Id FROM GCS_Account_Product_List__c WHERE  GCS_Patient__c =:accountId LIMIT 200];
        if(lstPPLs.isEmpty()){
            throw new QueryException('There are no Patient Product Lists available'); 
        }
        
        Set<Id> setPPLs_Ids = (new Map<Id,SObject>(lstPPLs)).keySet();
        
        /* Get All PPL_Items IN lstPPLs (WHERE GCS_Patient_Prescription__c IN  setPPLs_Ids) */
        List<GCS_Account_Product_List_Item__c> lstPPL_Items = [SELECT Id, GCS_Patient_Prescription__c, Line__c, GCS_Product__r.Id, GCS_Product__r.Shipping_UOM__c, GCS_Product__r.ProductCode, GCS_Product__r.Translated_Description__c, Daily_Qty__c FROM GCS_Account_Product_List_Item__c WHERE  GCS_Patient_Prescription__c IN: setPPLs_Ids ];
        if(lstPPL_Items.isEmpty()){
            throw new QueryException('There are no Patient Product List Items available'); 
        }
        
        /* Get All Product_UoM (Product__c IN lstPPL_Items.GCS_Product__r.Id) */
        List<Id> lstProduct2Ids = new List<Id>();
        for(GCS_Account_Product_List_Item__c ppl_item : lstPPL_Items){
            lstProduct2Ids.add(ppl_item.GCS_Product__r.id);
        }
        List<Product_UoM__c> lstProducts_UOM = [SELECT Id,Product__c, Conversion_Factor__c, Unit_of_Measure__c FROM Product_UoM__c WHERE Product__c IN: lstProduct2Ids];

        /* Set Output Structure */
        Loop.ExternalData.QueryResultSet results = new Loop.ExternalData.QueryResultSet();
        Loop.ExternalData.QueryResult lineItemGroups = new Loop.ExternalData.QueryResult('PPL_BySection', new List<string> { 'Id', 'GroupName' });
        Loop.ExternalData.QueryResult lineItems = new Loop.ExternalData.QueryResult('Section_Row', new List<string>{ 'Line', 'Factor_Uom','Product2Code', 'Product2Description', 'DailyQty', 'RowGroup' });

        /* Group By PPL.Id */
        Map<string, List<SectionRow_Wrapper>> groupedLineItems = new Map<string, List<SectionRow_Wrapper>>();
        for(GCS_Account_Product_List__c parentPPL: lstPPLs){
            for(GCS_Account_Product_List_Item__c ppl_item: lstPPL_Items){                
                if(parentPPL.Id == ppl_item.GCS_Patient_Prescription__c){
                    SectionRow_Wrapper rowValues = new SectionRow_Wrapper();
                    rowValues.Line = String.valueOf(ppl_item.Line__c);
                    rowValues.Factor_Uom = '';
                    rowValues.Product2Code = ppl_item.GCS_Product__r.ProductCode;
                    rowValues.Product2Description = ppl_item.GCS_Product__r.Translated_Description__c;
                    rowValues.DailyQty = (ppl_item.Daily_Qty__c == True ? 'Yes' : 'No' );
                    
                    rowValues.RowGroup = parentPPL.Id;
                    
                    /** PPLItem.Product2.ID and PPLItem.Product2.ShippingUoM  needs to match  ProductUoM.ID and ProductUoM.UnitOfMeasure **/
                    for(Product_UoM__c product_UoM : lstProducts_UOM){
                        if(ppl_item.GCS_Product__r.Id == product_UoM.Product__c &&  ppl_item.GCS_Product__r.Shipping_UOM__c == product_UoM.Unit_of_Measure__c ){            
                            rowValues.Factor_Uom = String.valueOf(product_UoM.Conversion_Factor__c);
                            break;
                        }
                    }
                    
                    if ( !groupedLineItems.containsKey(parentPPL.Id) ){
                        groupedLineItems.put(parentPPL.Id, new List<SectionRow_Wrapper>());
                    }
                    groupedLineItems.get(parentPPL.Id).add(rowValues);
                }
                
            }
        }
        
        for (String ppl_ID : groupedLineItems.keySet()) {
            
            lineItemGroups.rows.add(new List<string>{ ppl_ID, ppl_ID });
            for (SectionRow_Wrapper row : groupedLineItems.get(ppl_ID)) {
                List<string> rowValues = new List<string>();
                
                rowValues.add(row.Line);
                rowValues.add(row.Factor_Uom);
                rowValues.add(row.Product2Code);
                rowValues.add(row.Product2Description);
                rowValues.add(row.DailyQty);
                rowValues.add(row.RowGroup);
                
                lineItems.rows.add(rowValues);
            }
        }


        for (string objectName : requestInfo.GetObjectNames()) {
            if (objectName == 'PPL_BySection'){
                results.add(lineItemGroups);
            }
            else if( objectName == 'Section_Row' ){
                results.add(lineItems);
            }                
        }     
        return results;
    }

    private class SectionRow_Wrapper {
        String Line;
        String Factor_Uom;
        String Product2Code;
        String Product2Description;
        String DailyQty;
        String RowGroup;
    }
}

```
