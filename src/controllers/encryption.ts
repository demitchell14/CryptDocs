import * as openpgp from 'openpgp';

export class EncryptionHandler {

}

export async function encrypt(title: string, data: string, keys: string | string[], armored = true) {
    const message = await openpgp.createMessage({ text: data, type: 'text', date: new Date(), filename: title });
    console.log(message);

    // const signedMessage = await openpgp.sign({ message })
    // console.log(signedMessage);

    const encrypted = await openpgp.encrypt({
        message,
        passwords: keys,
        armor: armored,
    })

    return encrypted;
}

export async function decrypt(data: any, keys: string | string[]) {
    const encryptedMessage = await openpgp.readMessage({
        binaryMessage: data instanceof Array ? data : undefined,
        armoredMessage: typeof data === 'string' ? data : undefined,
        // armoredMessage: data,
        // config: { }
    } as any)
    console.log(encryptedMessage);

    const { data: decrypted } = await openpgp.decrypt({
        message: encryptedMessage,
        passwords: keys,
        format: 'utf8'
    })

    return decrypted;
}

export async function generateKey() {
    return await openpgp.generateKey({
        userIDs: [
            { name: 'My Name', email: 'AnEmail@mail.com' }
        ],
        curve: 'p256',
        type: 'rsa',
        passphrase: 'my key',
    })
}