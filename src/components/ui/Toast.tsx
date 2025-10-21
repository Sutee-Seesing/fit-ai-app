"use client";

import * as ToastPrimitive from '@radix-ui/react-toast';
import { useState } from 'react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

type ToastKind = 'info' | 'success' | 'error';

const kindStyles: Record<ToastKind, string> = {
  info: 'border-sky-300 bg-white',
  success: 'border-emerald-300 bg-white',
  error: 'border-rose-300 bg-white',
};

const kindIconColor: Record<ToastKind, string> = {
  info: 'text-sky-600',
  success: 'text-emerald-600',
  error: 'text-rose-600',
};

export function ToastProvider({ children }: { readonly children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider>
      {children}
      <ToastPrimitive.Viewport className="fixed bottom-6 right-6 w-96 z-50 p-4" />
    </ToastPrimitive.Provider>
  );
}

export function useToast() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [kind, setKind] = useState<ToastKind>('info');

  function show(message: string, t: ToastKind = 'info', duration?: number) {
    let d: number;
    if (typeof duration === 'number') d = duration;
    else if (t === 'info') d = 3500;
    else if (t === 'success') d = 3000;
    else d = 5000;
    setMsg(message);
    setKind(t);
    // Radix ToastRoot supports duration; we keep simple single-root state for PoC
    setOpen(false);
    setTimeout(() => setOpen(true), 10);
    // auto-close after duration
    setTimeout(() => setOpen(false), d + 60);
  }

  const iconFor = (k: ToastKind) => {
    const cls = kindIconColor[k];
    if (k === 'success') return <CheckCircle className={`w-5 h-5 ${cls}`} />;
    if (k === 'error') return <AlertCircle className={`w-5 h-5 ${cls}`} />;
    return <Info className={`w-5 h-5 ${cls}`} />;
  };

  let titleText = 'ข้อมูล';
  if (kind === 'success') titleText = 'สำเร็จ';
  else if (kind === 'error') titleText = 'เกิดข้อผิดพลาด';

  const Toast = (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      className={`rounded-md border p-3 shadow flex items-start gap-3 ${kindStyles[kind]}`}
      duration={4000}
    >
      <div aria-live="polite" className="sr-only" />
      <div className="mt-1">{iconFor(kind)}</div>
      <div className="flex-1">
        <ToastPrimitive.Title className="font-medium text-sm">{titleText}</ToastPrimitive.Title>
        <ToastPrimitive.Description className="text-sm mt-1">{msg}</ToastPrimitive.Description>
      </div>
      <div className="ml-2 flex items-start">
        <ToastPrimitive.Action asChild altText="Close notification">
          <button aria-label="Close" className="p-1 rounded hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </ToastPrimitive.Action>
      </div>
    </ToastPrimitive.Root>
  );

  return { show, Toast } as const;
}

export default { ToastProvider, useToast };
