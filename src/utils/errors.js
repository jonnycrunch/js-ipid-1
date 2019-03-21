class ErrorWithCode extends Error {
    constructor(message, code) {
        super(message);

        Error.captureStackTrace(this, this.constructor);

        Object.assign(this, { code });
    }
}

// Authentication Based -------------------------------------

export class DuplicateAuthentication extends ErrorWithCode {
    constructor(id) {
        super(`Authentication with same ${id} already exists.`, 'DUPLICATE_AUTHENTICATION');
    }
}

export class InvalidAuthentication extends ErrorWithCode {
    constructor(message) {
        message = message || 'Invalid authentication.';

        super(message, 'INVALID_AUTHENTICATION');
    }
}

// ----------------------------------------------------------

// Public Key Based -----------------------------------------

export class DuplicatePublicKey extends ErrorWithCode {
    constructor(id) {
        super(`PublicKey with same ${id} already exists.`, 'DUPLICATE_PUBLICKEY');
    }
}

export class InvalidPublicKey extends ErrorWithCode {
    constructor(message) {
        message = message || 'Invalid public key.';

        super(message, 'INVALID_PUBLICKEY');
    }
}

// ----------------------------------------------------------

// Service Endpoint Based -----------------------------------

export class DuplicateService extends ErrorWithCode {
    constructor(id) {
        super(`Service with same ${id} already exists.`, 'DUPLICATE_SERVICE');
    }
}

export class InvalidService extends ErrorWithCode {
    constructor(message) {
        message = message || 'Invalid service.';

        super(message, 'INVALID_SERVICE');
    }
}

// ----------------------------------------------------------

// IPFS/IPNS Based ------------------------------------------

export class InvalidDID extends ErrorWithCode {
    constructor(did) {
        super(`Invalid DID: ${did}`, 'INVALID_DID');
    }
}

export class IllegalCreate extends ErrorWithCode {
    constructor(message) {
        message = message || 'Document already exists.';

        super(message, 'ILLEGAL_CREATE');
    }
}

export class UnavailableIPFS extends ErrorWithCode {
    constructor(message) {
        message = message || 'IPFS node is unavailable.';

        super(message, 'IPFS_UNAVAILABLE');
    }
}

// ----------------------------------------------------------
