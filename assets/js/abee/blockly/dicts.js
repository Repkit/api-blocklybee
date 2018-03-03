'use strict';

goog.provide('Blockly.JavaScript.dict');

goog.require('Blockly.JavaScript');
goog.require('Blockly.Input');

/*
 * 
 *	The raw blocks
 * 
 */
Blockly.Msg.TYPE_CHECK = "check type of"
Blockly.Msg.DICT_KEYS = "get all keys of "
Blockly.Msg.DICT_GET = "get"
Blockly.Msg.DICT_GET_TO = "in object"
Blockly.Msg.DICTS_GET_TOOLTIP = "Return the value of the specified key from the dictionary."
Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH = "create object with"
Blockly.Msg.DICTS_CREATE_WITH_TOOLTIP = "Create a dictionary with any number of key-value pairs."
Blockly.Msg.DICTS_CREATE_EMPTY_TITLE = "Create empty dict"
Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD = "key-value pairs"
Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TOOLTIP = "**"
Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE = "key : value"
Blockly.Msg.DICTS_CREATE_WITH_ITEM_TOOLTIP = "Add a key-value pair to the dictionary."
Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY = "key"
Blockly.Msg.DICTS_CREATE_WITH_ITEM_VALUE = " : "
Blockly.Blocks['dicts_create_with_container'] = {
  // Container.
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};
 
Blockly.Blocks['dicts_create_with_item'] = {
  // Add items.
  init: function() {
    this.setColour(260);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};
Blockly.Blocks['dicts_create_with'] = {
    init: function() {
        this.setColour(260);
        this.appendDummyInput('TITLE_TEXT')
            .appendField(Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH);
	    
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
 
Blockly.Blocks['dict_get'] = {
  // Set element at index.
  init: function() {
    this.setColour(260);
    this.appendValueInput('DICT')
        .setCheck('dict')
        .appendField(Blockly.Msg.DICT_GET_TO);
    this.appendDummyInput()
    .appendField(Blockly.Msg.DICT_GET)
    .appendField(new Blockly.FieldTextInput(Blockly.Msg.DICTS_CREATE_WITH_ITEM_KEY), "ITEM")
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.DICTS_GET_TOOLTIP);
    this.setOutput(true);
  }
};