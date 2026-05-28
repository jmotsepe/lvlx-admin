"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { addPointTier, editPointTier, deletePointTier } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { point_tiers } from "@prisma/client";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";

export default function PointTiersTable({
  pointTiers,
}: {
  pointTiers: point_tiers[];
}) {
  const [newCredits, setNewCredits] = useState("");
  const [newCost, setNewCost] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddTier = async () => {
    if (newCredits && newCost) {
      toast.promise(addPointTier(newCost, newCredits), {
        error: "Something went wrong when adding pricing",
        pending: "Adding pricing tier",
        success: "Pricing added successfully",
      });
      setEditingId(null);
    }
  };

  const handleEditTier = async (id: string, credits: string, cost: string) => {
    toast.promise(editPointTier(id, cost, credits), {
      error: "Something went wrong when updating pricing",
      pending: "Updating pricing tier...",
      success: "Pricing updated successfully",
    });
    setEditingId(null);
  };

  const handleDeleteTier = async (id: string) => {
    toast.promise(deletePointTier(id), {
      error: "Something went wrong when deleting pricing",
      pending: "Deleting pricing tier...",
      success: "Pricing deleted successfully",
    });
    setEditingId(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Add New Credit Tier</h2>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Credits"
            value={newCredits}
            onChange={(e) => setNewCredits(e.target.value)}
            aria-label="New credits amount"
          />
          <Input
            type="number"
            step="0.01"
            placeholder="Cost"
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            aria-label="New cost amount"
          />
          <Button onClick={handleAddTier}>Add Tier</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Cost (R)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pointTiers.map((tier, index) => (
            <TableRow key={tier.id}>
              <TableCell>
                <Badge>{index + 1}</Badge>
              </TableCell>
              <TableCell>
                {editingId === tier.id ? (
                  <Input
                    type="number"
                    defaultValue={tier.points}
                    onChange={(e) => (tier.points = e.target.value)}
                    aria-label={`Edit credits for tier ${tier.id}`}
                  />
                ) : (
                  `${tier.points} Credits`
                )}
              </TableCell>
              <TableCell>
                {editingId === tier.id ? (
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={tier.cost}
                    onChange={(e) => (tier.cost = e.target.value)}
                    aria-label={`Edit cost for tier ${tier.id}`}
                  />
                ) : (
                  `R${parseFloat(tier.cost).toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {editingId === tier.id ? (
                    <Button
                      onClick={() =>
                        handleEditTier(tier.id, tier.points, tier.cost)
                      }
                    >
                      Save
                    </Button>
                  ) : (
                    <Button onClick={() => setEditingId(tier.id)}>Edit</Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteTier(tier.id)}
                    aria-label={`Delete tier ${tier.id}`}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
