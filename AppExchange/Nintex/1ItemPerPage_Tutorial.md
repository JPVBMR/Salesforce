# Word: Printing One Item Per Page
> Given a list of items/records saved in Salesforce.
> Generate a Word Document that displays all the items.
> (1 Item Per Page )

1. Go to Salesforce -> DocGen Packages
2. In the **Relationships/Apex Data Section** set the **Repeat By** as **Section** for the items that we want to print.
3. In Word :
   - Place your cursor where you want the repeating section to start.
   - Go to the "Developer" tab in the Word ribbon. If you don't see the "Developer" tab, you may need to enable it in Word options.
   - Click on "Rich Text Content Control" in the "Controls" group.
   - Right-click on the newly inserted content control and select "Properties".
   - Check the box labeled "Allow users to add and remove sections".
   - Place your cursor inside the repeating section content control.
   - Go to the "Insert" tab in the Word ribbon.
   - Click on "Page Break" in the "Pages" group. This will insert a page break inside the repeating section, ensuring that each section starts on a new page.

  ## Example: 
- List Of Items :
   - ![image](https://github.com/JPVBMR/Salesforce/assets/51756941/a2e3da67-6589-4ad4-95a1-5ca93c9e3062)

- Generated Document With 1 Item Per Page :
   - ![image](https://github.com/JPVBMR/Salesforce/assets/51756941/48c8072f-3529-43d6-8323-7f719476f773)
