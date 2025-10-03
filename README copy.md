# MediKey - Decentralized Healthcare Records

MediKey is a decentralized healthcare records management system built on the Nostr protocol and Bitcoin Lightning Network. It enables patients to control their medical data while allowing secure, permissioned access for healthcare providers.

## Features

- **🔐 Cryptographic Identity**: Secure key-pair based authentication
- **📄 Health Record Management**: Upload, organize, and share medical documents
- **👥 Role-Based Access**: Separate dashboards for patients and clinicians
- **⚡ Lightning Payments**: Bitcoin micropayments for record verification
- **🔒 Privacy-First**: Patient-controlled data sharing with granular permissions
- **📊 Analytics**: Comprehensive insights into healthcare data usage
- **📱 Responsive Design**: Modern UI optimized for mobile and desktop

## Technology Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui with custom healthcare theme
- **Protocol**: Nostr (decentralized social protocol)
- **Payments**: Bitcoin Lightning Network
- **Charts**: Recharts for analytics visualization
- **Build**: Vite with ESBuild

## Nostr Protocol Integration

MediKey leverages the Nostr protocol for decentralized data storage and communication. The application uses both existing NIPs and custom event kinds for healthcare-specific functionality.

### Standard NIPs Used

| NIP | Purpose | Usage in MediKey |
|-----|---------|------------------|
| [NIP-01](https://github.com/nostr-protocol/nips/blob/master/01.md) | Basic protocol | Event structure, signatures, relays |
| [NIP-44](https://github.com/nostr-protocol/nips/blob/master/44.md) | Encrypted Payloads | Secure healthcare data transmission |
| [NIP-57](https://github.com/nostr-protocol/nips/blob/master/57.md) | Lightning Zaps | Record verification payments |
| [NIP-78](https://github.com/nostr-protocol/nips/blob/master/78.md) | Application-specific data | Healthcare profile metadata |
| [NIP-94](https://github.com/nostr-protocol/nips/blob/master/94.md) | File Metadata | Health record file information |

### Custom NIPs Required

The following custom event kinds need to be standardized for full MediKey interoperability:

#### **Kind 30400: Healthcare Access Grant**
*Addressable event for granting healthcare record access*

```json
{
  "kind": 30400,
  "content": "Healthcare record access granted",
  "tags": [
    ["d", "<grant-id>"],
    ["record", "<record-id>"],
    ["patient", "<patient-pubkey>"],
    ["clinician", "<clinician-pubkey>"],
    ["access", "read"],
    ["status", "active"],
    ["hipaa", "true"],
    ["t", "healthcare"],
    ["t", "access-grant"],
    ["alt", "Healthcare record access grant"],
    ["client", "MediKey", "https://medikey.app"]
  ]
}
```

**Required Tags:**
- `d`: Unique grant identifier
- `record`: Health record ID being shared
- `patient`: Patient's public key
- `clinician`: Clinician's public key
- `access`: Access level (read, write, verify)
- `status`: Grant status (active, revoked)
- `hipaa`: HIPAA compliance marker

#### **Kind 30401: Healthcare Access Revocation**
*Addressable event for revoking healthcare record access*

```json
{
  "kind": 30401,
  "content": "Healthcare record access revoked",
  "tags": [
    ["d", "<grant-id>-revoke"],
    ["e", "<original-grant-event-id>"],
    ["record", "<record-id>"],
    ["patient", "<patient-pubkey>"],
    ["clinician", "<clinician-pubkey>"],
    ["reason", "access_revoked"],
    ["hipaa", "true"],
    ["t", "healthcare"],
    ["t", "access-revocation"],
    ["alt", "Healthcare record access revocation"],
    ["client", "MediKey", "https://medikey.app"]
  ]
}
```

**Required Tags:**
- `d`: Unique revocation identifier
- `e`: Reference to original grant event
- `record`: Health record ID
- `patient`: Patient's public key
- `clinician`: Clinician's public key
- `reason`: Reason for revocation

#### **Kind 30402: Encrypted Healthcare Data**
*Addressable event for encrypted sensitive healthcare information*

```json
{
  "kind": 30402,
  "content": "<nip44-encrypted-content>",
  "tags": [
    ["d", "encrypted-<timestamp>"],
    ["p", "<recipient-pubkey>"],
    ["hipaa", "true"],
    ["t", "healthcare"],
    ["t", "encrypted"],
    ["alt", "Encrypted healthcare data"],
    ["client", "MediKey", "https://medikey.app"]
  ]
}
```

**Required Tags:**
- `d`: Unique encrypted data identifier
- `p`: Recipient's public key
- Content must be NIP-44 encrypted

#### **Kind 30079: Healthcare Activity Log**
*Addressable event for healthcare activity tracking*

```json
{
  "kind": 30079,
  "content": "<activity-description>",
  "tags": [
    ["d", "<activity-id>"],
    ["action", "<action-type>"],
    ["timestamp", "<unix-timestamp>"],
    ["record", "<record-id>"],
    ["hipaa", "true"],
    ["t", "healthcare"],
    ["t", "activity-log"],
    ["alt", "Healthcare activity log entry"],
    ["client", "MediKey", "https://medikey.app"]
  ]
}
```

**Required Tags:**
- `d`: Unique activity identifier
- `action`: Type of action (upload, share, revoke, payment, access_request)
- `timestamp`: Activity timestamp

### Healthcare-Specific Tags

MediKey introduces healthcare-specific tags for medical data organization:

| Tag | Purpose | Values |
|-----|---------|--------|
| `h` | Healthcare record type | `immunization`, `lab_result`, `prescription`, `general` |
| `patient` | Patient public key | 64-char hex pubkey |
| `clinician` | Clinician public key | 64-char hex pubkey |
| `record` | Health record identifier | Unique record ID |
| `m` | Medical category/specialty | Medical specialty or category |
| `v` | Verification status | `verified`, `unverified`, `pending` |
| `access` | Access level | `read`, `write`, `verify` |
| `expiry` | Access expiry timestamp | Unix timestamp |
| `hipaa` | HIPAA compliance marker | `true` for compliant events |

### Security and Compliance

#### HIPAA Compliance
- All healthcare events include `hipaa: "true"` tag
- Sensitive data is encrypted using NIP-44
- Access controls are enforced at the protocol level
- Activity logging for audit trails

#### Data Encryption
- Patient records can be encrypted using NIP-44
- Encryption keys derived from patient-clinician key pairs
- Forward secrecy through session-based encryption
- Secure key exchange for new relationships

#### Access Control
- Role-based permissions (patient vs clinician)
- Granular record-level access grants
- Time-based access expiration
- Immutable access audit trails

### Relay Requirements

MediKey requires Nostr relays that support:
- Addressable events (kinds 30000-39999)
- Tag-based filtering (`#t`, `#patient`, `#clinician`, etc.)
- Large content support for file metadata
- Optional: NIP-42 authentication for enhanced security

### Future Interoperability

These custom NIPs are designed to enable interoperability between different healthcare applications built on Nostr. By standardizing these event kinds and tags, multiple healthcare clients can share and access the same underlying data while maintaining patient privacy and control.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Deploy to hosting
npm run deploy
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Patient UI    │    │  Clinician UI   │    │   Analytics     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Upload Records│    │ • Request Access│    │ • Usage Charts  │
│ • Share Access  │    │ • View Records  │    │ • Activity Logs │
│ • Manage Keys   │    │ • Verify Records│    │ • Payment Stats │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Nostr Protocol │
                    ├─────────────────┤
                    │ • Event Storage │
                    │ • Access Control│
                    │ • Encryption    │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Lightning Network│
                    ├─────────────────┤
                    │ • Micropayments │
                    │ • Verification  │
                    │ • Instant Settle│
                    └─────────────────┘
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

For security concerns or vulnerabilities, please email security@medikey.app (not implemented in MVP).

---

**Built with ❤️ for healthcare privacy and patient empowerment**

*Vibed with [MKStack](https://soapbox.pub/mkstack)*