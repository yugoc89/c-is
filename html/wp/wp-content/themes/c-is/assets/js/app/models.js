define(["underscore","backbone"],function(e,o){var t=o.Model.extend({urlRoot:"/",idAttribute:"cid"}),n=o.Model.extend({urlRoot:"/",initialize:function(){},destroy:function(e){localStorage.removeItem(e)}});return{BasicModel:t,SingleModel:n}});