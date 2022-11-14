# Sessions & Notes

> **Note** Out of Office Status Message  
Hello,Thank you for your message. I’m currently out of the office with limited access to my email. If you need immediate assistance please contact me on my mobile (00 351 *** *** ***), otherwise I will promptly respond to your email upon my return on 18th November. Best Regards *******

## B2C core onboarding #6 - Moving code in environments

> **Note** The purpose of this session is to present auto-rabit and the steps for moving code when developed. We'll be using **AutoRabit** and **Bitbucket**

### Bitbucket Repository

- We've to be on Baxter's Network
- GCE is the core

### AutoRabit (For Admins)

- Select GCE Prod repo.
- Setup Credentials :
  - Select Admin-> Credentials -> Set your credentials
- Version Control:
  - Select Admin -> VC REPO's
    - Create/Register a branch ( You can create it on Bitbucket and then register it on AutoRabit )
- Connect to Sandbox :
  - Admin --> SF ORG MGMT

### Deploy Sandbox Changes:

- Ex. Modify any class.
- **Autorabit** -> EZ Commit -> Choose Org and Author -> Select the Target Repo and Branch.
- You can select the **Jira** topic (User Story, Sprints ...) related with this commit.
- Select the **Metadata** to commit
- Review Artifact and Compare Changes
- Generate Diff Report at Current Head - Send it to my Manager/Reviewer (Takes some time)
- Select Run Static Code Analysis
- Select Validate Deployment
- Specify Apext Tests to run

### EZ - Merge

> **Note** On branch code conflict we can use **EZ-Merge**

- From Branch : Select the problematic Branch
- Merge Type
  - Single Revision - To select only one and generates a new commit Id
  - Entire Branch
- Conflit Resolution Type :
  - Manually resolve conflit
- Generate Diff Report
- Validate Deployment and Select Tests to run

## DevOps Session - Autorabit hands-on example (19/09/2022)
  > **Note** Recorded Meeting : https://groupecgi-my.sharepoint.com/personal/inacio_ferreira_cgi_com/_layouts/15/stream.aspx?id=%2Fpersonal%2Finacio%5Fferreira%5Fcgi%5Fcom%2FDocuments%2FRecordings%2FDevOps%20Session%20%2D%20Autorabit%20hands%2Don%20example%2D20220919%5F100320%2DMeeting%20Recording%2Emp4&ga=1

  - Login to AutoRabit and use Bitbucket and Salesforce Credentials:
    - AutoRabit -> **SF ORG MGMT**: - Set Sandbox Org Credentials
    ![image](https://user-images.githubusercontent.com/51756941/190984603-57855817-2a2a-4e78-9eaf-ae1aeb54d645.png)
    
    - Credentials: Set Bitbucket Credentials
  
  - Commit -> Create New -> **EZ Commit** : 
    ![image](https://user-images.githubusercontent.com/51756941/190985124-7e4ebeec-0753-4048-bcaa-eafdda52f20c.png)
    

## Bug/Defect Fixing - Jira Procedure
    
   > **Note** The following steps apply to Dockgen Package - Drawloop 
  - Alterar os post deployment steps das stories para adicionar o "removam a versao antiga"
  - Adicionar comment nos Post Deployment a dizer que é para executar novamente
  - Fechar defects (adicionar bug category) e comentario a dizer que ja esta fixed e para re-testarem
  - Mover USs para Deploy Sit
  - Pedir ao Naveen para fazer re-deploy das stories
      


