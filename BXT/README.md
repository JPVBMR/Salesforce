# Sessions & Notes

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
