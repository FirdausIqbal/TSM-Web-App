"use client";

import { logout } from "@/actions/authentication";
import type { DeleteButtonProps } from "@/app/types/definitions";
import { changeRentalStatus } from "@/lib/data";
import { Loader2, Loader2Icon, LogOut, Notebook, Trash } from "lucide-react";
import { useState, useTransition, type ChangeEvent } from "react";
import { ConfirmModal } from "./modals/ConfirmModal";
import { formatStyleStatus } from "@/lib/utils";
import { deleteRental } from "@/actions/actions";

/**
 * Button SignOut
 * @void delete session
 */
export function SignOutButton() {
  return (
    <form action={logout}>
      <button
        className="bg-card-foreground rounded-2xl p-2 cursor-pointer border border-border"
        type="submit"
      >
        <div className="flex gap-2 text-popover">
          <LogOut size={20} />
          SignOut
        </div>
      </button>
    </form>
  );
}

/**
 *
 * @param property {title, message, id}
 * @void delete rental
 */
export function DeleteItemButton({ title, message, id }: DeleteButtonProps) {
  const [isModelOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    setIsModalOpen(false);

    startTransition(async () => {
      await deleteRental(id);
    });
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isPending}
        className="p-2 bg-destructive hover:bg-destructive/50 transition-colors duration-300 rounded-2xl text-background cursor-pointer"
      >
        {isPending ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Trash size={20} />
        )}
      </button>

      <ConfirmModal
        isOpen={isModelOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title={title}
        message={message}
      />
    </>
  );
}

export function StatusRentalButton({
  id,
  currStatus,
}: {
  id: string;
  currStatus: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const changeStatus = () => {
    startTransition(async () => {
      await changeRentalStatus(id, status);
      setIsOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className={`${formatStyleStatus(currStatus)} font-bold rounded-xl flex items-center justify-around p-2 gap-4`}
      >
        {!isPending ? (
          <>
            <Notebook size={20} />
            {currStatus}
          </>
          
        ) : (
          <Loader2Icon size={20} className="animate-spin" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center">
          <div className="w-full rounded-2xl border border-border p-4 bg-gray-300 max-w-md text-xl">
            <h3 className="text-foreground font-bold mb-2">Ubah Status</h3>
            <select
              name="status"
              className="bg-muted-foreground p-2 rounded-2xl"
              onChange={handleChange}
            >
              <option>--Pilih Status--</option>
              <option value="BOOKED">BOOKED</option>
              <option value="ON_GOING">ON GOING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELED</option>
            </select>

            <div className="text-foreground mt-4 flex justify-end gap-4">
              <button
                className="border border-border px-4 py-2 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-400 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Batal
              </button>
              <button
                className="border border-border px-4 py-2 bg-blue-600 text-white rounded-2xl cursor-pointer hover:bg-blue-400 transition-colors duration-200"
                onClick={changeStatus}
              >
                Ubah status
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
