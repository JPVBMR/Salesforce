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
  
### Freeze columns in horizontal scroll on lightning data table
  - How to create an aura component data table with horizontal scroll.
  - How to fix columns position on scroll. 
  
  ##### - HTML file
  ```html 

  <div class="table-scroll">
          <table>
              <thead>
                  <tr>
                      <th class="fix">
                          <div> Head </div>
                      </th>
                      <th>
                          <div> Head 1 </div>
                      </th>
                      <th>
                          <div> Head 2 </div>
                      </th>
                      <th>
                          <div> Head 3 </div>
                      </th>
                      <th>
                          <div> Head 4 </div>
                      </th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td class="fix">
                          <div> Lovesalesforceyes </div>
                      </td>
                      <td>
                          <div> Fix column </div>
                      </td>
                      <td>
                          <div> with </div>
                      </td>
                      <td>
                          <div> LWC </div>
                      </td>
                      <td>
                          <div> Salesforce </div>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  ```
  ##### - CSS file

  ```css

  table {
   background-color: white;
  }
  .table-scroll {
    overflow: auto;
  }
  table th{
    min-width: 140px;
    height: 50px;
    text-align: center;
  }
  table td{
    height: 50px;
    text-align: center;
  }
  .fix{
      position: sticky;
      left: 0;
      z-index: 1;
      background: #f8f8f8;
   }

   ```
 
