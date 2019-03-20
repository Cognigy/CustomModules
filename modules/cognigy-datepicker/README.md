# Cognigy Datepicker

With this Custom Module you can open the Cognigy Datepicker to let your users pick a date for a specific event. 

## Node: datepicker

This is the only node you need to open the Cognigy Datepicker. To specify the datepicker the user later sees, you can use several options: 

- EventName *(required)*
  - The name of the chosen **event**
- Language *(required)*
  - The language of the datepicker
  - **IMPORTANT**: To get the chosen date from the *ci.slots.DATE* key in the CognigyInput, the datepicker has to have the same language as the Flow in which you use this Custom Module. Otherwise the chosen date is stored in *ci.data*

- MinDate
  - The minimum date to choose 
- MaxDate
  - The maximum date to choose
- DisableRange
  - If you want to disable a range of dates in the next step. If it is **true** you only have to add two dates in the next option. Otherwises give as much dates as you want.
- Disable
  - Disable a range or list of dates.
- EnableTime
  - If you want your user to add a time to the chosen date or not. If it is **true** it will open a time picker below the datepicker.
- Mode
  - The mode of choosing dates: 
    - single
    - multiple
    - range
- OpenPickerButtonText
  - This is the text of the button which shows up in the webchat to open the datepicker. Use something like "Open Datepicker" or in "Wähle ein Datum" in German.
- CancelButtonText
  - The text of the button inside the datepicker to close the window without choosing any date. Use something like "Cancel" or "Abort" in English and "Abbrechen" in German.
- SubmitButtonText
  - The text of the button to submit the chosen date inside the datepicker. Use something like "Submit" or "Weiter" in German.

All options exept the first one, eventName, you can leave empty. E.g **minDate** wouldn't disable the previous dates if you leave it empty in the Cognigy AI.