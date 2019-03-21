import { Buffer } from 'buffer';
import createDocument from './document';
import { generateRandomString, generateDid, parseDid, pemToBuffer } from './utils';
import { UnavailableIPFS, InvalidDID, IllegalCreate } from './utils/errors';

class IPID {
    #ipfs;
    #lifetime = '87600h';

    constructor({ ipfs }) {
        this.#ipfs = ipfs;
    }

    async resolve(did) {
        const { identifier } = parseDid(did);

        try {
            const { path } = await this.#ipfs.name.resolve(identifier, {});
            const [{ content }] = await this.#ipfs.get(path, {});

            return JSON.parse(content.toString());
        } catch (e) {
            throw new InvalidDID(did);
        }
    }

    async create(pem, operations) {
        const key = await pemToBuffer(pem);
        const did = await generateDid(key);

        try {
            await this.resolve(did);
        } catch (e) {
            const document = await createDocument(key);

            operations(document);

            return this.#publish(pem, document.getContent());
        }

        throw new IllegalCreate();
    }

    async update(pem, operations) {
        const key = await pemToBuffer(pem);
        const did = await generateDid(key);
        const content = await this.resolve(did);
        const document = await createDocument(key, content);

        operations(document);

        return this.#publish(pem, document.getContent());
    }

    #publish = async (pem, content) => {
        const keyName = this.#generateKeyName();

        await this.#importKey(keyName, pem);

        try {
            const [{ path }] = await this.#ipfs.add(Buffer.from(JSON.stringify(content)));

            await this.#ipfs.name.publish(path, {
                lifetime: this.#lifetime,
                ttl: this.#lifetime,
                key: keyName,
            });

            return content;
        } finally {
            await this.#removeKey(keyName);
        }
    }

    #removeKey = async (keyName) => {
        const keysList = await this.#ipfs.key.list();
        const hasKey = keysList.some(({ name }) => name === keyName);

        if (!hasKey) {
            return;
        }

        await this.#ipfs.key.rm(keyName);
    }

    #importKey = async (keyName, pem) => {
        await this.#removeKey(keyName);

        await this.#ipfs.key.import(keyName, pem, undefined);
    }

    #generateKeyName = () =>
        `js-ipid-${generateRandomString()}`;
}

const createIpid = async (ipfs) => {
    if (!ipfs || !ipfs.isOnline()) {
        throw new UnavailableIPFS();
    }

    return new IPID({ ipfs });
};

export default createIpid;
