import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { fetchInvitation, fetchGuestMessages, submitGuestMessage } from './api';

describe('Invitations API Client', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('fetchInvitation', () => {
    it('returns invitation data when API call succeeds', async () => {
      const mockInvitation = {
        id: 1,
        slug: 'adham-amal',
        groomNameAr: 'أدهم',
        groomNameEn: 'Adham',
        brideNameAr: 'أمل',
        brideNameEn: 'Aml',
        eventDate: '2026-11-09T20:00:00',
        venueNameAr: 'قاعة جراند ستار 2',
        venueAddress: 'طريق منقباد، بني غالب، أسيوط',
        venueMapUrl: 'https://maps.google.com',
      };

      globalThis.fetch = mock(async () => {
        return new Response(JSON.stringify(mockInvitation), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }) as unknown as typeof fetch;

      const result = await fetchInvitation('adham-amal');
      expect(result).not.toBeNull();
      expect(result?.slug).toBe('adham-amal');
      expect(result?.groomNameAr).toBe('أدهم');
    });

    it('returns null when API returns 404 or 500', async () => {
      globalThis.fetch = mock(async () => {
        return new Response('Not Found', { status: 404 });
      }) as unknown as typeof fetch;

      const result = await fetchInvitation('non-existent');
      expect(result).toBeNull();
    });

    it('gracefully handles network errors and returns null', async () => {
      globalThis.fetch = mock(async () => {
        throw new Error('Network error');
      }) as unknown as typeof fetch;

      const result = await fetchInvitation('adham-amal');
      expect(result).toBeNull();
    });
  });

  describe('fetchGuestMessages', () => {
    it('returns list of messages when API call succeeds', async () => {
      const mockMessages = [
        {
          id: 1,
          invitationId: 1,
          guestName: 'أحمد محمود',
          attendanceStatus: 'سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨',
          message: 'ألف مبارك للعروسين!',
          isApproved: true,
          createdAt: new Date().toISOString(),
        },
      ];

      globalThis.fetch = mock(async () => {
        return new Response(JSON.stringify(mockMessages), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }) as unknown as typeof fetch;

      const result = await fetchGuestMessages('adham-amal');
      expect(result.length).toBe(1);
      expect(result[0].guestName).toBe('أحمد محمود');
    });

    it('returns empty array when API call fails', async () => {
      globalThis.fetch = mock(async () => {
        return new Response('Server Error', { status: 500 });
      }) as unknown as typeof fetch;

      const result = await fetchGuestMessages('adham-amal');
      expect(result).toEqual([]);
    });
  });

  describe('submitGuestMessage', () => {
    it('successfully submits new guest wish and returns created message', async () => {
      const newMsg = {
        guestName: 'محمد علي',
        attendanceStatus: 'سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨',
        message: 'مبارك زفاف أدهم وأمل',
      };

      const serverResponse = {
        id: 42,
        invitationId: 1,
        ...newMsg,
        isApproved: true,
        createdAt: new Date().toISOString(),
      };

      globalThis.fetch = mock(async () => {
        return new Response(JSON.stringify(serverResponse), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }) as unknown as typeof fetch;

      const result = await submitGuestMessage('adham-amal', newMsg);
      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(42);
      expect(result.data?.guestName).toBe('محمد علي');
    });

    it('returns error when API responds with failure code', async () => {
      globalThis.fetch = mock(async () => {
        return new Response(JSON.stringify({ message: 'الاسم مطلوب' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }) as unknown as typeof fetch;

      const result = await submitGuestMessage('adham-amal', {
        guestName: '',
        attendanceStatus: 'سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨',
        message: 'تهنئة',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('الاسم مطلوب');
    });

    it('handles unexpected network exceptions safely', async () => {
      globalThis.fetch = mock(async () => {
        throw new Error('Connection refused');
      }) as unknown as typeof fetch;

      const result = await submitGuestMessage('adham-amal', {
        guestName: 'خالد',
        attendanceStatus: 'أرسل أجمل التهاني 🤍',
        message: 'تهنئة من القلب',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Connection refused');
    });
  });
});
