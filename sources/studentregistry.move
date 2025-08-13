module student_registry::studentregistry {
    use std::string::{Self, String};
    use std::vector;
    use std::signer;
    use aptos_framework::timestamp;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account;

    /// Error codes
    const E_PAYMENT_REGISTRY_NOT_FOUND: u64 = 1;
    const E_INVALID_AMOUNT: u64 = 2;
    const E_EMPTY_FIELD: u64 = 3;
    const E_REGISTRY_ALREADY_EXISTS: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;

    /// Payment record structure
    struct PaymentRecord has store, drop, copy {
        student_name: String,
        roll_number: String,
        payment_type: String,
        amount: u64,
        payer_wallet: address,
        transaction_time: u64,
    }

    /// Payment registry resource that stores all payments for a wallet
    struct PaymentRegistry has key {
        payments: vector<PaymentRecord>,
        payment_registered_events: EventHandle<PaymentRegisteredEvent>,
    }

    /// Event emitted when a payment is registered
    struct PaymentRegisteredEvent has drop, store {
        student_name: String,
        roll_number: String,
        payment_type: String,
        amount: u64,
        payer_wallet: address,
        transaction_time: u64,
    }

    /// Initialize payment registry for a user
    public entry fun initialize_registry(account: &signer) {
        let account_addr = signer::address_of(account);
        
        // Check if registry already exists
        assert!(!exists<PaymentRegistry>(account_addr), E_REGISTRY_ALREADY_EXISTS);
        
        let registry = PaymentRegistry {
            payments: vector::empty<PaymentRecord>(),
            payment_registered_events: account::new_event_handle<PaymentRegisteredEvent>(account),
        };
        move_to(account, registry);
    }

    /// Register a new payment
    public entry fun register_payment(
        account: &signer,
        student_name: String,
        roll_number: String,
        payment_type: String,
        amount: u64,
    ) acquires PaymentRegistry {
        // Validate inputs
        assert!(amount > 0, E_INVALID_AMOUNT);
        assert!(!string::is_empty(&student_name), E_EMPTY_FIELD);
        assert!(!string::is_empty(&roll_number), E_EMPTY_FIELD);
        assert!(!string::is_empty(&payment_type), E_EMPTY_FIELD);

        let payer_address = signer::address_of(account);
        let current_time = timestamp::now_seconds();

        // Initialize registry if it doesn't exist
        if (!exists<PaymentRegistry>(payer_address)) {
            initialize_registry(account);
        };

        // Create payment record
        let payment_record = PaymentRecord {
            student_name,
            roll_number,
            payment_type,
            amount,
            payer_wallet: payer_address,
            transaction_time: current_time,
        };

        // Store payment record
        let registry = borrow_global_mut<PaymentRegistry>(payer_address);
        vector::push_back(&mut registry.payments, payment_record);

        // Emit event
        let event = PaymentRegisteredEvent {
            student_name: payment_record.student_name,
            roll_number: payment_record.roll_number,
            payment_type: payment_record.payment_type,
            amount: payment_record.amount,
            payer_wallet: payment_record.payer_wallet,
            transaction_time: payment_record.transaction_time,
        };
        event::emit_event(&mut registry.payment_registered_events, event);
    }

    #[view]
    /// Get all payments for a specific wallet address
    public fun get_payments(wallet_address: address): vector<PaymentRecord> acquires PaymentRegistry {
        if (!exists<PaymentRegistry>(wallet_address)) {
            return vector::empty<PaymentRecord>()
        };

        let registry = borrow_global<PaymentRegistry>(wallet_address);
        registry.payments
    }

    #[view]
    /// Get a specific payment by index
    public fun get_payment_by_index(wallet_address: address, index: u64): PaymentRecord acquires PaymentRegistry {
        assert!(exists<PaymentRegistry>(wallet_address), E_PAYMENT_REGISTRY_NOT_FOUND);
        
        let registry = borrow_global<PaymentRegistry>(wallet_address);
        assert!(index < vector::length(&registry.payments), E_INVALID_AMOUNT);
        
        *vector::borrow(&registry.payments, index)
    }

    #[view]
    /// Get the total number of payments for a wallet
    public fun get_payment_count(wallet_address: address): u64 acquires PaymentRegistry {
        if (!exists<PaymentRegistry>(wallet_address)) {
            return 0
        };

        let registry = borrow_global<PaymentRegistry>(wallet_address);
        vector::length(&registry.payments)
    }

    #[view]
    /// Get total amount paid by a wallet
    public fun get_total_amount_paid(wallet_address: address): u64 acquires PaymentRegistry {
        if (!exists<PaymentRegistry>(wallet_address)) {
            return 0
        };

        let registry = borrow_global<PaymentRegistry>(wallet_address);
        let total = 0u64;
        let i = 0;
        let len = vector::length(&registry.payments);

        while (i < len) {
            let payment = vector::borrow(&registry.payments, i);
            total = total + payment.amount;
            i = i + 1;
        };

        total
    }

    #[view]
    /// Get payments by student roll number for a specific wallet
    public fun get_payments_by_roll_number(
        wallet_address: address, 
        target_roll_number: String
    ): vector<PaymentRecord> acquires PaymentRegistry {
        if (!exists<PaymentRegistry>(wallet_address)) {
            return vector::empty<PaymentRecord>()
        };

        let registry = borrow_global<PaymentRegistry>(wallet_address);
        let filtered_payments = vector::empty<PaymentRecord>();
        let i = 0;
        let len = vector::length(&registry.payments);

        while (i < len) {
            let payment = vector::borrow(&registry.payments, i);
            if (payment.roll_number == target_roll_number) {
                vector::push_back(&mut filtered_payments, *payment);
            };
            i = i + 1;
        };

        filtered_payments
    }

    #[view]
    /// Get payments by payment type for a specific wallet
    public fun get_payments_by_type(
        wallet_address: address, 
        target_payment_type: String
    ): vector<PaymentRecord> acquires PaymentRegistry {
        if (!exists<PaymentRegistry>(wallet_address)) {
            return vector::empty<PaymentRecord>()
        };

        let registry = borrow_global<PaymentRegistry>(wallet_address);
        let filtered_payments = vector::empty<PaymentRecord>();
        let i = 0;
        let len = vector::length(&registry.payments);

        while (i < len) {
            let payment = vector::borrow(&registry.payments, i);
            if (payment.payment_type == target_payment_type) {
                vector::push_back(&mut filtered_payments, *payment);
            };
            i = i + 1;
        };

        filtered_payments
    }

    #[view]
    /// Get recent payments (last N payments)
    public fun get_recent_payments(wallet_address: address, count: u64): vector<PaymentRecord> acquires PaymentRegistry {
        if (!exists<PaymentRegistry>(wallet_address)) {
            return vector::empty<PaymentRecord>()
        };

        let registry = borrow_global<PaymentRegistry>(wallet_address);
        let all_payments = &registry.payments;
        let total_payments = vector::length(all_payments);
        
        if (total_payments == 0 || count == 0) {
            return vector::empty<PaymentRecord>()
        };

        let start_index = if (count >= total_payments) { 0 } else { total_payments - count };
        let recent_payments = vector::empty<PaymentRecord>();
        let i = start_index;

        while (i < total_payments) {
            let payment = vector::borrow(all_payments, i);
            vector::push_back(&mut recent_payments, *payment);
            i = i + 1;
        };

        recent_payments
    }

    #[view]
    /// Check if a payment registry exists for a wallet
    public fun registry_exists(wallet_address: address): bool {
        exists<PaymentRegistry>(wallet_address)
    }

    #[view]
    /// Get payment statistics for a wallet
    public fun get_payment_stats(wallet_address: address): (u64, u64, u64) acquires PaymentRegistry {
        if (!exists<PaymentRegistry>(wallet_address)) {
            return (0, 0, 0) // (count, total_amount, latest_timestamp)
        };

        let registry = borrow_global<PaymentRegistry>(wallet_address);
        let payments = &registry.payments;
        let count = vector::length(payments);
        
        if (count == 0) {
            return (0, 0, 0)
        };

        let total_amount = 0u64;
        let latest_timestamp = 0u64;
        let i = 0;

        while (i < count) {
            let payment = vector::borrow(payments, i);
            total_amount = total_amount + payment.amount;
            if (payment.transaction_time > latest_timestamp) {
                latest_timestamp = payment.transaction_time;
            };
            i = i + 1;
        };

        (count, total_amount, latest_timestamp)
    }

    // Test functions (only compile in test mode)
    #[test_only]
    use std::string;
    
    #[test_only]
    public fun create_test_payment(): PaymentRecord {
        PaymentRecord {
            student_name: string::utf8(b"John Doe"),
            roll_number: string::utf8(b"CS2023001"),
            payment_type: string::utf8(b"College Fee"),
            amount: 50000,
            payer_wallet: @0x1,
            transaction_time: 1640995200, // Jan 1, 2022
        }
    }

    #[test(account = @0x1)]
    public entry fun test_register_payment(account: signer) acquires PaymentRegistry {
        timestamp::set_time_has_started_for_testing(&account);
        
        register_payment(
            &account,
            string::utf8(b"Alice Smith"),
            string::utf8(b"CS2023001"),
            string::utf8(b"Tuition Fee"),
            75000
        );

        let payments = get_payments(@0x1);
        assert!(vector::length(&payments) == 1, 0);
        
        let payment = vector::borrow(&payments, 0);
        assert!(payment.amount == 75000, 1);
        assert!(payment.student_name == string::utf8(b"Alice Smith"), 2);
    }

    #[test(account = @0x1)]
    public entry fun test_multiple_payments(account: signer) acquires PaymentRegistry {
        timestamp::set_time_has_started_for_testing(&account);
        
        register_payment(
            &account,
            string::utf8(b"Bob Johnson"),
            string::utf8(b"CS2023002"),
            string::utf8(b"Lab Fee"),
            25000
        );

        register_payment(
            &account,
            string::utf8(b"Carol Williams"),
            string::utf8(b"CS2023003"),
            string::utf8(b"Event Fee"),
            15000
        );

        let payments = get_payments(@0x1);
        assert!(vector::length(&payments) == 2, 0);
        assert!(get_total_amount_paid(@0x1) == 40000, 1);
        
        let (count, total, _) = get_payment_stats(@0x1);
        assert!(count == 2, 2);
        assert!(total == 40000, 3);
    }

    #[test(account = @0x1)]
    public entry fun test_payment_filtering(account: signer) acquires PaymentRegistry {
        timestamp::set_time_has_started_for_testing(&account);
        
        register_payment(
            &account,
            string::utf8(b"Dave Brown"),
            string::utf8(b"CS2023001"),
            string::utf8(b"Tuition Fee"),
            50000
        );

        register_payment(
            &account,
            string::utf8(b"Eve Davis"),
            string::utf8(b"CS2023001"), // Same roll number
            string::utf8(b"Lab Fee"),
            30000
        );

        let roll_payments = get_payments_by_roll_number(@0x1, string::utf8(b"CS2023001"));
        assert!(vector::length(&roll_payments) == 2, 0);
        
        let tuition_payments = get_payments_by_type(@0x1, string::utf8(b"Tuition Fee"));
        assert!(vector::length(&tuition_payments) == 1, 1);
    }

    #[test(account = @0x1)]
    #[expected_failure(abort_code = E_INVALID_AMOUNT)]
    public entry fun test_zero_amount_payment(account: signer) acquires PaymentRegistry {
        timestamp::set_time_has_started_for_testing(&account);
        
        register_payment(
            &account,
            string::utf8(b"Test Student"),
            string::utf8(b"CS2023999"),
            string::utf8(b"Invalid Fee"),
            0 // This should fail
        );
    }

    #[test(account = @0x1)]
    #[expected_failure(abort_code = E_EMPTY_FIELD)]
    public entry fun test_empty_name_payment(account: signer) acquires PaymentRegistry {
        timestamp::set_time_has_started_for_testing(&account);
        
        register_payment(
            &account,
            string::utf8(b""), // Empty name should fail
            string::utf8(b"CS2023999"),
            string::utf8(b"Test Fee"),
            1000
        );
    }
}