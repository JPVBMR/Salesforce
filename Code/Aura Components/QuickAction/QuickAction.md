## Format Lightning Component Quick Action with Custom Header & Footer 
>**Note** 
>Add this aura component to an **Action** button on an object Record Page. This component overrides the standard **Header and Footer** of an Action component.
>Note that you must use implements="force:lightningQuickActionWithoutHeader" to remove the standard components and the *CSS code** at the end of the file has to be defined on the aura component. See forum at https://developer.salesforce.com/forums/?id=9060G0000005YtVQAU  
><p align="center">
><img src="https://github.com/JPVBMR/Salesforce/blob/main/Resources/Format%20Lightning%20Component%20Quick%20action%20with%20Custom%20headerfooter.PNG" >
></p>
  
```html

<aura:component implements="force:lightningQuickActionWithoutHeader,flexipage:availableForRecordHome,force:hasRecordId" access="global" >
    <aura:attribute name="recordId" type="String" />
    
    <!-- Dates  Attributes !-->
    <aura:attribute name="startDate" type="Date" />
    <aura:attribute name="endDate" type="Date" />
    
    <!-- Radio Button  !-->
    <aura:attribute name="radioValue" type="String" default=""/>
    <aura:attribute name="radioOptions" type="List" default="[
                                                        {'label': 'Option1', 'value': 'value1'},
                                                        {'label': 'Option2', 'value': 'value2'}
                                                        ]"/>
    
	<!-- Modal  Header !-->    
    <div class="modal-header slds-modal__header slds-size_1-of-1">
        <h4 class="title slds-text-heading--medium" >Apply Filters</h4>
    </div>
    
    <!-- Modal Body / Input Form -->    
    <div class="slds-modal__content slds-p-around--small  slds-size_1-of-1 slds-is-relative" aura:id="modalbody" id="modalbody">
        <form class="slds-form--stacked">
            
            <!-- Dates Section --> 
            <div class="slds-grid slds-gutters">
                <div class="slds-col">
                    <lightning:input type="date" name="input1" label="Start date" value="{!v.startDate}"/>
                </div>
                <div class="slds-col">
                    <lightning:input type="date" name="input1" label="End date" value="{!v.endDate}"/>
                </div>
            </div>

            <!-- PICKLIST SECTION  --> 
            <lightning:select aura:id="statusSelect" name="select" label="Choose one">
                <option value="">-- None --</option>
                <option value="value1">FCP</option>
                <option value="value2">SCB</option>
            </lightning:select>
            
            <!-- RADIO GROUP SECTION --> 
            <lightning:radioGroup name="radioGroupRequired"
                                  label="Choose one:"
                                  options="{! v.radioOptions }"
                                  value="{! v.radioValue }"
                                  type="radio"
                                  required="true"/>
        </form> 
    </div>   
    
    <!-- Modal Footer -->
    <div class="modal-footer slds-modal__footer slds-size_1-of-1">
        <div class="forceChangeRecordTypeFooter">
            <div class="slds-grid slds-grid_align-spread">
                <div class="slds-col">
                    <lightning:button label="Cancel" title="Cancel" onclick="{! c.cancel }"/>
                </div>
                <div class="slds-col">
                	<lightning:button variant="brand" label="Finish" title="Finish" onclick="{! c.finish }" />
                </div>
            </div>
        </div>
    </div>

    <!-- CSS to override/customize Header and Footer --> 
    <aura:html tag="style">
        .cuf-content {
        padding: 0 0rem !important;
        }
        .slds-p-around--medium {
        padding: 0rem !important;
        }       
        .slds-modal__content{
        overflow-y:hidden !important;
        height:unset !important;
        max-height:unset !important;
        }
    </aura:html>
</aura:component>

```





