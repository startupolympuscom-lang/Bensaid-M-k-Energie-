"use client";

import { useState } from "react";
import { Button } from "@/components/app/Button";
import { PlusIcon } from "@/components/app/Icons";
import { Drawer, Modal } from "@/components/app/Overlay";
import { EmptyState, PageTitle } from "@/components/app/States";
import { useToast } from "@/components/app/Toast";
import { AddressCard } from "@/features/profile/AddressCard";
import { AddressForm, emptyAddress } from "@/features/profile/AddressForm";
import { useAccount } from "@/lib/dispagaz/useDemo";
import {
  addAddress,
  cleanAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
  validateAddress,
  type AddressErrors,
} from "@/services/profileService";
import type { Address, AddressInput } from "@/types/dispagaz";

export function AddressesScreen() {
  const { account } = useAccount();
  const toast = useToast();
  const [editing, setEditing] = useState<{ id?: string; value: AddressInput } | null>(null);
  const [errors, setErrors] = useState<AddressErrors>({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Address | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (!account?.profile) return null;
  const addresses = [...account.addresses].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );

  function openNew() {
    setErrors({});
    setEditing({ value: emptyAddress(account!.profile!.phone) });
  }

  function openEdit(address: Address) {
    const { id, isDefault: _d, createdAt: _c, ...value } = address;
    setErrors({});
    setEditing({ id, value });
  }

  async function save() {
    if (!editing) return;
    const found = validateAddress(cleanAddress(editing.value));
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    const result = editing.id
      ? await updateAddress(editing.id, editing.value)
      : await addAddress(editing.value);
    setSaving(false);
    if (!result.ok) return toast(result.error, "error");
    toast(editing.id ? "Adresse mise à jour." : "Adresse ajoutée.", "success");
    setEditing(null);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deleteAddress(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    toast(result.ok ? "Adresse supprimée." : result.error, result.ok ? "success" : "error");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle
        title="Mes adresses"
        subtitle="Vos adresses de livraison enregistrées."
        action={
          <Button variant="secondary" onClick={openNew} className="shrink-0">
            <PlusIcon width={18} height={18} />
            <span className="hidden sm:inline">Ajouter une adresse</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        }
      />

      {addresses.length === 0 ? (
        <EmptyState
          title="Aucune adresse"
          text="Ajoutez une adresse pour vous faire livrer en quelques gestes."
          action={<Button onClick={openNew}>Ajouter une adresse</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li key={address.id}>
              <AddressCard
                address={address}
                actions={
                  <>
                    <Button
                      variant="tertiary"
                      className="h-10 px-4"
                      onClick={() => openEdit(address)}
                    >
                      Modifier
                    </Button>
                    {!address.isDefault ? (
                      <Button
                        variant="tertiary"
                        className="h-10 px-4"
                        onClick={async () => {
                          const r = await setDefaultAddress(address.id);
                          toast(
                            r.ok ? "Adresse par défaut mise à jour." : r.error,
                            r.ok ? "success" : "error",
                          );
                        }}
                      >
                        Définir par défaut
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      className="h-10 px-4 text-dz-danger"
                      onClick={() => setToDelete(address)}
                    >
                      Supprimer
                    </Button>
                  </>
                }
              />
            </li>
          ))}
        </ul>
      )}

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Modifier l’adresse" : "Nouvelle adresse"}
        footer={
          <Button size="lg" block onClick={save} loading={saving} loadingLabel="Enregistrement…">
            Enregistrer
          </Button>
        }
      >
        {editing ? (
          <AddressForm
            value={editing.value}
            onChange={(value) => setEditing({ ...editing, value })}
            errors={errors}
          />
        ) : null}
      </Drawer>

      <Modal
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title="Supprimer cette adresse ?"
        description={toDelete ? `« ${toDelete.label} » sera retirée de vos adresses.` : undefined}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={confirmDelete}
              loading={deleting}
              loadingLabel="Suppression…"
            >
              Supprimer
            </Button>
            <Button variant="tertiary" onClick={() => setToDelete(null)}>
              Annuler
            </Button>
          </>
        }
      >
        <p className="text-[0.9375rem] text-dz-muted">Cette action est définitive.</p>
      </Modal>
    </div>
  );
}
