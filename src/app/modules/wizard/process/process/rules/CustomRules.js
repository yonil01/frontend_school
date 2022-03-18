import inherits from 'inherits';
import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

export default function CustomRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(CustomRules, RuleProvider);
CustomRules.$inject = ['eventBus'];

CustomRules.prototype.init = function () {
  this.addRule('elements.delete', 1100, function (context) {
    // allow all = true
    // disallow all together = false
    // return true;
    // Disallow specific Objects
    /*return context.elements.filter(function(e) {
            return e.businessObject.$instanceOf('bpmn:StartEvent');
        });*/
    // Disallow Root Element deletion
    return context.elements.filter(function (e) {
      return e.id !== 'StartEvent_1';
    });
  });
};
