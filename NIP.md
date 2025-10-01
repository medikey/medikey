NIP-XX
======

Healthcare Records Protocol
---------------------------

`draft` `optional`

This NIP defines a protocol for decentralized healthcare record management using Nostr events. It enables patients to control their medical data while allowing secure, permissioned access for healthcare providers.

## Rationale

Healthcare data requires special handling due to privacy regulations (HIPAA), sensitive content, and the need for granular access control. This protocol provides:

- Patient-controlled data ownership
- Cryptographic access grants and revocations
- HIPAA-compliant audit trails
- Integration with Bitcoin Lightning for micropayments
- Role-based access (patients vs clinicians)

## Event Kinds

This NIP introduces the following new event kinds in the addressable range:

### Kind 30400: Healthcare Access Grant

Used by patients to grant healthcare providers access to specific medical records.

#### Required Tags:
- `d`: Unique grant identifier
- `record`: Health record ID being shared (references a kind 1063 event)
- `patient`: Patient's public key (hex)
- `clinician`: Clinician's public key (hex)
- `access`: Access level (`read`, `write`, `verify`)
- `status`: Grant status (`active`, `revoked`)
- `hipaa`: HIPAA compliance marker (always `true`)

#### Optional Tags:
- `expiry`: Access expiry timestamp (unix timestamp)
- `reason`: Reason for granting access

#### Example:
```json
{
  "kind": 30400,
  "content": "Healthcare record access granted for routine consultation",
  "tags": [
    ["d", "grant_abc123def456"],
    ["record", "record_789xyz012"],
    ["patient", "patient_pubkey_hex"],
    ["clinician", "clinician_pubkey_hex"],
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

### Kind 30401: Healthcare Access Revocation

Used by patients to revoke previously granted access to medical records.

#### Required Tags:
- `d`: Unique revocation identifier
- `e`: Reference to original grant event ID
- `record`: Health record ID
- `patient`: Patient's public key (hex)
- `clinician`: Clinician's public key (hex)
- `reason`: Reason for revocation
- `hipaa`: HIPAA compliance marker (always `true`)

#### Example:
```json
{
  "kind": 30401,
  "content": "Healthcare record access revoked",
  "tags": [
    ["d", "grant_abc123def456_revoke"],
    ["e", "original_grant_event_id"],
    ["record", "record_789xyz012"],
    ["patient", "patient_pubkey_hex"],
    ["clinician", "clinician_pubkey_hex"],
    ["reason", "access_revoked"],
    ["hipaa", "true"],
    ["t", "healthcare"],
    ["t", "access-revocation"],
    ["alt", "Healthcare record access revocation"]
  ]
}
```

### Kind 30402: Encrypted Healthcare Data

Used for storing sensitive healthcare information that requires encryption.

#### Required Tags:
- `d`: Unique encrypted data identifier
- `p`: Recipient's public key (for NIP-44 encryption)
- `hipaa`: HIPAA compliance marker (always `true`)

#### Content:
Must be encrypted using NIP-44 encryption standard.

#### Example:
```json
{
  "kind": 30402,
  "content": "<nip44-encrypted-healthcare-data>",
  "tags": [
    ["d", "encrypted_data_timestamp"],
    ["p", "recipient_pubkey_hex"],
    ["hipaa", "true"],
    ["t", "healthcare"],
    ["t", "encrypted"],
    ["alt", "Encrypted healthcare data"]
  ]
}
```

## Integration with Existing NIPs

### NIP-94: File Metadata for Health Records

Health records use kind 1063 (NIP-94) with healthcare-specific tags:

```json
{
  "kind": 1063,
  "content": "Patient immunization record",
  "tags": [
    ["d", "record_unique_id"],
    ["url", "file_url_or_base64_content"],
    ["m", "application/pdf"],
    ["title", "COVID-19 Vaccination Record"],
    ["h", "immunization"],
    ["patient", "patient_pubkey_hex"],
    ["v", "verified"],
    ["hipaa", "true"],
    ["t", "healthcare"],
    ["t", "immunization"],
    ["alt", "Healthcare record: COVID-19 Vaccination Record"]
  ]
}
```

### NIP-57: Lightning Zaps for Verification

Healthcare record verification uses Lightning payments (kind 9735) with healthcare context:

```json
{
  "kind": 9735,
  "content": "Healthcare record verification payment",
  "tags": [
    ["bolt11", "lightning_invoice_string"],
    ["amount", "1000"],
    ["record", "record_id_being_verified"],
    ["verification", "clinical_review"],
    ["t", "healthcare"],
    ["t", "verification-payment"]
  ]
}
```

### NIP-78: Application-Specific Healthcare Profiles

Healthcare provider profiles use kind 30078 with role-specific metadata:

```json
{
  "kind": 30078,
  "content": "{\"name\":\"Dr. Smith\",\"role\":\"clinician\",\"specialty\":\"cardiology\"}",
  "tags": [
    ["d", "medikey-profile"],
    ["role", "clinician"],
    ["specialty", "cardiology"],
    ["t", "healthcare"],
    ["t", "clinician"]
  ]
}
```

## Healthcare-Specific Tags

### Standard Tags:
- `h`: Healthcare record type (`immunization`, `lab_result`, `prescription`, `general`)
- `patient`: Patient's public key (64-char hex)
- `clinician`: Clinician's public key (64-char hex)
- `record`: Health record identifier
- `v`: Verification status (`verified`, `unverified`, `pending`)
- `access`: Access level (`read`, `write`, `verify`)
- `expiry`: Access expiry timestamp (unix timestamp)
- `hipaa`: HIPAA compliance marker (always `true` for healthcare events)

### Usage Guidelines:
- All healthcare events MUST include `t: "healthcare"` tag
- All healthcare events MUST include `hipaa: "true"` tag
- All healthcare events MUST include `alt` tag for accessibility (NIP-31)
- Patient and clinician pubkeys MUST be valid secp256k1 public keys

## Security Considerations

### Encryption
- Sensitive healthcare data MUST be encrypted using NIP-44
- File contents MAY be encrypted before base64 encoding
- Conversation keys derived from patient-clinician key pairs

### Access Control
- Access grants are cryptographically signed by patients
- Revocations invalidate previous grants immediately
- Clinicians can only access explicitly granted records

### Audit Trail
- All access grants and revocations are permanently recorded
- Activity logs provide complete audit trail
- Lightning payments provide verification proof

### HIPAA Compliance
- All events include HIPAA compliance markers
- Minimum necessary access principle enforced
- Comprehensive logging for regulatory compliance

## Implementation Guidelines

### For Patients:
1. Generate health records as kind 1063 events with healthcare tags
2. Create access grants (kind 30400) for sharing with clinicians
3. Revoke access using kind 30401 events when needed
4. Use NIP-44 encryption for sensitive data

### For Clinicians:
1. Query for access grants where clinician tag matches their pubkey
2. Access only records explicitly granted by patients
3. Use Lightning payments (kind 9735) for record verification
4. Maintain audit logs of all patient interactions

### For Relays:
1. Index healthcare events by `t`, `patient`, `clinician`, and `record` tags
2. Support addressable events (kinds 30000-39999)
3. Implement proper access control for sensitive content
4. Optional: Require NIP-42 authentication for healthcare events

## Privacy Considerations

- Record content may contain PHI (Protected Health Information)
- Encryption is recommended for all sensitive medical data
- Access grants should specify minimum necessary permissions
- Audit trails must be maintained for regulatory compliance

## Interoperability

This protocol is designed to enable multiple healthcare applications to share the same underlying Nostr infrastructure while maintaining patient privacy and regulatory compliance. Applications implementing this NIP can interoperate seamlessly while respecting role-based access controls.

## Reference Implementation

See MediKey (https://github.com/your-repo/medikey) for a complete reference implementation of this healthcare records protocol.