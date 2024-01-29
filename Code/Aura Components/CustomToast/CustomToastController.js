/* Add this to the component controller */
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
