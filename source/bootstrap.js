// source/bootstrap.js
import 'angular'

let CoreModule = angular.module('core', []);

angular.element(document).ready(
    () => angular.bootstrap(document, [CoreModule.name], { strictDi: true })
);

export default CoreModule