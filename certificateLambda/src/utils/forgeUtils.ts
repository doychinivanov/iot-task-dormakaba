import forge from "node-forge";

export const parseCertificateFromPem = (pemCert: string): forge.pki.Certificate => {
    return forge.pki.certificateFromPem(pemCert);
}

export const parsePubKeyToPem = (pubKey: forge.pki.PublicKey): string => {
    return forge.pki.publicKeyToPem(pubKey);
}

export const extractCommonName = (cert: forge.pki.Certificate): string => {
    const cnField = cert.subject.getField("CN");
    return cnField ? cnField.value : "Unknown";
}

export const generatePrivateKey = (alg: "RSA" | "ECC" = "RSA"): forge.pki.rsa.KeyPair | { publicKey: Uint8Array; privateKey: Uint8Array } => {
    if (alg === "RSA") {
        return forge.pki.rsa.generateKeyPair(2048);
    } else {
        return forge.pki.ed25519.generateKeyPair();
    }
}

export const signPublicKey = (publicKeyPem: string, keys: forge.pki.rsa.KeyPair | { publicKey: Uint8Array; privateKey: Uint8Array }, alg: "RSA" | "ECC" = "RSA"): string => {
    if (alg === "RSA") {
        const msgDigest = forge.md.sha256.create();
        msgDigest.update(publicKeyPem, "utf8");
        const signature = (keys as forge.pki.rsa.KeyPair).privateKey.sign(msgDigest);
        return forge.util.encode64(signature);
    } else {
        const msgBytes = forge.util.binary.raw.decode(publicKeyPem);

        const signatureBytes = forge.pki.ed25519.sign({
            message: msgBytes,
            privateKey: (keys as { privateKey: Uint8Array }).privateKey,
        });

        const signatureForgeBuffer = forge.util.createBuffer(
            signatureBytes.buffer as ArrayBuffer,
            "raw"
        );

        return forge.util.encode64(signatureForgeBuffer.getBytes());
    }
}