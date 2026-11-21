package com.kli.backend.blizzard;

import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class BlizzardRequestLimiter {

    private static final long SPACING_NANOS = TimeUnit.MILLISECONDS.toNanos(100);

    private long nextPermitNanos = System.nanoTime();

    public synchronized void acquire() {
        long remaining;
        while ((remaining = nextPermitNanos - System.nanoTime()) > 0) {
            try {
                TimeUnit.NANOSECONDS.sleep(remaining);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IllegalStateException("Interrupted while waiting to call Blizzard", e);
            }
        }

        nextPermitNanos = System.nanoTime() + SPACING_NANOS;
    }

}
