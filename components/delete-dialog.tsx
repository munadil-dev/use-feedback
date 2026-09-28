import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function DeleteDialog({
  description,
  onConfirm,
  triggerLabel,
  triggerClassName,
  children,
  open,
  onOpenChange,
  returnFocusRef,
}: {
  description: string;
  onConfirm: () => void;
  triggerLabel?: string;
  triggerClassName?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <AlertDialogTrigger
          aria-label={triggerLabel}
          className={triggerClassName}
        >
          {children}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent
        onCloseAutoFocus={(event) => {
          if (!returnFocusRef?.current) return;
          event.preventDefault();
          returnFocusRef.current.focus();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 text-white shadow-none hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
