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
