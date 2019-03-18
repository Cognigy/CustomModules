# Cognigy Datepicker

With this Custom Module you can open the Cognigy Datepicker to let your users pick a date for a specific event. 

## Node: datepicker

This is the only node you need to open the Cognigy Datepicker. To specify the datepicker the user later sees, you can use several options: 

- eventName *(required)*
  - The name of the chosen **event**
- minDate
  - The minimum date to choose 
- maxDate
  - The maximum date to choose
- disableRange
  - If you want to disable a range of dates in the next step. If it is **true** you only have to add two dates in the next option. Otherwises give as much dates as you want.
- disable
  - Disable a range or list of dates.
- enableTime
  - If you want your user to add a time to the chosen date or not. If it is **true** it will open a time picker below the datepicker.
- mode
  - The mode of choosing dates: 
    - single
    - multiple
    - range

All options exept the first one, eventName, you can leave empty. E.g **minDate** wouldn't disable the previous dates if you leave it empty in the Cognigy AI.