# Salesforce Frontend HTML & CSS 



## Custom Toast - Lightning Component
>**Note** 
> Create a custom toast in an aura component. This component has 2 main attributes : type, message.
> The toast type,can be 'error', 'warning', 'success', or 'info'.
> <p align="center">
>    	<img  src="https://github.com/JPVBMR/Salesforce/blob/main/Resources/Screenshots/Capture.PNG?raw=true">
>	<img  src="https://github.com/JPVBMR/Salesforce/blob/main/Resources/Screenshots/Capture1.PNG?raw=true">
>	<img  src="https://github.com/JPVBMR/Salesforce/blob/main/Resources/Screenshots/Capture2.PNG?raw=true">
> </p>

```html

	<!-- Toast Attributes -->
	<aura:attribute name="showToast" type="Boolean" default="false" />
	<aura:attribute name="toastMessage" type="String" default='' />
	<aura:attribute name="messageType" type="String" default='error' />


	<!-- Toast Section -->
	<aura:if isTrue="{!v.showToast}">

	<div aura:id="toastModel" style="height:4rem;">
	    <div class="slds-notify_container slds-is-relative">
		<div class="{!'slds-notify slds-notify_toast slds-theme_'+v.messageType}" role="status">
		    <span class="slds-assistive-text">{!v.messageType}</span>
		    <span class="{!'slds-icon_container slds-icon-utility-'+v.messageType+' slds-icon-utility-success slds-m-right_small slds-no-flex slds-align-top'}" title="{!v.toastMessage}">
			<lightning:icon iconName="{!'utility:'+v.messageType}" size="small" variant="inverse" styleclass="slds-icon slds-icon_small"/>
		    </span>
		    <div class="slds-notify__content">
			<h2 class="slds-text-heading_small ">{!v.toastMessage}</h2>
		    </div>
		    <div class="slds-notify__close">
			<button class="slds-button slds-button_icon slds-button_icon-inverse" title="Close" onclick="{!c.closeModel}">
			    <lightning:icon iconName="utility:close" size="small" variant="inverse"/>
			    <span class="slds-assistive-text">Close</span>
			</button>
		    </div>
		</div>
	    </div>
	</div>

	</aura:if>

```

- In the controller you can use the following methods to show/close the toast.
- You can also specify how much time should the toast be visible.
	```js
	    showToast: function(component, message, type, duration){
	    	component.set("v.messageType", type);
		component.set("v.toastMessage", message);
		component.set("v.showToast",true);
		if(duration > 0){
			setTimeout($A.getCallback(function () {
			    component.set('v.showToast', false);
			}), duration);
		}
	    },

	```

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







## Freeze columns in horizontal scroll on lightning data table
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
