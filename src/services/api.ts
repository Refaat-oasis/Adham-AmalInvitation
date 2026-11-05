import { Invitation, GuestMessage, CreateGuestMessage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Fetch wedding invitation details by unique slug.
 * Default slug: 'adham-amal'
 */
export async function fetchInvitation(slug: string = 'adham-amal'): Promise<Invitation | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/invitations/${encodeURIComponent(slug)}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.warn(`[API] Failed to fetch invitation "${slug}": ${res.status} ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('[API] Error fetching invitation:', error);
    return null;
  }
}

/**
 * Fetch approved guest wishes / RSVPs for a given invitation.
 */
export async function fetchGuestMessages(slug: string = 'adham-amal'): Promise<GuestMessage[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/invitations/${encodeURIComponent(slug)}/messages`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      console.warn(`[API] Failed to fetch messages for "${slug}": ${res.status} ${res.statusText}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('[API] Error fetching guest messages:', error);
    return [];
  }
}

/**
 * Submit a new guest wish / RSVP with attendance confirmation.
 */
export async function submitGuestMessage(
  slug: string = 'adham-amal',
  payload: CreateGuestMessage
): Promise<{ success: boolean; data?: GuestMessage; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/invitations/${encodeURIComponent(slug)}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const errorMsg = errJson.message || `خطأ ${res.status}: ${res.statusText}`;
      return {
        success: false,
        error: errorMsg
      };
    }

    const data: GuestMessage = await res.json();
    return {
      success: true,
      data
    };
  } catch (error: unknown) {
    console.error('[API] Error submitting guest message:', error);
    const errorMessage = error instanceof Error ? error.message : 'تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت.';
    return {
      success: false,
      error: errorMessage
    };
  }
}
