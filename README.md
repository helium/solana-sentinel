# Solana Sentinel
API indicating the status of the Solana migration


The Solana Migration Status service, [Solana Sentinel](https://github.com/helium/solana-sentinel),
can be leveraged in order to appropriately feature flag attributes in an application. For example,
this service can be used to disable transactions during the migration or to point users to separate
services as the migration completes.

---

## Migration States

The three possible values that may be returned by the API represent different stages of the
migration process:

- **`not_started`**: This means that the migration process has not yet begun. The Helium blockchain
  is still operating and the migration to Solana has not yet been initiated.
- **`in_progress`**: This means that the migration process is currently underway. The Helium
  blockchain is in the process of being migrated to Solana. The Helium Blockchain will be halted
  during this process. Proof of Coverage and Data Transfer activity continue to function throughout
  the migration process.
- **`complete`**: This means that the migration process has been completed successfully. The Helium
  blockchain has been migrated to Solana. The `finalBlockHeight` value will update from `null` to
  the final block height of the Helium Blockchain.

---

## Example Usage

```bash
curl https://solana-status.helium.tld
```

```json
{
  "migrationStatus": "not_started",
  "minimumVersions": {
    "com.helium.wallet.app": "2.0.0"
  },
  "finalBlockHeight": null
}
```
