'use strict';

goog.provide('Blockly.JavaScript.procedures');
goog.provide('Blockly.JavaScript.dict');

goog.require('Blockly.JavaScript');
goog.require('Blockly.Input');

var abee = abee || {};

Blockly.Blocks['abee_request'] = {
  init: function() {
    this.setHelpUrl(abee.documentation.url);
    this.setColour("#193863");
    this.appendDummyInput()
      .appendField("call")
      // .appendField(new Blockly.FieldTextInput(abee.endpoints.base), "url")
      .appendField(new Blockly.FieldDropdown(abee.endpoints.__toArray()), "url")
      .appendField("with");
    this.appendDummyInput()
      .appendField("method")
      .appendField(new Blockly.FieldDropdown([["GET", "get"], ["POST", "post"], ["PATCH", "patch"], ["PUT", "put"], ["UPDATE", "update"], ["DELETE", "delete"], ["OPTIONS", "options"]]), "method");
    this.appendValueInput("parameters")
      .appendField("parameters")
      .setCheck("dict");
    this.appendValueInput("headers")
      .appendField("headers")
      .setCheck("dict");
    this.setOutput(true);
    this.setTooltip('access an abee endpoint');
  }

};
Blockly.JavaScript['abee_request'] = function(block) {
  var dropdown_method = block.getFieldValue('method');
  var text_url = block.getFieldValue('url');
  var params = Blockly.JavaScript.valueToCode(block, 'parameters', Blockly.JavaScript.ORDER_NONE) || 'null';
  var headers = Blockly.JavaScript.valueToCode(block, 'headers', Blockly.JavaScript.ORDER_NONE) || 'null';
  var code = 'require("http").request({"url": "' + text_url + '" , "method": "' + dropdown_method + '", "params": ' + params + ', "headers": ' + headers + '})';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.PHP['abee_request'] = function(block) {
  var dropdown_method = block.getFieldValue('method');
  var text_url = block.getFieldValue('url');
  var params = Blockly.PHP.valueToCode(block, 'parameters', Blockly.PHP.ORDER_NONE) || 'null';
  var headers = Blockly.PHP.valueToCode(block, 'headers', Blockly.PHP.ORDER_NONE) || 'null';
  var code = '$curl->' + dropdown_method + '("' + text_url + '", $vars = ' + params + ')';
  return [code, Blockly.PHP.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['abee_filter_request'] = {
    init: function() {
        this.setHelpUrl('https://en.wikipedia.org/wiki/Query_string');
        this.setColour(260);
        this.appendDummyInput('TITLE_TEXT')
            .appendField("query string params");
	    
        this.appendValueInput("INPUT0")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldTextInput(Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY), "KEY0")
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_VALUE);
	    
	    this.appendValueInput("INPUT1")
	    .setAlign(Blockly.ALIGN_RIGHT)
	    .appendField(new Blockly.FieldTextInput(Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY), "KEY1")
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_VALUE);
	    
        this.setOutput(true, 'dict');
        this.setMutator(new Blockly.Mutator(['dicts_create_with_item']));
        this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_TOOLTIP);

        this.itemCount_ = 2;
        this.keyValues_ = [Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY,Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY];
    },
    mutationToDom: function(workspace) {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    domToMutation: function(container) {
        for (var x = 0; x < this.itemCount_; x++) {
        	this.keyValues_[x] = this.getFieldValue('KEY' + x); 
          this.removeInput('INPUT' + x);
        }
        this.itemCount_ = parseInt(container.getAttribute('items'), 10);
        for (var x = 0; x < this.itemCount_; x++) {
            var keyvalue = Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY;
            if(this.keyValues_.length > x){
          	  keyvalue = this.keyValues_[x];
            }
            this.appendValueInput("INPUT" + x)
              .setAlign(Blockly.ALIGN_RIGHT)
	          .appendField(new Blockly.FieldTextInput(keyvalue), "KEY" + x)
	          .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_VALUE);
        }
    },
    decompose: function(workspace) {
        var containerBlock = new Blockly.Block.obtain(workspace, 'dicts_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.itemCount_; x++) {
          var itemBlock = new Blockly.Block.obtain(workspace, 'dicts_create_with_item');
          itemBlock.initSvg();
          connection.connect(itemBlock.previousConnection);
          connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    compose: function(containerBlock) {
        // Disconnect all input blocks and remove all inputs.
        if (this.itemCount_ == 0) {
          this.removeInput('EMPTY');
        } else {
//          this.removeInput('TITLE_TEXT');
          for (var x = this.itemCount_ - 1; x >= 0; x--) {
        	this.keyValues_[x] = this.getFieldValue('KEY' + x); 
            this.removeInput('INPUT' + x);
          }
        }
        this.itemCount_ = 0;
        // Rebuild the block's inputs.
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        while (itemBlock) {
          var keyvalue = Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY;
          if(this.keyValues_.length > this.itemCount_){
          	  keyvalue = this.keyValues_[this.itemCount_];
          }
          var value_input = this.appendValueInput("INPUT" + this.itemCount_)
					          .setAlign(Blockly.ALIGN_RIGHT)
					          .appendField(new Blockly.FieldTextInput(keyvalue), "KEY" + this.itemCount_)
					          .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_VALUE);
          
          // Reconnect any child blocks.
          if (itemBlock.valueConnection_) {
            value_input.connection.connect(itemBlock.valueConnection_);
          }
          this.itemCount_++;
          itemBlock = itemBlock.nextConnection &&
              itemBlock.nextConnection.targetBlock();
        }
        if (this.itemCount_ != this.keyValues_.length) {
        	this.keyValues_.pop();
        }
        
        if (this.itemCount_ == 0) {
          this.appendDummyInput('EMPTY')
              .appendField(Blockly.Msg.DICTS_CREATE_EMPTY_TITLE);
        }
    },
    saveConnections: function(containerBlock) {
        // Store a pointer to any connected child blocks.
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 0;
        while (itemBlock) {
          var value_input = this.getInput('INPUT' + x);
          itemBlock.valueConnection_ = value_input && value_input.connection.targetConnection;
          x++;
          itemBlock = itemBlock.nextConnection &&
              itemBlock.nextConnection.targetBlock();
        }
    }
};
Blockly.JavaScript['abee_filter_request'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = new Array();
  for (var n = 0; n < block.itemCount_; n++) {
    var key = block.getFieldValue('KEY' + n) || null;
    if(key != null){
    	var value = Blockly.JavaScript.valueToCode(block, 'INPUT' + n, Blockly.JavaScript.ORDER_NONE) || null;
    	code[n] =  '"' + key + '"' +": "+ value;
    }
  }
  code = '{' + code.join(',\n\t') + '}';
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.PHP['abee_filter_request'] = function(block) {
  var code = new Array();
  for (var n = 0; n < block.itemCount_; n++) {
    var key = block.getFieldValue('KEY' + n) || null;
    if(key != null){
    	var value = Blockly.PHP.valueToCode(block, 'INPUT' + n, Blockly.PHP.ORDER_NONE) || null;
    	code[n] =  '"' + key + '"' +"=> "+ value;
    }
  }
  code = '[' + code.join(',\n\t') + ']';
  return [code, Blockly.PHP.ORDER_ATOMIC];
};
