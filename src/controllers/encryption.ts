import {
    createMessage,
    encrypt as pgpEncrypt,
    readMessage,
    decrypt as pgpDecrypt,
    generateKey as pgpGenerateKey
} from 'openpgp';

export class EncryptionHandler {

}

export async function encrypt(title: string, data: string, keys: string | string[]) {
    const message = await createMessage({
        text: data,
        date: new Date(),
        filename: title,
        format: 'utf8'
    });

    // const signedMessage = await openpgp.sign({ message })
    // console.log(signedMessage);

    const encrypted = await pgpEncrypt({
        message,
        passwords: keys
    })

    return encrypted;
}

export async function decrypt(data: any, keys: string | string[]) {
    const encryptedMessage = await readMessage({
        binaryMessage: data instanceof Array ? data : undefined,
        armoredMessage: typeof data === 'string' ? data : undefined,
        // armoredMessage: data,
        // config: { }
    } as any)
    console.log(encryptedMessage);

    const { data: decrypted } = await pgpDecrypt({
        message: encryptedMessage,
        passwords: keys,
        format: 'utf8'
    })

    return decrypted;
}

export async function generateKey() {
    return await pgpGenerateKey({
        userIDs: [
            { name: 'My Name', email: 'AnEmail@mail.com' }
        ],
        curve: 'p256',
        type: 'rsa',
        passphrase: 'my key',
    })
}
