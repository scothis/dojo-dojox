dojo.provide("dojox.form.BusyButton");

dojo.require("dijit.form.Button");

dojo.declare("dojox.form.BusyButton",
	[dijit.form.Button], 
	{
		
	isBusy: false,	
	busyLabel: "Loading...", // text while button is busy
	timeout: null, // timeout, should be controlled by xhr call
	useIcon: true, // use a busy icon
 
	iconSrc: dojo.moduleUrl("dojox.form.resources", "loading.gif"),
		
	postCreate: function(){
		// summary:
		//	stores initial label and timeout for reference
		this._label = this.containerNode.innerHTML;
		this._initTimeout = this.timeout;
		
		// for initial busy buttons
		if (this.isBusy){
			this.makeBusy();
		}
	},
	
	makeBusy: function(){
		// summary:
		//	sets state from idle to busy
		this.isBusy = true;
		this.setAttribute("disabled", true);
			
		this.setLabel(this.busyLabel, this.timeout);
	},
	
	cancel: function(){
		// summary:
		//	if no timeout is set or for other reason the user can put the button back
		//  to being idle
		this.setAttribute("disabled", false);
		this.isBusy = false;
		this.setLabel(this._label);
		if (this._timeout){	clearTimeout(this._timeout); }
		this.timeout = this._initTimeout;
	},
	
	resetTimeout: function(/*Int*/ timeout){
		// summary:
		//	to reset existing timeout and setting a new timeout
		if (this._timeout){	
			clearTimeout(this._timeout); 
		}
		
		// new timeout
		if (timeout){
			this._timeout = setTimeout(dojo.hitch(this, function(){
				this.cancel();
			}), timeout);			
		}
	},
	
	setLabel: function(/*String*/ content, /*Int*/ timeout){
		// summary:
		//	setting a label and optional timeout of the labels state
		
		// this.inherited(arguments); FIXME: throws an Unknown runtime error
		
		// Begin IE hack
		// summary: reset the label (text) of the button; takes an HTML string
		this.label = content;
		// remove children
		while (this.containerNode.firstChild){
			this.containerNode.removeChild(this.containerNode.firstChild);
		}
		this.containerNode.appendChild(document.createTextNode(this.label));
		
		this._layoutHack();
		if (this.showLabel == false && !(dojo.attr(this.domNode, "title"))){
			this.titleNode.title=dojo.trim(this.containerNode.innerText || this.containerNode.textContent || '');
		}
		// End IE hack
		
		// setting timeout
		if (timeout){
			this.resetTimeout(timeout);
		}else{
			this.timeout = null;
		}
		
		// create optional busy image
		if (this.useIcon && this.isBusy){
			var node = new Image();
			node.src = this.iconSrc;
			dojo.attr(node, "id", this.id+"_icon");
			dojo.addClass(node, "dojoxBusyButtonIcon");
			this.containerNode.appendChild(node);
		}
	},
	
	_onClick: function(){
		// summary:
		//	on button click the button state gets changed 
		
		// only do somethin gif button is not busy
		if (!this.isBusy){ 
			this.makeBusy();
		}
	}
});