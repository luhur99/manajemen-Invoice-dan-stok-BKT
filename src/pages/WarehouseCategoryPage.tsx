"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WarehouseCategory } from "@/types/data";

const getCategoryDisplay = (category: WarehouseCategory) => {
  switch (category) {
    case WarehouseCategory.SIAP_JUAL: return "Siap Jual";
    case WarehouseCategory.RISET: return "Riset";
    case WarehouseCategory.RETUR: return "Retur";
    case WarehouseCategory.BACKUP_TEKNISI: return "Backup Teknisi";
    default: return category;
  }
};

const WarehouseCategoryPage: React.FC = () => {
  const categories = Object.values(WarehouseCategory);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Manajemen Kategori Gudang</CardTitle>
        <CardDescription>Daftar kategori gudang yang digunakan dalam sistem.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Kode Kategori</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{getCategoryDisplay(category)}</TableCell>
                  <TableCell>{category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarehouseCategoryPage;