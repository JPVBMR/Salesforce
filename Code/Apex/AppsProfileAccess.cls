/* This script outputs the Profiles with access to each App in the org */

List<AppMenuItem> lstAppMenuItems = [
    SELECT Id, ApplicationId, Label, Name, Type
    FROM AppMenuItem
];

/* 1. Get ApplicationId */
Map<Id, List<Id>> mapAppProfiles = new Map<Id, List<Id>>();
for(AppMenuItem itemX: lstAppMenuItems){
    mapAppProfiles.put(itemX.ApplicationId, new List<Id>());
}


/* 2. Get Profiles Available For Those ApplicationIds */
List<SetupEntityAccess> lstAccesses = [   
    SELECT Id, SetupEntityId, ParentId,  Parent.ProfileId, SetupEntityType
    FROM SetupEntityAccess
    WHERE SetupEntityId IN: mapAppProfiles.keySet() 
    AND Parent.Type = 'Profile'
];


/* 3. Group By ApplicationId (setupEntityId) */
Set<Id> setProfileIds = new Set<Id>();
for(SetupEntityAccess accessX: lstAccesses){
    mapAppProfiles.get(accessX.SetupEntityId).add(accessX.Parent.ProfileId);
    setProfileIds.add(accessX.Parent.ProfileId);
}

/* 4. Get Profile Names */
Map<Id,Profile> mapProfiles = new Map<Id,Profile>([SELECT Id, Name FROM Profile WHERE Id IN:setProfileIds]);

/* 5. Print: App Name | List Profiles Names */
for( AppMenuItem itemX: lstAppMenuItems ){
    String appName = itemX.Name;
    System.debug('**** App: '+appName +' *****\n');

    List<Id> lstProfilesSelectedForThisApp = mapAppProfiles.get(itemX.applicationId);
    for(Id idX: lstProfilesSelectedForThisApp){
        System.debug(mapProfiles.get(idX).Name +'\n');
    } 
}
