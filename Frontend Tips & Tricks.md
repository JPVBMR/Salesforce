# Salesforce Frontend HTML & CSS

## Format Lightning Component Quick action with Custom header/footer : 




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
