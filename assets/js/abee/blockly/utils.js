'use strict';

goog.require('Blockly.JavaScript');
goog.require('Blockly.PHP');


// return statement
Blockly.Blocks['utils_return'] = {
  init: function() {
    this.setColour("#0B3B17");
    this.appendValueInput("return")
      .appendField("return");
    this.setPreviousStatement(true);
    this.setTooltip('Return a value.');
  }
};
Blockly.JavaScript['utils_return'] = function(block) {
  var value_return = Blockly.JavaScript.valueToCode(block, 'return', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'return ' + value_return ;
  return code;
};
Blockly.PHP['utils_return'] = function(block) {
  var value_return = Blockly.PHP.valueToCode(block, 'return', Blockly.PHP.ORDER_ATOMIC);
  var code = 'return ' + value_return + ';';
  return code;
};


// json parse
Blockly.Blocks['utils_jsonparse'] = {
  init: function() {
    this.setColour("#FFBF00");

    this.appendValueInput("jsonString")
        .appendField("JSON parse");

    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Parse a JSON string.');
  }
};
Blockly.JavaScript['utils_jsonparse'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'jsonString', Blockly.JavaScript.ORDER_ATOMIC);
  var code = '(function(){var obj = ' + value_name + '; if(typeof obj == "object") return obj; else return JSON.parse(obj)})()';

  return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.PHP['utils_jsonparse'] = function(block) {
  var value_name = Blockly.PHP.valueToCode(block, 'jsonString', Blockly.PHP.ORDER_FUNCTION_CALL);
  var code = 'json_decode('+ value_name + ')';

  return [code, Blockly.PHP.ORDER_FUNCTION_CALL];
};