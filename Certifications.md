# Certifications - RoadMap & Notes

### Salesforce Platform Developer 1 
  
  - Study Guide : https://trailhead.salesforce.com/pt-BR/credentials/platformdeveloperi
  - Exams Info & Questions : https://www.freecram.net/vendor/Salesforce.html
  
### Practice Exams Grades:
  - ![](https://geps.dev/progress/67) **(15/09)** 
  - ![](https://geps.dev/progress/88) **(16/09)**



### Apex Guide

  ### Using the with sharing, without sharing, and inherited sharing Keywords : 
> **Note** Use the **with sharing** or **without sharing** keywords on a class to specify whether sharing rules must be enforced. Use the **inherited sharing** keyword on a class to run the class in the sharing mode of the class that called it.
> https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_classes_keywords_sharing.htm

  -  **with sharing** : Explicitly setting this keyword ensures that Apex code runs in the current user context. Apex code that is executed with the executeAnonymous call and Connect in Apex always execute using the sharing rules of the current user.
  -  **without sharing** :  To ensure that the sharing rules for the current user are not enforced. For example, you can explicitly turn off sharing rule enforcement when a class is called from another class that is declared using with sharing.
  -  **Inherited Sharing** : To enforce the sharing rules of the class that calls it. Using inherited sharing is an advanced technique to determine the sharing mode at runtime and design Apex classes that can run in either with sharing or without sharing mode.
  
  ### How to execute a SOSL query within Apex
```js 
List<List<SObject>> soslResults = [FIND ‘SearchTerm’ IN ALL FIELDS RETURNING Account, Contact];
```
    
   - SOSL queries return a List<List<SObject>>, with each list being the results for a specific SObject type, the order of which is the same as defined within the query. I.e. if Account was the third SObject in the RETURNING clause, the list at the second index would be a list of the Account results. This is because SOSL queries are performed against multiple objects at once.
  
  ### What are the use cases for the Test.startTest() and Test.stopTest() methods when used within a test class?
  
  - Test classes come in three distinct parts:
    - Setup – preparing data and the runtime environment for your testing scenario
    - Execution – executing the code you wish to test
    - Validation – verifying the results of the executed test against the expected results

  - The process of setting up and preparing a test can result in the consumption of many governor limits before the actual code we wish to validate has been run, for example having to insert Accounts if you wish to validate a rollup from Opportunity.

  - This is not an ideal scenario as it causes our test execution to potentially not run in a realistic environment. We can use the Test.startTest() method just before executing the code we wish to test to assign that block of code a new set of governor limits. We can then call Test.startTest() once we’ve finished our execution and are ready to validate our results.

  - If we are testing asynchronous apex (e.g. a batch class), since the code gets flagged to run at an unknown future date, we would not be able to write tests for any asynchronous methods. Instead by wrapping the code execution in Test.startTest() and Test.stopTest(), when the stopTest method is called, the async code is executed and so we can test the results of the execution within our test class.

      
