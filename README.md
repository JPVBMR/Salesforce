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
