// src/app/admin/page.tsx
import React from "react";
import prisma from "../../lib/prisma";
export const revalidate = 0;
export default async function AdminPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const total = payments.reduce((s, p) => s + p.amount, 0);
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Tableau de bord — Paiements
        </h1>

        <div className="flex items-center justify-between bg-white shadow-sm rounded-2xl px-6 py-4 mb-8">
          <p className="text-gray-600">
            Derniers <span className="font-semibold">{payments.length}</span>{" "}
            paiements enregistrés
          </p>
          <p className="text-lg font-semibold text-green-600">
            Total : {(total / 100).toFixed(2)} EUR
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="text-left py-3 px-4">Email client</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-right py-3 px-4">Montant (€)</th>
                <th className="text-left py-3 px-4">Devise</th>
                <th className="text-left py-3 px-4">Statut</th>
                <th className="text-left py-3 px-4">Session</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-gray-600">
                    {p.customerEmail ?? "-"}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(p.createdAt).toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">
                    {(p.amount / 100).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{p.currency}</td>
                  <td
                    className={`py-3 px-4 font-medium ${p.status === "paid"
                        ? "text-green-600"
                        : p.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                  >
                    {p.status}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {p.stripeSessionId}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          © Visionyze — Tableau de bord administrateur
        </p>
      </div>
    </div>
  );
}
