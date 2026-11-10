'use client';

import { useActionState } from 'react';
import { loginAdmin } from './actions';

export default function AdminAccessForm() {
  const [state, action, pending] = useActionState(loginAdmin, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="accessKey" className="block text-sm font-semibold text-stone-800 mb-2">
          Admin access key
        </label>
        <input
          id="accessKey"
          name="accessKey"
          type="password"
          autoComplete="current-password"
          required
          maxLength={512}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-[#242735] focus:ring-2 focus:ring-[#242735]/20"
        />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#242735] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#191C28] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Checking access…' : 'Continue to admin'}
      </button>
    </form>
  );
}
