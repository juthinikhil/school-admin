const express = require('express');
const app = express();
const PORT = process.env.PORT || 4003;
app.use(express.json());

let invoices = [
  { id: 'inv-101', studentId: 'stu01', studentName: 'Alex Smith', term: 'Fall 2026', amount: 1200, status: 'Paid' },
  { id: 'inv-102', studentId: 'stu02', studentName: 'Emma Davis', term: 'Fall 2026', amount: 1200, status: 'Pending' }
];

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'billing-service' }));
app.get('/invoices', (req, res) => res.json({ invoices }));
app.post('/invoices', (req, res) => {
  const inv = { id: `inv-${Date.now().toString().slice(-4)}`, ...req.body, status: 'Pending' };
  invoices.push(inv);
  res.status(201).json(inv);
});

app.listen(PORT, '0.0.0.0', () => console.log(`Billing Service on 0.0.0.0:${PORT}`));
