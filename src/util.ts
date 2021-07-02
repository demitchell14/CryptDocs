export type BitLengths = {
    bytes: number;
    kilobytes: number;
    megabytes: number;
    gigabytes: number;
}
export function bitLengthToString(length: number | undefined): BitLengths;
export function bitLengthToString(length: number | undefined, asString: false): BitLengths;
export function bitLengthToString(length: number | undefined, asString: true): string;
export function bitLengthToString(length: number | undefined, asString = false): BitLengths | string {
    if (typeof length !== 'number') {
        if (asString)
            return `0 Bytes`;
        return { bytes: 0, kilobytes: 0, megabytes: 0, gigabytes: 0 };
    }

    // const bits = length;
    const bytes = length;
    const kilobytes = bytes / 1024;
    const megabytes = kilobytes / 1024;
    const gigabytes = megabytes / 1024;

    if (!asString)
        return { bytes, kilobytes, megabytes, gigabytes }

    if (gigabytes > .8) {
        return `${gigabytes.toPrecision(3)} Gb`;
    }
    if (megabytes > .8) {
        return `${megabytes.toPrecision(3)} Mb`;
    }
    if (kilobytes > .8) {
        return `${kilobytes.toPrecision(3)} Kb`;
    }
    return `${bytes.toPrecision(3)} Bytes`;
}