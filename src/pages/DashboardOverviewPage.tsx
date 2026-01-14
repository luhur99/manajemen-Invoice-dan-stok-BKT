"use client";

import React from 'react';

const DashboardOverviewPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Invoices</h2>
          <p className="text-3xl font-bold text-primary">120</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Schedules</h2>
          <p className="text-3xl font-bold text-yellow-600">15</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Stock Items</h2>
          <p className="text-3xl font-bold text-green-600">500</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Purchase Requests</h2>
          <p className="text-3xl font-bold text-orange-600">7</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Delivery Orders</h2>
          <p className="text-3xl font-bold text-blue-600">10</p>
        </div>
      </div>
      <div className="mt-8 bg-card p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <ul className="space-y-2">
          <li>Invoice #INV-2023-001 created.</li>
          <li>Schedule for Customer A updated.</li>
          <li>New stock item added: Product X.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;