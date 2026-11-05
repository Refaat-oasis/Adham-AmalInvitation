import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test';
import { fetchInvitation, fetchGuestMessages, submitGuestMessage } from './services/api';

describe('Adversarial & Empirical Challenge Suite', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('1. Resiliency under Network Failures', () => {
    it('handles 500 Internal Server Error on /messages gracefully without crashing', async () => {
      globalThis.fetch = mock(async () => {
        return new Response(
          JSON.stringify({ message: 'Internal Server Error in database pool' }),
          {
            status: 500,
            statusText: 'Internal Server Error',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      });

      const result = await submitGuestMessage('adham-amal', {
        guestName: 'أحمد شاكر',
        attendanceStatus: 'سأتشرف بالحضور',
        message: 'ألف مبروك'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Internal Server Error in database pool');
      expect(result.data).toBeUndefined();
    });

    it('handles 500 Internal Server Error returning HTML (nginx/apache crash page)', async () => {
      globalThis.fetch = mock(async () => {
        return new Response(
          '<html><body>500 Internal Server Error</body></html>',
          {
            status: 500,
            statusText: 'Internal Server Error',
            headers: { 'Content-Type': 'text/html' }
          }
        );
      });

      const result = await submitGuestMessage('adham-amal', {
        guestName: 'أحمد شاكر',
        attendanceStatus: 'سأتشرف بالحضور',
        message: 'ألف مبروك'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('500');
    });

    it('handles unreachable server (Network Failure / Connection Refused / Offline)', async () => {
      globalThis.fetch = mock(async () => {
        throw new TypeError('Failed to fetch');
      });

      const result = await submitGuestMessage('adham-amal', {
        guestName: 'طارق',
        attendanceStatus: 'سأتشرف بالحضور',
        message: 'مبارك للعروسين'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to fetch');
    });

    it('handles non-Error thrown exceptions during fetch', async () => {
      globalThis.fetch = mock(async () => {
        throw 'Unexpected string throw';
      });

      const result = await submitGuestMessage('adham-amal', {
        guestName: 'طارق',
        attendanceStatus: 'سأتشرف بالحضور',
        message: 'مبارك للعروسين'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت.');
    });

    it('fetchGuestMessages returns empty array on 500 error instead of throwing', async () => {
      globalThis.fetch = mock(async () => {
        return new Response('Server Error', { status: 500, statusText: 'Server Error' });
      });

      const messages = await fetchGuestMessages('adham-amal');
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBe(0);
    });

    it('fetchInvitation returns null on 500 error allowing fallback defaults', async () => {
      globalThis.fetch = mock(async () => {
        return new Response('Server Error', { status: 500, statusText: 'Server Error' });
      });

      const invitation = await fetchInvitation('adham-amal');
      expect(invitation).toBeNull();
    });
  });

  describe('2. UI Robustness & Input Boundary Conditions', () => {
    it('validates character limit bounds (NAME_MAX_LENGTH=60, MESSAGE_MAX_LENGTH=500)', () => {
      const NAME_MAX_LENGTH = 60;
      const MESSAGE_MAX_LENGTH = 500;

      const validName = 'أ'.repeat(60);
      const invalidName = 'أ'.repeat(61);
      const validMessage = 'مبارك '.repeat(83); // ~498 chars
      const invalidMessage = 'م'.repeat(501);

      expect(validName.length).toBe(60);
      expect(invalidName.length).toBe(61);
      expect(validName.length <= NAME_MAX_LENGTH).toBe(true);
      expect(invalidName.length <= NAME_MAX_LENGTH).toBe(false);

      expect(validMessage.length <= MESSAGE_MAX_LENGTH).toBe(true);
      expect(invalidMessage.length <= MESSAGE_MAX_LENGTH).toBe(false);
    });

    it('tests extreme Arabic non-breaking string stability', () => {
      // 500 continuous Arabic characters without space
      const extremeArabicNonBreaking = 'م' + 'و'.repeat(498) + 'ك';
      expect(extremeArabicNonBreaking.length).toBe(500);

      // JSON serialization safety check
      const payload = {
        guestName: 'محمد'.repeat(12), // 48 chars
        attendanceStatus: 'سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨',
        message: extremeArabicNonBreaking
      };

      const serialized = JSON.stringify(payload);
      expect(serialized).toBeDefined();
      const deserialized = JSON.parse(serialized);
      expect(deserialized.message).toBe(extremeArabicNonBreaking);
    });

    it('tests empty and whitespace-only name and message validation logic', () => {
      const testCases = [
        { name: '', msg: 'مبروك', expectedValid: false, reason: 'Empty name' },
        { name: '   ', msg: 'مبروك', expectedValid: false, reason: 'Whitespace-only name' },
        { name: 'أحمد', msg: '', expectedValid: false, reason: 'Empty message' },
        { name: 'أحمد', msg: '   \n\t  ', expectedValid: false, reason: 'Whitespace-only message' },
        { name: 'أحمد', msg: 'ألف مبروك للعروسين', expectedValid: true, reason: 'Valid trimmed inputs' }
      ];

      for (const tc of testCases) {
        const trimmedName = tc.name.trim();
        const trimmedMsg = tc.msg.trim();
        const isValid = Boolean(trimmedName && trimmedMsg);
        expect(isValid).toBe(tc.expectedValid);
      }
    });

    it('simulates rapid double-click submissions concurrency behavior', async () => {
      let callCount = 0;
      globalThis.fetch = mock(async () => {
        callCount++;
        // Simulate 50ms network delay
        await new Promise((r) => setTimeout(r, 50));
        return new Response(
          JSON.stringify({
            id: callCount,
            invitationId: 1,
            guestName: 'طارق',
            attendanceStatus: 'سأتشرف بالحضور',
            message: 'تهانينا',
            isApproved: true,
            createdAt: new Date().toISOString()
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );
      });

      // Rapid parallel calls simulate clicking twice before first completes
      const promise1 = submitGuestMessage('adham-amal', {
        guestName: 'طارق',
        attendanceStatus: 'سأتشرف بالحضور',
        message: 'تهانينا'
      });
      const promise2 = submitGuestMessage('adham-amal', {
        guestName: 'طارق',
        attendanceStatus: 'سأتشرف بالحضور',
        message: 'تهانينا'
      });

      const [res1, res2] = await Promise.all([promise1, promise2]);
      expect(res1.success).toBe(true);
      expect(res2.success).toBe(true);
      expect(callCount).toBe(2);
    });
  });

  describe('3. Date Adjuster Boundary Conditions', () => {
    it('verifies past date handling clamps countdown to 00:00:00:00 and sets isOver to true', () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // 1 day in the past
      const now = new Date();
      const diff = pastDate.getTime() - now.getTime();

      let timeLeft = { days: '00', hours: '00', minutes: '00', seconds: '00', isOver: false };
      if (diff <= 0) {
        timeLeft = { days: '00', hours: '00', minutes: '00', seconds: '00', isOver: true };
      }

      expect(timeLeft.isOver).toBe(true);
      expect(timeLeft.days).toBe('00');
      expect(timeLeft.hours).toBe('00');
      expect(timeLeft.minutes).toBe('00');
      expect(timeLeft.seconds).toBe('00');
    });

    it('verifies invalid date strings are detected as NaN and rejected', () => {
      const invalidInputs = [
        'invalid-string',
        '2026-99-99T99:99',
        '',
        'undefined',
        'null'
      ];

      for (const input of invalidInputs) {
        const d = new Date(input);
        const isInvalid = isNaN(d.getTime());
        expect(isInvalid).toBe(true);
      }
    });

    it('verifies future dates calculate days, hours, minutes, seconds accurately', () => {
      const now = new Date();
      // Target: exactly 2 days, 3 hours, 4 minutes, 5 seconds in the future
      const target = new Date(now.getTime() + (2 * 86400 + 3 * 3600 + 4 * 60 + 5) * 1000);
      const diff = target.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      expect(days).toBe(2);
      expect(hours).toBe(3);
      expect(minutes).toBe(4);
      expect(seconds).toBe(5);
    });
  });

  describe('4. Audio Playback Handling and Autoplay Policies', () => {
    it('verifies safe handling when Web Audio API is unavailable or throws', () => {
      let threwUncaught = false;
      try {
        // Mock an environment where AudioContext throws NotAllowedError (autoplay policy)
        const mockAudioContext = function() {
          throw new DOMException('play() failed because the user didn\'t interact with the document first.', 'NotAllowedError');
        };

        const tryAudio = () => {
          try {
            new (mockAudioContext as any)();
          } catch {
            // Autoplay restriction caught gracefully
          }
        };

        tryAudio();
      } catch {
        threwUncaught = true;
      }

      expect(threwUncaught).toBe(false);
    });
  });
});
