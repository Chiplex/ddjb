/**
 * Types for IPFS storage and case data structures
 */

export interface CaseMetadata {
    title: string;
    description: string;
    amount: string;
    createdAt: number;
    metadata: {
        version: string;
        type: string;
    };
}

export interface EvidenceMetadata {
    fileName: string;
    fileType: string;
    uploadedAt: number;
    description?: string;
}

export interface IPFSUploadResult {
    cid: string;
    size: number;
    path: string;
}

export interface IPFSRetrievalResult<T = unknown> {
    data: T;
    cid: string;
}

export interface IPFSServiceConfig {
    timeout: number;
    retries: number;
    gateway?: string;
}

export enum IPFSErrorType {
    TIMEOUT = 'TIMEOUT',
    NETWORK = 'NETWORK',
    INVALID_CID = 'INVALID_CID',
    PARSE_ERROR = 'PARSE_ERROR',
    UNKNOWN = 'UNKNOWN',
}

export class IPFSError extends Error {
    constructor(
        public type: IPFSErrorType,
        message: string,
        public originalError?: Error
    ) {
        super(message);
        this.name = 'IPFSError';
    }
}
