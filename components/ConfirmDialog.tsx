'use client'

import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

/**
 * Diálogo de confirmación reutilizable para acciones destructivas.
 *
 * Sustituye al `confirm()` del navegador para mantener la estética del panel.
 * Quien lo usa controla el estado abierto/cerrado y qué hacer al confirmar.
 */
export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Eliminar',
    cancelLabel = 'Cancelar',
    destructive = true,
    pending = false,
    errorMessage,
    onConfirm,
    onClose,
}: {
    open: boolean
    title: string
    description: React.ReactNode
    confirmLabel?: string
    cancelLabel?: string
    destructive?: boolean
    pending?: boolean
    errorMessage?: string | null
    onConfirm: () => void
    onClose: () => void
}) {
    return (
        <Dialog open={open} onOpenChange={(o) => !o && !pending && onClose()}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-[440px] bg-surface border-divider rounded-[2rem] p-6 gap-5"
            >
                <DialogHeader className="gap-4">
                    <div className="flex items-start gap-4">
                        <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                                destructive
                                    ? 'bg-error/10 text-error'
                                    : 'bg-primary/10 text-primary'
                            }`}
                        >
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col gap-2 min-w-0 pt-0.5">
                            <DialogTitle className="text-xl font-bold text-text-primary leading-tight">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-text-secondary leading-relaxed">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {errorMessage && (
                    <Alert variant="destructive" className="rounded-xl">
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter className="m-0 p-0 border-t-0 bg-transparent flex-row justify-end gap-2 sm:flex-row">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={pending}
                        className="rounded-xl h-11 px-5 border-divider/50 hover:bg-surface-variant text-text-secondary hover:text-text-primary"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={pending}
                        className={`rounded-xl h-11 px-5 font-bold ${
                            destructive
                                ? 'bg-error text-white hover:bg-error/90'
                                : ''
                        }`}
                    >
                        {pending ? 'Procesando...' : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
