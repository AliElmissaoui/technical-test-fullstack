import React from "react";
import prisma from "../../lib/prisma";


export const revalidate = 0; // always fetch fresh (admin dashboard)


export default async function AdminPage() {
const payments = await prisma.payment.findMany({
orderBy: { createdAt: "desc" },
take: 50,
});


const total = payments.reduce((s, p) => s + p.amount, 0);


return (
<div style={{ padding: 24 }}>
<h1>Admin — Payments</h1>
{/* <p>Last {payments.length} payments • Total: {total} (cents)</p> */}
<p>Total: {(total / 100).toFixed(2)} EUR</p>


<div style={{ overflowX: "auto", marginTop: 12 }}>
<table style={{ width: "100%", borderCollapse: "collapse" }}>
<thead>
<tr>
<th style={{ textAlign: "left", padding: 8 }}>Date</th>
<th style={{ textAlign: "right", padding: 8 }}>Amount (cents)</th>
<th style={{ textAlign: "left", padding: 8 }}>Currency</th>
<th style={{ textAlign: "left", padding: 8 }}>Status</th>
<th style={{ textAlign: "left", padding: 8 }}>Session</th>
<th style={{ textAlign: "left", padding: 8 }}>Email</th>
</tr>
</thead>
<tbody>
{payments.map((p) => (
<tr key={p.id}>
<td style={{ padding: 8 }}>{new Date(p.createdAt).toLocaleString()}</td>
<td style={{ padding: 8, textAlign: "right" }}>{p.amount}</td>
<td style={{ padding: 8 }}>{p.currency}</td>
<td style={{ padding: 8 }}>{p.status}</td>
<td style={{ padding: 8 }}>{p.stripeSessionId}</td>
<td style={{ padding: 8 }}>{p.customerEmail ?? "-"}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}