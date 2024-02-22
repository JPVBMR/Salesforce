import { LightningElement, wire, api } from "lwc";

import getTableEntries from "@salesforce/apex/FieldHistoryController.getTableEntries";

 const COLUMNS = [
    { label: "Fields Label",    fieldName: 'fieldLabel',                type: "text" },
    { label: "Field API Name",  fieldName: 'fieldAPIName',              type: "text" },
    { label: "Old Value",       fieldName: 'oldValue',                  type: "text" },
    { label: "New Value",       fieldName: 'newValue',                  type: "text" },
    { label: "Changed By",      fieldName: 'changedByLink',             type: 'url',    typeAttributes: { label: { fieldName: 'changedByName' }, target : '_blank' } },
    { label: "Changed at",      fieldName: 'changeTimestamp',           type: "date",   typeAttributes:{ year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit" } }
];
export default class FieldHistoryList extends LightningElement {
    @api recordId;
    lstRecords;
    columns = COLUMNS;

    @wire(getTableEntries, { recordId: '$recordId' })
    result;

    get cardTitle() {
        let recordCount = 0;
        
        if (this.result.data && this.result.data.length > 0) {
            recordCount = this.result.data.length;
            this.lstRecords = this.result.data;
        }
        return `Fields Update History (${recordCount})`;
    }

}
