;; Infrastructure Verification Contract
;; Validates quantum city systems and infrastructure components

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-verified (err u102))
(define-constant err-invalid-status (err u103))

;; Infrastructure status types
(define-constant status-pending u0)
(define-constant status-verified u1)
(define-constant status-failed u2)
(define-constant status-maintenance u3)

;; Data structures
(define-map infrastructure-registry
  { infrastructure-id: (string-ascii 64) }
  {
    owner: principal,
    infrastructure-type: (string-ascii 32),
    status: uint,
    verification-timestamp: uint,
    quantum-compatibility: bool,
    performance-score: uint
  }
)

(define-map verifier-registry
  { verifier: principal }
  { authorized: bool, reputation-score: uint }
)

;; Register new infrastructure
(define-public (register-infrastructure
  (infrastructure-id (string-ascii 64))
  (infrastructure-type (string-ascii 32))
  (quantum-compatibility bool))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (map-set infrastructure-registry
      { infrastructure-id: infrastructure-id }
      {
        owner: tx-sender,
        infrastructure-type: infrastructure-type,
        status: status-pending,
        verification-timestamp: block-height,
        quantum-compatibility: quantum-compatibility,
        performance-score: u0
      }
    ))
  )
)

;; Verify infrastructure
(define-public (verify-infrastructure
  (infrastructure-id (string-ascii 64))
  (performance-score uint))
  (let ((infrastructure (unwrap! (map-get? infrastructure-registry { infrastructure-id: infrastructure-id }) err-not-found)))
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-eq (get status infrastructure) status-pending) err-already-verified)
    (ok (map-set infrastructure-registry
      { infrastructure-id: infrastructure-id }
      (merge infrastructure {
        status: status-verified,
        verification-timestamp: block-height,
        performance-score: performance-score
      })
    ))
  )
)

;; Get infrastructure details
(define-read-only (get-infrastructure (infrastructure-id (string-ascii 64)))
  (map-get? infrastructure-registry { infrastructure-id: infrastructure-id })
)

;; Check if infrastructure is verified
(define-read-only (is-verified (infrastructure-id (string-ascii 64)))
  (match (map-get? infrastructure-registry { infrastructure-id: infrastructure-id })
    infrastructure (is-eq (get status infrastructure) status-verified)
    false
  )
)
