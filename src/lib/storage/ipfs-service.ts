/**
 * IPFS Service for decentralized storage
 * Handles uploading and retrieving case data from IPFS
 */

import { create, IPFSHTTPClient } from 'ipfs-http-client';
import type {
    CaseMetadata,
    IPFSUploadResult,
    IPFSRetrievalResult,
    IPFSServiceConfig,
    IPFSError,
    IPFSErrorType,
} from './types';

class IPFSService {
    private client: IPFSHTTPClient | null = null;
    private config: IPFSServiceConfig = {
        timeout: 30000,
        retries: 3,
        gateway: 'https://ipfs.io',
    };

    /**
     * Initialize IPFS client
     */
    async initialize(): Promise<void> {
        if (this.client) return;

        try {
            // Use public IPFS gateway for development
            this.client = create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    // Add Infura project credentials if available
                    // authorization: 'Basic ' + btoa(projectId + ':' + projectSecret),
                },
            });
        } catch (error) {
            console.error('Failed to initialize IPFS client:', error);
            throw this.createError(
                'NETWORK' as IPFSErrorType,
                'Failed to initialize IPFS client',
                error as Error
            );
        }
    }

    /**
     * Upload case metadata to IPFS
     */
    async uploadCaseMetadata(metadata: CaseMetadata): Promise<IPFSUploadResult> {
        await this.initialize();

        if (!this.client) {
            throw this.createError(
                'NETWORK' as IPFSErrorType,
                'IPFS client not initialized'
            );
        }

        try {
            const data = JSON.stringify(metadata, null, 2);
            const result = await this.client.add(data, {
                timeout: this.config.timeout,
            });

            return {
                cid: result.cid.toString(),
                size: result.size,
                path: result.path,
            };
        } catch (error) {
            console.error('Failed to upload to IPFS:', error);
            throw this.createError(
                'NETWORK' as IPFSErrorType,
                'Failed to upload case metadata to IPFS',
                error as Error
            );
        }
    }

    /**
     * Retrieve case metadata from IPFS
     */
    async getCaseMetadata(cid: string): Promise<IPFSRetrievalResult<CaseMetadata>> {
        await this.initialize();

        if (!this.client) {
            throw this.createError(
                'NETWORK' as IPFSErrorType,
                'IPFS client not initialized'
            );
        }

        if (!cid || cid.trim() === '') {
            throw this.createError(
                'INVALID_CID' as IPFSErrorType,
                'Invalid IPFS CID provided'
            );
        }

        try {
            const chunks: Uint8Array[] = [];

            for await (const chunk of this.client.cat(cid, {
                timeout: this.config.timeout,
            })) {
                chunks.push(chunk);
            }

            const data = new TextDecoder().decode(this.concatChunks(chunks));
            const metadata = JSON.parse(data) as CaseMetadata;

            return {
                data: metadata,
                cid,
            };
        } catch (error) {
            console.error('Failed to retrieve from IPFS:', error);

            if (error instanceof SyntaxError) {
                throw this.createError(
                    'PARSE_ERROR' as IPFSErrorType,
                    'Failed to parse IPFS data',
                    error
                );
            }

            throw this.createError(
                'NETWORK' as IPFSErrorType,
                'Failed to retrieve case metadata from IPFS',
                error as Error
            );
        }
    }

    /**
     * Get IPFS gateway URL for a CID
     */
    getGatewayUrl(cid: string): string {
        return `${this.config.gateway}/ipfs/${cid}`;
    }

    /**
     * Concatenate Uint8Array chunks
     */
    private concatChunks(chunks: Uint8Array[]): Uint8Array {
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;

        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return result;
    }

    /**
     * Create typed error
     */
    private createError(
        type: IPFSErrorType,
        message: string,
        originalError?: Error
    ): IPFSError {
        const error = new Error(message) as IPFSError;
        error.type = type;
        error.originalError = originalError;
        error.name = 'IPFSError';
        return error;
    }
}

// Export singleton instance
export const ipfsService = new IPFSService();
