import { LightningElement, api, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats';

// ...
const SUCCESS_TITLE     = 'Success';
const MESSAGE_SHIP_IT   = 'Ship it!';
const SUCCESS_VARIANT   = 'success';
const ERROR_TITLE       = 'Error';
const ERROR_VARIANT     = 'error';
export default class BoatSearchResults extends LightningElement {
    @api selectedBoatId;
    columns = [];
    boatTypeId = '';
    boats;
    isLoading = false;
    error;
    
    // wired message context
        messageContext;
        
    // wired getBoats method 
    @wire(getBoats,  {boatTypeId: '$boatTypeId'})
    wiredBoats({ data, error }) {
        if (data) {
            this.boats = data;
        } else if (error) {
            this.error = error;
            console.log('wiredBoats error: ', error);
        }
    }
    
    // public function that updates the existing boatTypeId property
    // uses notifyLoading
    
    @api searchBoats(boatTypeId) { 
        this.isLoading = true;
        this.boatTypeId = boatTypeId;
    }
  
    // this public function must refresh the boats asynchronously
    // uses notifyLoading
    refresh() { }
    
    // this function must update selectedBoatId and call sendMessageService
    updateSelectedTile() { }
    
    // Publishes the selected boat Id on the BoatMC.
    sendMessageService(boatId) { 
        // explicitly pass boatId to the parameter recordId
    }
    
    // The handleSave method must save the changes in the Boat Editor
    // passing the updated fields from draftValues to the 
    // Apex method updateBoatList(Object data).
    // Show a toast message with the title
    // clear lightning-datatable draft values
    handleSave(event) {
        // notify loading
        const updatedFields = event.detail.draftValues;
        // Update the records via Apex
        updateBoatList({data: updatedFields})
        .then(() => {})
        .catch(error => {})
        .finally(() => {});
    }
    // Check the current value of isLoading before dispatching the doneloading or loading custom event
    notifyLoading(isLoading) { }
}
