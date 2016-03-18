function CrudException(message) {
    this.name = 'Crud Exception';
    this.message = message;
}

CrudException.prototype = new Error();
CrudException.prototype.constructor = CrudException;