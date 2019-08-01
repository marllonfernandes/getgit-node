module.exports = function (app) {

    var appController = app.controllers.application

    app.get('/api/', appController.api)
    app.get('/api/pull', [appController.validacao], appController.pull)
    
}